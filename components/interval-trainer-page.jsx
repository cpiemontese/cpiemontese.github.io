import { useEffect, useMemo, useRef, useState } from 'react'
import { YIN } from 'pitchfinder'
import Layout, { EN } from './layout'
import { TrainerPromptCard, TrainerStatusPill } from './trainer-ui'
import { getRandomNote, getRandomUsefulRoot, NOTE_TO_PITCH_CLASS, USEFUL_ROOTS } from '../lib/utils'

const ANCHOR_FIXED = 'anchor-fixed'
const ANCHOR_DYNAMIC = 'anchor-dynamic'
const DIRECTION_FORWARD = 'direction-forward'
const DIRECTION_BACKWARD = 'direction-backward'

const TOLERANCE_CENTS = 70
const MATCH_FRAMES_REQUIRED = 2
const ADVANCE_COOLDOWN_MS = 250
const MIN_FREQUENCY_HZ = 60
const MAX_FREQUENCY_HZ = 1400
const MIN_RMS = 0.0003
const TRAINER_INTERVALS = ['1', '2b', '2', '3b', '3', '4', '5b', '5', '6b', '6', '7b', '7']
const INTERVAL_DISPLAY_ALIASES = {
  2: ['2', '9'],
  4: ['4', '11'],
  6: ['6', '13'],
}
const PITCH_CLASS_LABELS_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const PITCH_CLASS_LABELS_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
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

function getExerciseLabel(lang, noteOnly, anchorType, isChained, direction) {
  if (noteOnly) {
    return lang === EN ? 'Note recognition' : 'Riconoscimento note'
  }

  const anchorLabel =
    anchorType === ANCHOR_FIXED
      ? lang === EN
        ? 'Fixed note'
        : 'Nota fissa'
      : lang === EN
      ? 'Dynamic note'
      : 'Nota dinamica'
  const chainedLabel =
    anchorType === ANCHOR_FIXED
      ? null
      : isChained
      ? lang === EN
        ? 'Chained'
        : 'Chained'
      : lang === EN
      ? 'Not chained'
      : 'Non chained'
  const directionLabel =
    direction === DIRECTION_FORWARD ? (lang === EN ? 'Forward' : 'Forward') : lang === EN ? 'Backward' : 'Backward'

  return [anchorLabel, chainedLabel, directionLabel].filter(Boolean).join(' • ')
}

function getPitchClassLabel(pitchClass, preferSharp = false) {
  const labels = preferSharp ? PITCH_CLASS_LABELS_SHARP : PITCH_CLASS_LABELS_FLAT
  return labels[((pitchClass % 12) + 12) % 12]
}

function shouldPreferSharps(noteLabel) {
  return typeof noteLabel === 'string' && noteLabel.includes('#')
}

function getIntervalSemitones(intervalLabel) {
  return INTERVAL_TO_SEMITONES[intervalLabel] ?? 0
}

function getTrainerInterval(previousInterval = null) {
  const previousSemitones = previousInterval != null ? getIntervalSemitones(previousInterval) : null
  const options = TRAINER_INTERVALS.filter((interval) => getIntervalSemitones(interval) !== previousSemitones)
  const pickFrom = options.length > 0 ? options : TRAINER_INTERVALS
  const idx = Math.floor(Math.random() * pickFrom.length)
  const baseInterval = pickFrom[idx]
  const aliases = INTERVAL_DISPLAY_ALIASES[baseInterval]

  if (!aliases) {
    return baseInterval
  }

  const aliasIndex = Math.floor(Math.random() * aliases.length)
  return aliases[aliasIndex]
}

function getSelectableButtonClass(isSelected) {
  const common = 'px-3 py-2 rounded-full text-sm transition-colors'
  if (isSelected) {
    return `${common} bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white`
  }

  return `${common} bg-gray-200 text-gray-700 hover:bg-emerald-600 hover:text-white dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-emerald-600`
}

