import { useEffect, useMemo, useRef, useState } from 'react'
import { YIN } from 'pitchfinder'
import Layout, { EN } from '../../components/layout'
import { TrainerPromptCard, TrainerStatusPill } from '../../components/trainer-ui'
import { getRandomNote, NOTE_TO_PITCH_CLASS, NOTES } from '../../lib/utils'

const MODE_1 = 'mode-1'
const MODE_2 = 'mode-2'
const MODE_3 = 'mode-3'
const ROOT_RANDOM = 'root-random'
const ROOT_FIXED = 'root-fixed'

const TOLERANCE_CENTS = 70
const MATCH_FRAMES_REQUIRED = 2
const ADVANCE_COOLDOWN_MS = 250
const MIN_FREQUENCY_HZ = 60
const MAX_FREQUENCY_HZ = 1400
const MIN_RMS = 0.0003
const TRAINER_INTERVALS = ['1', '2b', '2', '3b', '3', '4', '5b', '5', '6b', '6', '7b', '7']
const PITCH_CLASS_LABELS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
const INTERVAL_TO_SEMITONES = {
  '1': 0,
  '2b': 1,
  '9b': 1,
  '2': 2,
  '9': 2,
  '2#': 3,
  '9#': 3,
  '3b': 3,
  '3': 4,
  '4': 5,
  '11': 5,
  '4#': 6,
  '11#': 6,
  '5b': 6,
  '5': 7,
  '5#': 8,
  '6b': 8,
  '13b': 8,
  '6': 9,
  '13': 9,
  '7b': 10,
  '7': 11,
}

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

function getModeLabel(lang, mode) {
  if (mode === MODE_1) {
    return lang === EN ? 'Random notes' : 'Note casuali'
  }

  if (mode === MODE_2) {
    return lang === EN ? 'Rooted intervals' : 'Intervalli da root'
  }

  return lang === EN ? 'Chained intervals' : 'Intervalli concatenati'
}

function getPitchClassLabel(pitchClass) {
  return PITCH_CLASS_LABELS[((pitchClass % 12) + 12) % 12]
}

function getIntervalSemitones(intervalLabel) {
  return INTERVAL_TO_SEMITONES[intervalLabel] ?? 0
}

function getTrainerInterval(previousInterval = null) {
  const options = TRAINER_INTERVALS.filter((interval) => interval !== previousInterval)
  const pickFrom = options.length > 0 ? options : TRAINER_INTERVALS
  const idx = Math.floor(Math.random() * pickFrom.length)
  return pickFrom[idx]
}

function getSelectableButtonClass(isSelected) {
  const common = 'px-3 py-2 rounded-full text-sm transition-colors'
  if (isSelected) {
    return `${common} bg-emerald-600 text-white`
  }

  return `${common} bg-slate-800 text-slate-200 hover:bg-emerald-600 hover:text-white border border-slate-700/80`
}

const ACTION_BUTTON_CLASS =
  'px-5 py-2 rounded-full transition-colors bg-slate-800 text-slate-100 hover:bg-emerald-600 hover:text-white border border-slate-700/80'

const DEBUG_BUTTON_BASE_CLASS =
  'mt-3 px-4 py-2 rounded-full text-xs transition-colors bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/80'

function getDebugButtonClass(isEnabled) {
  if (isEnabled) {
    return 'mt-3 px-4 py-2 rounded-full text-xs transition-colors bg-emerald-600 text-white'
  }
  return DEBUG_BUTTON_BASE_CLASS
}

