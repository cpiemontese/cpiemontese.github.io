import { useEffect, useMemo, useRef, useState } from 'react'
import { YIN } from 'pitchfinder'
import Layout, { EN } from '../../components/layout'
import { getRandomNote, NOTE_TO_PITCH_CLASS } from '../../lib/utils'

const MODE_1 = 'mode-1'
const MODE_2 = 'mode-2'
const MODE_3 = 'mode-3'

const TOLERANCE_CENTS = 70
const MATCH_FRAMES_REQUIRED = 2
const ADVANCE_COOLDOWN_MS = 250
const MIN_FREQUENCY_HZ = 60
const MAX_FREQUENCY_HZ = 1400
const MIN_RMS = 0.0003
const PITCH_CLASS_LABELS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

const midiFromFrequency = (frequency) => 69 + 12 * Math.log2(frequency / 440)

function getPitchInfo(frequency) {
  if (!frequency || !Number.isFinite(frequency)) return null

  const midiFloat = midiFromFrequency(frequency)
  const nearestMidi = Math.round(midiFloat)
  const centsOff = Math.abs((midiFloat - nearestMidi) * 100)
  const pitchClass = ((nearestMidi % 12) + 12) % 12

  return { centsOff, pitchClass, midiFloat }
}

function getCentsOffTarget(midiFloat, targetPitchClass) {
  const centerMidi = Math.round(midiFloat)
  let best = Infinity

  for (let i = -24; i <= 24; i++) {
    const candidateMidi = centerMidi + i
    const candidatePitchClass = ((candidateMidi % 12) + 12) % 12
    if (candidatePitchClass !== targetPitchClass) continue

    const centsDistance = Math.abs((midiFloat - candidateMidi) * 100)
    if (centsDistance < best) {
      best = centsDistance
    }
  }

  return best
}

function getRms(floatBuffer) {
  let sum = 0
  for (let i = 0; i < floatBuffer.length; i++) {
    const sample = floatBuffer[i]
    sum += sample * sample
  }
  return Math.sqrt(sum / floatBuffer.length)
}

function normalizeBuffer(floatBuffer) {
  let maxAbs = 0
  for (let i = 0; i < floatBuffer.length; i++) {
    const value = Math.abs(floatBuffer[i])
    if (value > maxAbs) {
      maxAbs = value
    }
  }

  if (maxAbs < 1e-6) {
    return floatBuffer
  }

  const gain = 1 / maxAbs
  const normalized = new Float32Array(floatBuffer.length)
  for (let i = 0; i < floatBuffer.length; i++) {
    normalized[i] = floatBuffer[i] * gain
  }

  return normalized
}