const ACTION_BUTTON_CLASS =
  'px-5 py-2 rounded-full transition-colors bg-gray-200 text-gray-800 hover:bg-emerald-600 hover:text-white dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-emerald-600'

const TOGGLE_BUTTON_BASE_CLASS =
  'mt-3 px-4 py-2 rounded-full text-xs transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'

function getToggleButtonClass(isEnabled) {
  if (isEnabled) {
    return 'mt-3 px-4 py-2 rounded-full text-xs transition-colors bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white'
  }
  return TOGGLE_BUTTON_BASE_CLASS
}

function renderIntervalLabel(interval) {
  if (interval === '11' || interval === '13') {
    return <span className="tracking-[-0.05em]">{interval}</span>
  }

  return interval
}

export function IntervalTrainerPage({ noteOnly = false, forceMic = false, defaultMicEnabled = true }) {
  const [anchorType, setAnchorType] = useState(ANCHOR_DYNAMIC)
  const [isChained, setIsChained] = useState(false)
  const [direction, setDirection] = useState(DIRECTION_FORWARD)
  const [minutes, setMinutes] = useState(2)
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
  const [isMicEnabled, setIsMicEnabled] = useState(forceMic ? true : defaultMicEnabled)

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
  const timerIntervalRef = useRef(null)

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

  const buildIntervalPrompt = (previousRoot = null, previousInterval = null, previousTarget = null) => {
    const useFixedAnchor = anchorType === ANCHOR_FIXED
    const canChain = !useFixedAnchor && isChained
    const root = useFixedAnchor
      ? fixedRoot
      : canChain && previousTarget
      ? previousTarget
      : getRandomUsefulRoot(previousRoot)
    const interval = getTrainerInterval(previousInterval)
    const rootPitchClass = NOTE_TO_PITCH_CLASS[root]

    if (rootPitchClass == null) {
      return { root, interval, target: getRandomNote() }
    }

    const semitones = getIntervalSemitones(interval)
    const preferSharp = shouldPreferSharps(root)
    const targetPitchClass =
      direction === DIRECTION_FORWARD ? (rootPitchClass + semitones) % 12 : (rootPitchClass - semitones + 12) % 12
    const target = getPitchClassLabel(targetPitchClass, preferSharp)
    return { root, interval, target }
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

  const cleanupTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      cleanupTimer()
      cleanupAudio()
    }
  }, [])

  const endSession = () => {
    cleanupTimer()
    if (sessionStartedAtRef.current) {
      setSessionElapsedMs(Math.max(0, performance.now() - sessionStartedAtRef.current))
    }
    setIsRunning(false)
    setIsShowingRecap(true)
    cleanupAudio()
  }

  const startTimer = () => {
    cleanupTimer()
    timerIntervalRef.current = setInterval(() => {
      const endAt = sessionEndAtRef.current
      if (!endAt) return

      const newRemaining = Math.max(0, endAt - performance.now())
      setRemainingMs(newRemaining)

      if (newRemaining <= 0) {
        endSession()
      }
    }, 100)
  }

  const advancePrompt = (now = performance.now()) => {
    setCorrectAnswers((prev) => prev + 1)

    if (noteOnly) {
      const nextTarget = getRandomNote(targetNoteRef.current)
      targetNoteRef.current = nextTarget
      setTargetNote(nextTarget)
      setActiveRoot(null)
      setActiveInterval(null)
    } else {
      const nextPrompt = buildIntervalPrompt(activeRootRef.current, activeIntervalRef.current, targetNoteRef.current)
      targetNoteRef.current = nextPrompt.target
      setTargetNote(nextPrompt.target)
      setActiveRoot(nextPrompt.root)
      setActiveInterval(nextPrompt.interval)
    }

    matchedFramesRef.current = 0
    lastAdvanceAtRef.current = now
  }

  const runDetectionLoop = () => {
    const analyser = analyserRef.current
    if (!analyser || !sessionEndAtRef.current || !isMicEnabled) return

    const now = performance.now()

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
    if (targetPitchClass == null) {
      setDetectedPitchClass(pitchInfo.pitchClass)
      setCentsToTarget(null)
      matchedFramesRef.current = 0
      rafRef.current = requestAnimationFrame(runDetectionLoop)
      return
    }
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
        advancePrompt(now)
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

    if (noteOnly) {
      const firstTarget = getRandomNote(targetNoteRef.current)
      targetNoteRef.current = firstTarget
      setTargetNote(firstTarget)
      setActiveRoot(null)
      setActiveInterval(null)
    } else {
      const firstPrompt = buildIntervalPrompt(activeRootRef.current, activeIntervalRef.current, targetNoteRef.current)
      targetNoteRef.current = firstPrompt.target
      setTargetNote(firstPrompt.target)
      setActiveRoot(firstPrompt.root)
      setActiveInterval(firstPrompt.interval)
    }

    setDetectedFrequency(null)
    setDetectedPitchClass(null)
    setCentsToTarget(null)
    setInputLevel(0)
    matchedFramesRef.current = 0
    lastAdvanceAtRef.current = 0
    setRemainingMs(sessionDurationMs)
    setSessionElapsedMs(null)

    sessionStartedAtRef.current = performance.now()
    sessionEndAtRef.current = performance.now() + sessionDurationMs
    setIsRunning(true)
    startTimer()

    if (!isMicEnabled) {
      cleanupAudio()
      return
    }

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

      runDetectionLoop()
    } catch (error) {
      cleanupTimer()
      cleanupAudio()
      setIsRunning(false)
      sessionStartedAtRef.current = null
      sessionEndAtRef.current = null
      setErrorMessage('mic-unavailable')
    }
  }

  const stopSession = () => {
    endSession()
  }

  const manualAdvance = () => {
    if (!isRunning) return

    const now = performance.now()
    const isOutOfCooldown = now - lastAdvanceAtRef.current >= ADVANCE_COOLDOWN_MS
    if (!isOutOfCooldown) return

    advancePrompt(now)
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
  const debugPreferSharp = shouldPreferSharps(activeRoot || targetNote)

  const handleMainAreaClick = (event) => {
    if (!isRunning) return
    if (event.target.closest('[data-control="true"]')) return
    manualAdvance()
  }

  return (
    <Layout>
      {({ lang }) => (
        <div className="flex min-h-screen" onClick={handleMainAreaClick}>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-xl md:text-2xl mb-6">{noteOnly ? 'Note trainer' : 'Interval trainer'}</h1>

            <div className="w-full max-w-xl mb-4 flex justify-center px-1">
              <TrainerStatusPill>
                <div className="text-sm md:text-base text-gray-500">
                  {isShowingRecap
                    ? lang === EN
                      ? 'Session completed'
                      : 'Sessione completata'
                    : isRunning
                    ? `${getExerciseLabel(lang, noteOnly, anchorType, isChained, direction)} • ${minutes}m`
                    : lang === EN
                    ? noteOnly
                      ? 'Set duration, then start'
                      : 'Set exercise and duration, then start'
                    : noteOnly
                    ? 'Imposta la durata, poi avvia'
                    : 'Imposta esercizio e durata, poi avvia'}
                </div>
              </TrainerStatusPill>
            </div>

            {!isRunning && !isShowingRecap && (
              <div className="w-full max-w-xl mb-6 p-2">
                {!noteOnly && (
                  <>
                    <p className="mb-2 text-sm text-gray-500">{lang === EN ? 'Anchor type' : 'Tipo di riferimento'}</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      <button
                        className={getSelectableButtonClass(anchorType === ANCHOR_FIXED)}
                        onClick={() => setAnchorType(ANCHOR_FIXED)}
                        disabled={isRunning}
                      >
                        {lang === EN ? 'Fixed' : 'Fisso'}
                      </button>
                      <button
                        className={getSelectableButtonClass(anchorType === ANCHOR_DYNAMIC)}
                        onClick={() => setAnchorType(ANCHOR_DYNAMIC)}
                      >
                        {lang === EN ? 'Dynamic' : 'Dinamico'}
                      </button>
                    </div>

                    {anchorType === ANCHOR_DYNAMIC && (
                      <>
                        <p className="mb-2 text-sm text-gray-500">{lang === EN ? 'Chained' : 'Concatenato'}</p>
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                          <button className={getSelectableButtonClass(!isChained)} onClick={() => setIsChained(false)}>
                            No
                          </button>
                          <button className={getSelectableButtonClass(isChained)} onClick={() => setIsChained(true)}>
                            {lang === EN ? 'Yes' : 'Si'}
                          </button>
                        </div>
                      </>
                    )}

                    {!noteOnly && anchorType === ANCHOR_FIXED && (
                      <div className="mb-4">
                        <p className="mb-2 text-sm text-gray-500">{lang === EN ? 'Fixed note' : 'Nota fissa'}</p>
                        <div className="flex justify-center">
                          <select
                            className="px-3 py-2 rounded-full text-sm bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                            value={fixedRoot}
                            onChange={(event) => setFixedRoot(event.target.value)}
                          >
                            {USEFUL_ROOTS.map((note) => (
                              <option key={note} value={note}>
                                {note}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <p className="mb-2 text-sm text-gray-500">{lang === EN ? 'Direction' : 'Direzione'}</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      <button
                        className={getSelectableButtonClass(direction === DIRECTION_FORWARD)}
                        onClick={() => setDirection(DIRECTION_FORWARD)}
                      >
                        {lang === EN ? 'Forward' : 'Progressiva'}
                      </button>
                      <button
                        className={getSelectableButtonClass(direction === DIRECTION_BACKWARD)}
                        onClick={() => setDirection(DIRECTION_BACKWARD)}
                      >
                        {lang === EN ? 'Backward' : 'Regressiva'}
                      </button>
                    </div>
                  </>
                )}

                <p className="mb-2 text-sm text-gray-500">{lang === EN ? 'Duration' : 'Durata'}</p>
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

                {forceMic ? (
                  <p className="mt-4 text-xs text-gray-500">
                    {lang === EN
                      ? 'Microphone access is required for this trainer.'
                      : "Per usare questo trainer è necessario consentire l'accesso al microfono."}
                  </p>
                ) : (
                  <p className="mt-4 text-xs text-gray-500">
                    {lang === EN
                      ? 'Microphone is optional. You can train mentally and advance by tapping anywhere.'
                      : 'Il microfono è opzionale. Puoi allenarti mentalmente e avanzare toccando ovunque.'}
                  </p>
                )}
              </div>
            )}

            {!isRunning && !isShowingRecap && (
              <>
                <button className={ACTION_BUTTON_CLASS} onClick={startSession} data-control="true">
                  {lang === EN ? 'Start' : 'Avvia'}
                </button>
                <div className="flex items-center justify-center gap-2" data-control="true">
                  {!forceMic && (
                    <button
                      className={getToggleButtonClass(isMicEnabled)}
                      onClick={() => setIsMicEnabled((prev) => !prev)}
                    >
                      {isMicEnabled ? (lang === EN ? 'Mic: on' : 'Mic: on') : lang === EN ? 'Mic: off' : 'Mic: off'}
                    </button>
                  )}
                  <button
                    className={getToggleButtonClass(isDebugEnabled)}
                    onClick={() => setIsDebugEnabled((prev) => !prev)}
                  >
                    {isDebugEnabled ? 'Debug: on' : 'Debug: off'}
                  </button>
                </div>
              </>
            )}

            {isRunning && (
              <>
                {noteOnly ? (
                  <TrainerPromptCard>
                    <p className="text-3xl md:text-5xl font-mono font-semibold leading-tight text-emerald-700 dark:text-emerald-300">
                      {targetNote || '-'}
                    </p>
                  </TrainerPromptCard>
                ) : (
                  <>
                    <TrainerPromptCard>
                      <p className="text-3xl md:text-5xl font-mono font-semibold leading-tight text-emerald-700 dark:text-emerald-300">
                        {direction === DIRECTION_FORWARD ? (
                          lang === EN ? (
                            <>
                              {renderIntervalLabel(activeInterval || '-')} of {activeRoot || '-'}
                            </>
                          ) : (
                            <>
                              {renderIntervalLabel(activeInterval || '-')} di {activeRoot || '-'}
                            </>
                          )
                        ) : lang === EN ? (
                          <>
                            {activeRoot || '-'} is {renderIntervalLabel(activeInterval || '-')} of?
                          </>
                        ) : (
                          <>
                            {activeRoot || '-'} è {renderIntervalLabel(activeInterval || '-')} di?
                          </>
                        )}
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
                <p className="text-xs mb-3 text-gray-500">
                  {lang === EN
                    ? isMicEnabled
                      ? 'Play/sing the target or tap/click anywhere to continue.'
                      : 'Mic is off: tap/click anywhere to continue.'
                    : isMicEnabled
                    ? 'Suona/canta la nota target o tocca/clicca ovunque per continuare.'
                    : 'Mic off: tocca/clicca ovunque per continuare.'}
                </p>
                {isDebugEnabled && (
                  <p className="text-xs mb-6 text-gray-500 font-mono bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                    Hz {detectedFrequency ? detectedFrequency.toFixed(1) : '-'} | In {inputLevel.toFixed(4)} | Note{' '}
                    {detectedPitchClass != null ? getPitchClassLabel(detectedPitchClass, debugPreferSharp) : '-'} | Ct{' '}
                    {centsToTarget != null && Number.isFinite(centsToTarget) ? centsToTarget.toFixed(1) : '-'} | F{' '}
                    {matchedFramesRef.current}/{MATCH_FRAMES_REQUIRED}
                  </p>
                )}
                <button className={ACTION_BUTTON_CLASS} onClick={stopSession} data-control="true">
                  {lang === EN ? 'Stop' : 'Ferma'}
                </button>
              </>
            )}

            {isShowingRecap && (
              <div className="w-full max-w-2xl mx-auto p-6 text-center rounded-3xl border border-gray-200/70 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/40 backdrop-blur">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                  {lang === EN ? 'Session recap' : 'Riepilogo sessione'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
                  <div className="rounded-xl bg-white/80 dark:bg-gray-900/60 p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      {lang === EN ? 'Effective duration' : 'Durata effettiva'}
                    </p>
                    <p className="text-lg font-semibold">{formatElapsed(sessionElapsedMs)}</p>
                  </div>
                  <div className="rounded-xl bg-white/80 dark:bg-gray-900/60 p-3">
                    <p className="text-xs text-gray-500 mb-1">{lang === EN ? 'Completed notes' : 'Note completate'}</p>
                    <p className="text-lg font-semibold">{correctAnswers}</p>
                  </div>
                  <div className="rounded-xl bg-white/80 dark:bg-gray-900/60 p-3">
                    <p className="text-xs text-gray-500 mb-1">{lang === EN ? 'Notes per second' : 'Note al secondo'}</p>
                    <p className="text-lg font-semibold">{notesPerSecond}</p>
                  </div>
                </div>

                <p className="mb-5 text-sm text-gray-500">
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
                  ? forceMic
                    ? 'Microphone unavailable. This trainer requires microphone access.'
                    : 'Microphone unavailable. Turn mic off and continue by tapping anywhere.'
                  : forceMic
                  ? 'Microfono non disponibile. Questo trainer richiede il microfono.'
                  : 'Microfono non disponibile. Disattiva il mic e continua toccando ovunque.'}
              </p>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