export default function MicIntervalTrainerPage() {
  const [mode, setMode] = useState(MODE_1)
  const [minutes, setMinutes] = useState(2)
  const [rootMode, setRootMode] = useState(ROOT_RANDOM)
  const [fixedRoot, setFixedRoot] = useState('C')
  const [targetNote, setTargetNote] = useState(null)
  const [activeRoot, setActiveRoot] = useState(null)
  const [activeInterval, setActiveInterval] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isShowingRecap, setIsShowingRecap] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const [remainingMs, setRemainingMs] = useState(0)
  const [detectedFrequency, setDetectedFrequency] = useState(null)
  const [detectedPitchClass, setDetectedPitchClass] = useState(null)
  const [centsToTarget, setCentsToTarget] = useState(null)
  const [inputLevel, setInputLevel] = useState(0)
  const [isDebugEnabled, setIsDebugEnabled] = useState(false)

  const detectorsRef = useRef([])
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)
  const sessionEndAtRef = useRef(null)
  const sessionStartedAtRef = useRef(null)
  const matchedFramesRef = useRef(0)
  const lastAdvanceAtRef = useRef(0)
  const targetNoteRef = useRef(null)
  const activeRootRef = useRef(null)
  const activeIntervalRef = useRef(null)

  const [sessionElapsedMs, setSessionElapsedMs] = useState(null)

  const sessionDurationMs = useMemo(() => minutes * 60 * 1000, [minutes])

  useEffect(() => {
    targetNoteRef.current = targetNote
  }, [targetNote])

  useEffect(() => {
    activeRootRef.current = activeRoot
  }, [activeRoot])

  useEffect(() => {
    activeIntervalRef.current = activeInterval
  }, [activeInterval])

  const buildMode2Prompt = (previousRoot = null, previousInterval = null) => {
    // Mode 2 asks direct interval construction from the displayed root.
    const root = rootMode === ROOT_FIXED ? fixedRoot : getRandomNote(previousRoot)
    const interval = getTrainerInterval(previousInterval)
    const rootPitchClass = NOTE_TO_PITCH_CLASS[root]
    const targetPitchClass = (rootPitchClass + getIntervalSemitones(interval)) % 12
    const target = getPitchClassLabel(targetPitchClass)
    return { root, interval, target }
  }

  const buildChainedPrompt = (note, previousInterval = null) => {
    // Mode 3 asks reverse reasoning: "displayed note is the X of which note?"
    const interval = getTrainerInterval(previousInterval)
    const notePitchClass = NOTE_TO_PITCH_CLASS[note]
    const targetPitchClass = (notePitchClass - getIntervalSemitones(interval) + 12) % 12
    const target = getPitchClassLabel(targetPitchClass)
    return { root: note, interval, target }
  }

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
    if (sessionStartedAtRef.current) {
      setSessionElapsedMs(Math.max(0, performance.now() - sessionStartedAtRef.current))
    }
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

    // Normalize to keep pitch detection stable across very soft/loud inputs.
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

    if (!targetNoteRef.current) {
      matchedFramesRef.current = 0
      rafRef.current = requestAnimationFrame(runDetectionLoop)
      return
    }

    const targetPitchClass = NOTE_TO_PITCH_CLASS[targetNoteRef.current]
    const centsOffTarget = getCentsOffTarget(pitchInfo.midiFloat, targetPitchClass)
    setDetectedPitchClass(pitchInfo.pitchClass)
    setCentsToTarget(centsOffTarget)

    // Treat note as correct when detected pitch class is within tolerance.
    const isInTune = centsOffTarget <= TOLERANCE_CENTS

    if (isInTune) {
      matchedFramesRef.current += 1
      const hasHold = matchedFramesRef.current >= MATCH_FRAMES_REQUIRED
      const isOutOfCooldown = now - lastAdvanceAtRef.current >= ADVANCE_COOLDOWN_MS

      if (hasHold && isOutOfCooldown) {
        setCorrectAnswers((prev) => prev + 1)

        if (mode === MODE_2) {
          const nextPrompt = buildMode2Prompt(activeRootRef.current, activeIntervalRef.current)
          targetNoteRef.current = nextPrompt.target
          setTargetNote(nextPrompt.target)
          setActiveRoot(nextPrompt.root)
          setActiveInterval(nextPrompt.interval)
        } else if (mode === MODE_3) {
          const chainedRoot = targetNoteRef.current
          const nextPrompt = buildChainedPrompt(chainedRoot, activeIntervalRef.current)
          targetNoteRef.current = nextPrompt.target
          setTargetNote(nextPrompt.target)
          setActiveRoot(nextPrompt.root)
          setActiveInterval(nextPrompt.interval)
        } else {
          const nextTarget = getRandomNote(targetNoteRef.current)
          targetNoteRef.current = nextTarget
          setTargetNote(nextTarget)
          setActiveRoot(null)
          setActiveInterval(null)
        }

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

    if (mode === MODE_2) {
      const firstPrompt = buildMode2Prompt(activeRootRef.current, activeIntervalRef.current)
      targetNoteRef.current = firstPrompt.target
      setTargetNote(firstPrompt.target)
      setActiveRoot(firstPrompt.root)
      setActiveInterval(firstPrompt.interval)
    } else if (mode === MODE_3) {
      const firstRoot = getRandomNote(activeRootRef.current)
      const firstPrompt = buildChainedPrompt(firstRoot, activeIntervalRef.current)
      targetNoteRef.current = firstPrompt.target
      setTargetNote(firstPrompt.target)
      setActiveRoot(firstPrompt.root)
      setActiveInterval(firstPrompt.interval)
    } else {
      const firstTarget = getRandomNote(targetNoteRef.current)
      targetNoteRef.current = firstTarget
      setTargetNote(firstTarget)
      setActiveRoot(null)
      setActiveInterval(null)
    }

    setDetectedFrequency(null)
    setDetectedPitchClass(null)
    setCentsToTarget(null)
    setInputLevel(0)
    matchedFramesRef.current = 0
    lastAdvanceAtRef.current = 0

    try {
      // Open mic stream and start a lightweight RAF loop for real-time checks.
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
      sessionStartedAtRef.current = performance.now()
      setSessionElapsedMs(null)
      sessionEndAtRef.current = performance.now() + sessionDurationMs
      runDetectionLoop()
    } catch (error) {
      cleanupAudio()
      setIsRunning(false)
      setErrorMessage('mic-unavailable')
    }
  }

  const stopSession = () => {
    endSession()
  }

  const formatRemaining = (value) => {
    const totalSeconds = Math.ceil(value / 1000)
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const formatElapsed = (value) => {
    if (value == null || !Number.isFinite(value)) return '-'
    const seconds = value / 1000
    if (seconds < 10) return `${seconds.toFixed(2)}s`
    if (seconds < 60) return `${seconds.toFixed(1)}s`
    const m = Math.floor(seconds / 60)
    const s = Math.round(seconds % 60)
    return `${m}m ${s}s`
  }

  const notesPerSecond =
    sessionElapsedMs && sessionElapsedMs > 0 ? (correctAnswers / (sessionElapsedMs / 1000)).toFixed(2) : '0.00'

  return (
    <Layout>
      {({ lang }) => (
        <div className="flex min-h-screen">
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-xl md:text-2xl mb-6">{lang === EN ? 'Interval trainer' : 'Interval trainer'}</h1>

            <div className="w-full max-w-xl mb-4 flex justify-center px-1">
              <TrainerStatusPill>
                <div className="text-sm md:text-base text-slate-300">
                  {isRunning
                    ? `${getModeLabel(lang, mode)} • ${minutes}m`
                    : lang === EN
                    ? 'Set mode and duration, then start'
                    : 'Imposta modalità e durata, poi avvia'}
                </div>
              </TrainerStatusPill>
            </div>

            {!isRunning && !isShowingRecap && (
              <div className="w-full max-w-xl mb-6 p-2">
                <p className="mb-2 text-sm text-slate-400">{lang === EN ? 'Mode' : 'Modalita'}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <button
                    className={getSelectableButtonClass(mode === MODE_1)}
                    onClick={() => setMode(MODE_1)}
                    disabled={isRunning}
                  >
                    {lang === EN ? 'Random notes' : 'Note casuali'}
                  </button>
                  <button className={getSelectableButtonClass(mode === MODE_2)} onClick={() => setMode(MODE_2)}>
                    {lang === EN ? 'Rooted intervals' : 'Intervalli da root'}
                  </button>
                  <button className={getSelectableButtonClass(mode === MODE_3)} onClick={() => setMode(MODE_3)}>
                    {lang === EN ? 'Chained intervals' : 'Intervalli concatenati'}
                  </button>
                </div>

                {mode === MODE_2 && (
                  <div className="mb-4">
                    <p className="mb-2 text-sm text-slate-400">
                      {lang === EN ? 'Root behavior' : 'Comportamento root'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                      <button
                        className={getSelectableButtonClass(rootMode === ROOT_RANDOM)}
                        onClick={() => setRootMode(ROOT_RANDOM)}
                      >
                        {lang === EN ? 'Random root' : 'Root casuale'}
                      </button>
                      <button
                        className={getSelectableButtonClass(rootMode === ROOT_FIXED)}
                        onClick={() => setRootMode(ROOT_FIXED)}
                      >
                        {lang === EN ? 'Fixed root' : 'Root fissa'}
                      </button>
                    </div>

                    {rootMode === ROOT_FIXED && (
                      <div className="flex justify-center">
                        <select
                          className="px-3 py-2 rounded-full text-sm bg-slate-800 text-slate-200 border border-slate-700/80"
                          value={fixedRoot}
                          onChange={(event) => setFixedRoot(event.target.value)}
                        >
                          {NOTES.map((note) => (
                            <option key={note} value={note}>
                              {note}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}

                <p className="mb-2 text-sm text-slate-400">{lang === EN ? 'Duration' : 'Durata'}</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      className={getSelectableButtonClass(minutes === value)}
                      onClick={() => setMinutes(value)}
                      disabled={isRunning}
                    >
                      {value}m
                    </button>
                  ))}
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  {lang === EN
                    ? 'Microphone access is required to run this trainer.'
                    : 'Per usare questo trainer e necessario consentire l accesso al microfono.'}
                </p>
              </div>
            )}

            {!isRunning && !isShowingRecap && (
              <>
                <button className={ACTION_BUTTON_CLASS} onClick={startSession}>
                  {lang === EN ? 'Start' : 'Avvia'}
                </button>
                <button
                  className={getDebugButtonClass(isDebugEnabled)}
                  onClick={() => setIsDebugEnabled((prev) => !prev)}
                >
                  {isDebugEnabled ? 'Debug: on' : 'Debug: off'}
                </button>
              </>
            )}

            {isRunning && (
              <>
                {mode === MODE_1 ? (
                  <TrainerPromptCard>
                    <p className="text-3xl md:text-5xl font-mono font-semibold leading-tight text-emerald-300">
                      {targetNote || '-'}
                    </p>
                  </TrainerPromptCard>
                ) : (
                  <>
                    <TrainerPromptCard>
                      <p className="text-3xl md:text-5xl font-mono font-semibold leading-tight text-emerald-300">
                        {mode === MODE_2
                          ? lang === EN
                            ? `${activeInterval || '-'} of ${activeRoot || '-'}`
                            : `${activeInterval || '-'} di ${activeRoot || '-'}`
                          : lang === EN
                          ? `${activeRoot || '-'} is ${activeInterval || '-'} of?`
                          : `${activeRoot || '-'} è ${activeInterval || '-'} di?`}
                      </p>
                    </TrainerPromptCard>
                  </>
                )}
                <p className="text-lg mb-2">
                  {lang === EN ? 'Time left' : 'Tempo rimanente'}: {formatRemaining(remainingMs)}
                </p>
                <p className="text-lg mb-6">
                  {lang === EN ? 'Completed' : 'Completati'}: {correctAnswers}
                </p>
                {isDebugEnabled && (
                  <p className="text-xs mb-6 text-slate-400 font-mono bg-slate-900 border border-slate-700/80 rounded-full px-4 py-2">
                    Hz {detectedFrequency ? detectedFrequency.toFixed(1) : '-'} | In {inputLevel.toFixed(4)} | Note{' '}
                    {detectedPitchClass != null ? PITCH_CLASS_LABELS[detectedPitchClass] : '-'} | Ct{' '}
                    {centsToTarget != null && Number.isFinite(centsToTarget) ? centsToTarget.toFixed(1) : '-'} | F{' '}
                    {matchedFramesRef.current}/{MATCH_FRAMES_REQUIRED}
                  </p>
                )}
                <button className={ACTION_BUTTON_CLASS} onClick={stopSession}>
                  {lang === EN ? 'Stop' : 'Ferma'}
                </button>
                <button
                  className={getDebugButtonClass(isDebugEnabled)}
                  onClick={() => setIsDebugEnabled((prev) => !prev)}
                >
                  {isDebugEnabled ? 'Debug: on' : 'Debug: off'}
                </button>
              </>
            )}

            {isShowingRecap && (
              <div className="w-full max-w-2xl mx-auto p-6 text-center rounded-3xl border border-slate-700/80 bg-slate-900 shadow-xl shadow-black/20">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                  {lang === EN ? 'Session recap' : 'Riepilogo sessione'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
                  <div className="rounded-xl border border-slate-700/80 bg-slate-800/80 p-3">
                    <p className="text-xs text-slate-400 mb-1">
                      {lang === EN ? 'Effective duration' : 'Durata effettiva'}
                    </p>
                    <p className="text-lg font-semibold">{formatElapsed(sessionElapsedMs)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-700/80 bg-slate-800/80 p-3">
                    <p className="text-xs text-slate-400 mb-1">{lang === EN ? 'Completed notes' : 'Note completate'}</p>
                    <p className="text-lg font-semibold">{correctAnswers}</p>
                  </div>
                  <div className="rounded-xl border border-slate-700/80 bg-slate-800/80 p-3">
                    <p className="text-xs text-slate-400 mb-1">
                      {lang === EN ? 'Notes per second' : 'Note al secondo'}
                    </p>
                    <p className="text-lg font-semibold">{notesPerSecond}</p>
                  </div>
                </div>

                <p className="mb-5 text-sm text-slate-400">
                  {lang === EN ? 'Selected duration' : 'Durata selezionata'}: {minutes}{' '}
                  {lang === EN ? 'minutes' : 'minuti'}
                </p>

                <button className={ACTION_BUTTON_CLASS} onClick={() => setIsShowingRecap(false)}>
                  {lang === EN ? 'Try again' : 'Riprova'}
                </button>
              </div>
            )}

            {errorMessage === 'mic-unavailable' && (
              <p className="mt-6 text-red-400 max-w-xl">
                {lang === EN
                  ? 'Microphone unavailable. Use the manual interval trainer instead.'
                  : 'Microfono non disponibile. Usa invece il trainer manuale.'}{' '}
                <a className="cv-link" href="/music/manual-interval-trainer">
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