export default function MicIntervalTrainerPage() {
  const [mode, setMode] = useState(MODE_1)
  const [minutes, setMinutes] = useState(2)
  const [targetNote, setTargetNote] = useState(() => getRandomNote())
  const [isRunning, setIsRunning] = useState(false)
  const [isShowingRecap, setIsShowingRecap] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const [remainingMs, setRemainingMs] = useState(0)
  const [detectedFrequency, setDetectedFrequency] = useState(null)
  const [detectedPitchClass, setDetectedPitchClass] = useState(null)
  const [centsToTarget, setCentsToTarget] = useState(null)
  const [inputLevel, setInputLevel] = useState(0)

  const detectorsRef = useRef([])
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)
  const sessionEndAtRef = useRef(null)
  const matchedFramesRef = useRef(0)
  const lastAdvanceAtRef = useRef(0)
  const targetNoteRef = useRef(targetNote)

  const sessionDurationMs = useMemo(() => minutes * 60 * 1000, [minutes])

  useEffect(() => {
    targetNoteRef.current = targetNote
  }, [targetNote])

  const detectFrequency = (floatBuffer) => {
    for (const detector of detectorsRef.current) {
      const detected = detector(floatBuffer)
      if (detected && Number.isFinite(detected) && detected >= MIN_FREQUENCY_HZ && detected <= MAX_FREQUENCY_HZ) {
        return detected
      }
    }
    return null
  }

  const cleanupAudio = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    detectorsRef.current = []
    analyserRef.current = null
  }

  useEffect(() => {
    return () => {
      cleanupAudio()
    }
  }, [])

  const endSession = () => {
    setIsRunning(false)
    setIsShowingRecap(true)
    cleanupAudio()
  }

  const runDetectionLoop = () => {
    const analyser = analyserRef.current
    if (!analyser || !sessionEndAtRef.current) return

    const now = performance.now()
    const newRemaining = Math.max(0, sessionEndAtRef.current - now)
    setRemainingMs(newRemaining)

    if (newRemaining <= 0) {
      endSession()
      return
    }

    const floatBuffer = new Float32Array(analyser.fftSize)
    analyser.getFloatTimeDomainData(floatBuffer)

    const rms = getRms(floatBuffer)
    setInputLevel(rms)

    if (rms < MIN_RMS) {
      setDetectedFrequency(null)
      setDetectedPitchClass(null)
      setCentsToTarget(null)
      matchedFramesRef.current = 0
      rafRef.current = requestAnimationFrame(runDetectionLoop)
      return
    }

    const normalizedBuffer = normalizeBuffer(floatBuffer)
    const frequency = detectFrequency(normalizedBuffer)
    setDetectedFrequency(frequency)
    const pitchInfo = getPitchInfo(frequency)

    if (!pitchInfo) {
      setDetectedPitchClass(null)
      setCentsToTarget(null)
      matchedFramesRef.current = 0
      rafRef.current = requestAnimationFrame(runDetectionLoop)
      return
    }

    const targetPitchClass = NOTE_TO_PITCH_CLASS[targetNoteRef.current]
    const centsOffTarget = getCentsOffTarget(pitchInfo.midiFloat, targetPitchClass)
    setDetectedPitchClass(pitchInfo.pitchClass)
    setCentsToTarget(centsOffTarget)

    const isInTune = centsOffTarget <= TOLERANCE_CENTS

    if (isInTune) {
      matchedFramesRef.current += 1
      const hasHold = matchedFramesRef.current >= MATCH_FRAMES_REQUIRED
      const isOutOfCooldown = now - lastAdvanceAtRef.current >= ADVANCE_COOLDOWN_MS

      if (hasHold && isOutOfCooldown) {
        setCorrectAnswers((prev) => prev + 1)
        const nextTarget = getRandomNote(targetNoteRef.current)
        targetNoteRef.current = nextTarget
        setTargetNote(nextTarget)
        matchedFramesRef.current = 0
        lastAdvanceAtRef.current = now
      }
    } else {
      matchedFramesRef.current = 0
    }

    rafRef.current = requestAnimationFrame(runDetectionLoop)
  }

  const startSession = async () => {
    setErrorMessage(null)
    setIsShowingRecap(false)
    setCorrectAnswers(0)
    const firstTarget = getRandomNote(targetNoteRef.current)
    targetNoteRef.current = firstTarget
    setTargetNote(firstTarget)
    setDetectedFrequency(null)
    setDetectedPitchClass(null)
    setCentsToTarget(null)
    setInputLevel(0)
    matchedFramesRef.current = 0
    lastAdvanceAtRef.current = 0

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const context = new window.AudioContext()
      await context.resume()
      const source = context.createMediaStreamSource(stream)
      const analyser = context.createAnalyser()

      analyser.fftSize = 4096
      source.connect(analyser)

      detectorsRef.current = [YIN({ sampleRate: context.sampleRate, threshold: 0.1, probabilityThreshold: 0.4 })]

      streamRef.current = stream
      audioContextRef.current = context
      sourceRef.current = source
      analyserRef.current = analyser

      setRemainingMs(sessionDurationMs)
      setIsRunning(true)
      sessionEndAtRef.current = performance.now() + sessionDurationMs
      runDetectionLoop()
    } catch (error) {
      cleanupAudio()
      setIsRunning(false)
      setErrorMessage('mic-unavailable')
    }
  }

  const stopSession = () => {
    setIsRunning(false)
    setDetectedFrequency(null)
    setDetectedPitchClass(null)
    setCentsToTarget(null)
    setInputLevel(0)
    cleanupAudio()
  }

  const formatRemaining = (value) => {
    const totalSeconds = Math.ceil(value / 1000)
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return (
    <Layout>
      {({ lang }) => (
        <div className="flex min-h-screen">
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-xl md:text-2xl mb-6">
              {lang === EN ? 'Microphone interval trainer' : 'Interval trainer microfono'}
            </h1>

            <div className="w-full max-w-xl mb-6 border rounded-lg p-4">
              <p className="mb-2 text-sm text-gray-500">{lang === EN ? 'Mode' : 'Modalita'}</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <button
                  className={`px-3 py-2 rounded border ${mode === MODE_1 ? 'bg-emerald-600 text-white' : ''}`}
                  onClick={() => setMode(MODE_1)}
                  disabled={isRunning}
                >
                  {lang === EN ? '1. Random note stream' : '1. Stream note random'}
                </button>
                <button
                  className={`px-3 py-2 rounded border ${mode === MODE_2 ? 'bg-emerald-600 text-white' : ''}`}
                  onClick={() => setMode(MODE_2)}
                  disabled
                  title={lang === EN ? 'Coming in next step' : 'In arrivo nel prossimo step'}
                >
                  {lang === EN ? '2. Interval from root' : '2. Intervallo da root'}
                </button>
                <button
                  className={`px-3 py-2 rounded border ${mode === MODE_3 ? 'bg-emerald-600 text-white' : ''}`}
                  onClick={() => setMode(MODE_3)}
                  disabled
                  title={lang === EN ? 'Coming in next step' : 'In arrivo nel prossimo step'}
                >
                  {lang === EN ? '3. Chained intervals' : '3. Intervalli concatenati'}
                </button>
              </div>

              <p className="mb-2 text-sm text-gray-500">{lang === EN ? 'Duration' : 'Durata'}</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    className={`px-3 py-2 rounded border ${minutes === value ? 'bg-emerald-600 text-white' : ''}`}
                    onClick={() => setMinutes(value)}
                    disabled={isRunning}
                  >
                    {value}m
                  </button>
                ))}
              </div>
            </div>

            {!isRunning && !isShowingRecap && (
              <>
                <p className="text-2xl md:text-4xl mb-6">
                  {lang === EN ? 'Target note' : 'Nota target'}: <span className="font-mono">{targetNote}</span>
                </p>
                <button className="px-4 py-2 border rounded" onClick={startSession}>
                  {lang === EN ? 'Start with microphone' : 'Avvia con microfono'}
                </button>
              </>
            )}

            {isRunning && (
              <>
                <p className="text-2xl md:text-4xl mb-2">
                  {lang === EN ? 'Play' : 'Suona'}: <span className="font-mono">{targetNote}</span>
                </p>
                <p className="text-lg mb-2">
                  {lang === EN ? 'Time left' : 'Tempo rimanente'}: {formatRemaining(remainingMs)}
                </p>
                <p className="text-lg mb-6">
                  {lang === EN ? 'Completed' : 'Completati'}: {correctAnswers}
                </p>
                <p className="text-sm mb-6 text-gray-500">
                  {lang === EN ? 'Detected Hz' : 'Hz rilevati'}:{' '}
                  {detectedFrequency ? detectedFrequency.toFixed(1) : '-'}
                </p>
                <p className="text-sm mb-6 text-gray-500">
                  {lang === EN ? 'Input level' : 'Livello input'}: {inputLevel.toFixed(4)}
                </p>
                <p className="text-sm mb-6 text-gray-500">
                  {lang === EN ? 'Detected note' : 'Nota rilevata'}:{' '}
                  {detectedPitchClass != null ? PITCH_CLASS_LABELS[detectedPitchClass] : '-'}
                  {' | '}
                  {lang === EN ? 'cents to target' : 'cents da target'}:{' '}
                  {centsToTarget != null && Number.isFinite(centsToTarget) ? centsToTarget.toFixed(1) : '-'}
                </p>
                <button className="px-4 py-2 border rounded" onClick={stopSession}>
                  {lang === EN ? 'Stop' : 'Ferma'}
                </button>
              </>
            )}

            {isShowingRecap && (
              <div className="w-full max-w-xl border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">{lang === EN ? 'Session recap' : 'Riepilogo sessione'}</h2>
                <p className="mb-2">
                  {lang === EN ? 'Duration' : 'Durata'}: {minutes} {lang === EN ? 'minutes' : 'minuti'}
                </p>
                <p className="mb-4">
                  {lang === EN ? 'Completed intervals/notes' : 'Intervalli/note completati'}: {correctAnswers}
                </p>
                <button className="px-4 py-2 border rounded" onClick={() => setIsShowingRecap(false)}>
                  {lang === EN ? 'Try again' : 'Riprova'}
                </button>
              </div>
            )}

            {errorMessage === 'mic-unavailable' && (
              <p className="mt-6 text-red-400 max-w-xl">
                {lang === EN
                  ? 'Microphone unavailable. Use the manual interval trainer instead.'
                  : 'Microfono non disponibile. Usa invece il trainer manuale.'}{' '}
                <a className="text-emerald-500 dark:text-emerald-400" href="/music/manual-interval-trainer">
                  /music/manual-interval-trainer
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
