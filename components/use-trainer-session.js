import { useEffect, useMemo, useRef, useState } from 'react'
import { YIN } from 'pitchfinder'
import { getRandomNote, getRandomUsefulRoot, NOTE_TO_PITCH_CLASS } from '../lib/utils'

export const ANCHOR_FIXED = 'anchor-fixed'
export const ANCHOR_DYNAMIC = 'anchor-dynamic'
export const DIRECTION_FORWARD = 'direction-forward'
export const DIRECTION_BACKWARD = 'direction-backward'

const ADVANCE_COOLDOWN_MS = 250
const MODE_IDLE = 'idle'
const MODE_RUNNING = 'running'
const MODE_RECAP = 'recap'
const CALIBRATION_IDLE = 'idle'
const CALIBRATION_NOISE = 'noise'
const CALIBRATION_PLAY = 'play'
const CALIBRATION_DONE = 'done'
const MIC_SETTINGS_STORAGE_KEY = 'interval-trainer-mic-settings-v1'
const DEFAULT_MIC_SETTINGS = {
  minFrequencyHz: 60,
  maxFrequencyHz: 1400,
  minRms: 0.0006,
  toleranceCents: 70,
  matchFramesRequired: 2,
  fftSize: 4096,
  yinThreshold: 0.1,
  yinProbabilityThreshold: 0.45,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  transientGuardEnabled: true,
  transientGuardMs: 100,
}
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function useTrainerSession({ noteOnly = false, forceMic = false, defaultMicEnabled = true }) {
  const [anchorType, setAnchorType] = useState(ANCHOR_DYNAMIC)
  const [isChained, setIsChained] = useState(false)
  const [direction, setDirection] = useState(DIRECTION_FORWARD)
  const [minutes, setMinutes] = useState(2)
  const [fixedRoot, setFixedRoot] = useState('C')
  const [targetNote, setTargetNote] = useState(null)
  const [activePrompt, setActivePrompt] = useState({ root: null, interval: null })
  const [mode, setMode] = useState(MODE_IDLE)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const [remainingMs, setRemainingMs] = useState(0)
  const [detectedFrequency, setDetectedFrequency] = useState(null)
  const [detectedNoteLabel, setDetectedNoteLabel] = useState('-')
  const [centsToTarget, setCentsToTarget] = useState(null)
  const [inputLevel, setInputLevel] = useState(0)
  const [isDebugEnabled, setIsDebugEnabled] = useState(false)
  const [isMicEnabled, setIsMicEnabled] = useState(forceMic ? true : defaultMicEnabled)
  const [micSettings, setMicSettings] = useState(DEFAULT_MIC_SETTINGS)
  const [isMicTestRunning, setIsMicTestRunning] = useState(false)
  const [isMicSettingsVisible, setIsMicSettingsVisible] = useState(false)
  const [qualityScore, setQualityScore] = useState(0)
  const [calibrationPhase, setCalibrationPhase] = useState(CALIBRATION_IDLE)
  const [calibrationSecondsLeft, setCalibrationSecondsLeft] = useState(0)
  const [calibrationSuggestion, setCalibrationSuggestion] = useState(null)

  const detectorsRef = useRef([])
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)
  const sessionEndAtRef = useRef(null)
  const sessionStartedAtRef = useRef(null)
  const isMicTestRunningRef = useRef(false)
  const matchedFramesRef = useRef(0)
  const lastAdvanceAtRef = useRef(0)
  const targetNoteRef = useRef(null)
  const activePromptRef = useRef({ root: null, interval: null })
  const timerIntervalRef = useRef(null)
  const signalAboveGateSinceRef = useRef(null)
  const qualityScoreRef = useRef(0)
  const previousFrequencyRef = useRef(null)
  const calibrationPhaseRef = useRef(CALIBRATION_IDLE)
  const calibrationTimeoutRef = useRef(null)
  const calibrationIntervalRef = useRef(null)
  const calibrationStatsRef = useRef(null)

  const [sessionElapsedMs, setSessionElapsedMs] = useState(null)
  const activeRoot = activePrompt.root
  const activeInterval = activePrompt.interval
  const isRunning = mode === MODE_RUNNING
  const isShowingRecap = mode === MODE_RECAP

  const sessionDurationMs = useMemo(() => minutes * 60 * 1000, [minutes])

  useEffect(() => {
    isMicTestRunningRef.current = isMicTestRunning
  }, [isMicTestRunning])

  useEffect(() => {
    calibrationPhaseRef.current = calibrationPhase
  }, [calibrationPhase])

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const raw = window.localStorage.getItem(MIC_SETTINGS_STORAGE_KEY)
      if (!raw) return

      const parsed = JSON.parse(raw)
      setMicSettings((prev) => ({ ...prev, ...parsed }))
    } catch (_err) {
      // Ignore invalid saved settings.
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(MIC_SETTINGS_STORAGE_KEY, JSON.stringify(micSettings))
  }, [micSettings])

  const updateMicSetting = (key, value) => {
    setMicSettings((prev) => ({ ...prev, [key]: value }))
  }

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
      if (
        detected &&
        Number.isFinite(detected) &&
        detected >= micSettings.minFrequencyHz &&
        detected <= micSettings.maxFrequencyHz
      ) {
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
    signalAboveGateSinceRef.current = null
    previousFrequencyRef.current = null
    qualityScoreRef.current = 0
    setQualityScore(0)
    setIsMicTestRunning(false)
    isMicTestRunningRef.current = false
  }

  const cleanupCalibrationTimers = () => {
    if (calibrationTimeoutRef.current) {
      clearTimeout(calibrationTimeoutRef.current)
      calibrationTimeoutRef.current = null
    }
    if (calibrationIntervalRef.current) {
      clearInterval(calibrationIntervalRef.current)
      calibrationIntervalRef.current = null
    }
  }

  const stopCalibration = () => {
    cleanupCalibrationTimers()
    setCalibrationPhase(CALIBRATION_IDLE)
    setCalibrationSecondsLeft(0)
    calibrationStatsRef.current = null
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
      cleanupCalibrationTimers()
      cleanupAudio()
    }
  }, [])

  const startCalibrationPhase = (phase, durationSeconds, onDone) => {
    cleanupCalibrationTimers()
    setCalibrationPhase(phase)
    setCalibrationSecondsLeft(durationSeconds)

    const startedAt = performance.now()
    calibrationIntervalRef.current = setInterval(() => {
      const elapsed = (performance.now() - startedAt) / 1000
      const left = Math.max(0, Math.ceil(durationSeconds - elapsed))
      setCalibrationSecondsLeft(left)
    }, 200)

    calibrationTimeoutRef.current = setTimeout(() => {
      cleanupCalibrationTimers()
      onDone()
    }, durationSeconds * 1000)
  }

  const computeCalibrationSuggestion = () => {
    const stats = calibrationStatsRef.current
    if (!stats) return null

    const noiseAvgRms = stats.noiseFrames > 0 ? stats.noiseRmsSum / stats.noiseFrames : 0.0002
    const playAvgRms = stats.playFrames > 0 ? stats.playRmsSum / stats.playFrames : noiseAvgRms * 4
    const validRate = stats.playFrames > 0 ? stats.validPitchFrames / stats.playFrames : 0
    const stability = stats.stabilitySamples > 0 ? stats.stabilitySum / stats.stabilitySamples : 0.5

    const suggestedMinRms = clamp(noiseAvgRms * 2.2, 0.0001, 0.002)
    const suggestedTolerance = clamp(Math.round(60 + (1 - stability) * 40), 45, 120)
    const suggestedFrames = stability >= 0.78 ? 2 : stability >= 0.58 ? 3 : 4
    const suggestedYinProb = clamp(0.38 - (validRate - 0.6) * 0.25, 0.2, 0.55)

    return {
      minRms: Number(suggestedMinRms.toFixed(4)),
      toleranceCents: suggestedTolerance,
      matchFramesRequired: suggestedFrames,
      yinProbabilityThreshold: Number(suggestedYinProb.toFixed(2)),
      reference: {
        noiseAvgRms,
        playAvgRms,
        validRate,
        stability,
      },
    }
  }

  const startCalibration = async () => {
    if (isRunning) return
    setCalibrationSuggestion(null)

    calibrationStatsRef.current = {
      noiseRmsSum: 0,
      noiseFrames: 0,
      playRmsSum: 0,
      playFrames: 0,
      validPitchFrames: 0,
      stabilitySum: 0,
      stabilitySamples: 0,
      previousPitchMidi: null,
    }

    if (!isMicTestRunningRef.current) {
      const started = await startMicTest()
      if (!started) {
        stopCalibration()
        return
      }
    }

    startCalibrationPhase(CALIBRATION_NOISE, 8, () => {
      startCalibrationPhase(CALIBRATION_PLAY, 12, () => {
        const suggestion = computeCalibrationSuggestion()
        setCalibrationSuggestion(suggestion)
        setCalibrationPhase(CALIBRATION_DONE)
        setCalibrationSecondsLeft(0)
      })
    })
  }

  const applyCalibrationSuggestion = () => {
    if (!calibrationSuggestion) return
    setMicSettings((prev) => ({
      ...prev,
      minRms: calibrationSuggestion.minRms,
      toleranceCents: calibrationSuggestion.toleranceCents,
      matchFramesRequired: calibrationSuggestion.matchFramesRequired,
      yinProbabilityThreshold: calibrationSuggestion.yinProbabilityThreshold,
    }))
  }

  const endSession = () => {
    cleanupTimer()
    if (sessionStartedAtRef.current) {
      setSessionElapsedMs(Math.max(0, performance.now() - sessionStartedAtRef.current))
    }
    setMode(MODE_RECAP)
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
      activePromptRef.current = { root: null, interval: null }
      setActivePrompt({ root: null, interval: null })
    } else {
      const nextPrompt = buildIntervalPrompt(
        activePromptRef.current.root,
        activePromptRef.current.interval,
        targetNoteRef.current
      )
      targetNoteRef.current = nextPrompt.target
      activePromptRef.current = { root: nextPrompt.root, interval: nextPrompt.interval }
      setTargetNote(nextPrompt.target)
      setActivePrompt({ root: nextPrompt.root, interval: nextPrompt.interval })
    }

    matchedFramesRef.current = 0
    lastAdvanceAtRef.current = now
  }

  const runDetectionLoop = () => {
    const analyser = analyserRef.current
    if (!analyser || (!sessionEndAtRef.current && !isMicTestRunningRef.current) || !isMicEnabled) return

    const now = performance.now()

    const floatBuffer = new Float32Array(analyser.fftSize)
    analyser.getFloatTimeDomainData(floatBuffer)

    const rms = getRms(floatBuffer)
    setInputLevel(rms)

    if (rms < micSettings.minRms) {
      signalAboveGateSinceRef.current = null
    } else if (signalAboveGateSinceRef.current == null) {
      signalAboveGateSinceRef.current = now
    }

    if (rms < micSettings.minRms) {
      setDetectedFrequency(null)
      setDetectedNoteLabel('-')
      setCentsToTarget(null)
      const lowSignalQuality = Math.round(qualityScoreRef.current * 0.92)
      qualityScoreRef.current = lowSignalQuality
      setQualityScore(lowSignalQuality)
      matchedFramesRef.current = 0
      rafRef.current = requestAnimationFrame(runDetectionLoop)
      return
    }

    const normalizedBuffer = normalizeBuffer(floatBuffer)
    const frequency = detectFrequency(normalizedBuffer)
    setDetectedFrequency(frequency)
    const pitchInfo = getPitchInfo(frequency)

    if (!pitchInfo) {
      setDetectedNoteLabel('-')
      setCentsToTarget(null)
      const missingPitchQuality = Math.round(qualityScoreRef.current * 0.95)
      qualityScoreRef.current = missingPitchQuality
      setQualityScore(missingPitchQuality)
      matchedFramesRef.current = 0
      rafRef.current = requestAnimationFrame(runDetectionLoop)
      return
    }

    const preferSharp = shouldPreferSharps(activePromptRef.current.root || targetNoteRef.current)
    setDetectedNoteLabel(getPitchClassLabel(pitchInfo.pitchClass, preferSharp))

    const signalNorm = clamp((rms - micSettings.minRms) / Math.max(micSettings.minRms * 8, 1e-6), 0, 1)
    let stabilityNorm = 0.6
    if (previousFrequencyRef.current && previousFrequencyRef.current > 0) {
      const centsDrift = Math.abs(1200 * Math.log2(pitchInfo.midiFloat ? frequency / previousFrequencyRef.current : 1))
      stabilityNorm = 1 - clamp(centsDrift / 50, 0, 1)
    }
    previousFrequencyRef.current = frequency
    const qualityRaw = 100 * (0.35 * signalNorm + 0.3 * 1 + 0.35 * stabilityNorm)
    const nextQuality = Math.round(qualityScoreRef.current * 0.85 + qualityRaw * 0.15)
    qualityScoreRef.current = nextQuality
    setQualityScore(nextQuality)

    const calibrationStats = calibrationStatsRef.current
    if (
      calibrationStats &&
      calibrationPhaseRef.current !== CALIBRATION_IDLE &&
      calibrationPhaseRef.current !== CALIBRATION_DONE
    ) {
      if (calibrationPhaseRef.current === CALIBRATION_NOISE) {
        calibrationStats.noiseRmsSum += rms
        calibrationStats.noiseFrames += 1
      }

      if (calibrationPhaseRef.current === CALIBRATION_PLAY) {
        calibrationStats.playRmsSum += rms
        calibrationStats.playFrames += 1
        calibrationStats.validPitchFrames += 1

        if (calibrationStats.previousPitchMidi != null) {
          const centsStep = Math.abs((pitchInfo.midiFloat - calibrationStats.previousPitchMidi) * 100)
          const sampleStability = 1 - clamp(centsStep / 60, 0, 1)
          calibrationStats.stabilitySum += sampleStability
          calibrationStats.stabilitySamples += 1
        }
        calibrationStats.previousPitchMidi = pitchInfo.midiFloat
      }
    }

    if (!targetNoteRef.current) {
      setCentsToTarget(null)
      matchedFramesRef.current = 0
      rafRef.current = requestAnimationFrame(runDetectionLoop)
      return
    }

    const targetPitchClass = NOTE_TO_PITCH_CLASS[targetNoteRef.current]
    if (targetPitchClass == null) {
      setCentsToTarget(null)
      matchedFramesRef.current = 0
      rafRef.current = requestAnimationFrame(runDetectionLoop)
      return
    }

    const centsOffTarget = getCentsOffTarget(pitchInfo.midiFloat, targetPitchClass)
    setCentsToTarget(centsOffTarget)

    const isInTune = centsOffTarget <= micSettings.toleranceCents
    const hasPassedTransientGuard =
      !micSettings.transientGuardEnabled ||
      (signalAboveGateSinceRef.current != null && now - signalAboveGateSinceRef.current >= micSettings.transientGuardMs)

    if (isInTune && hasPassedTransientGuard) {
      matchedFramesRef.current += 1
      const hasHold = matchedFramesRef.current >= micSettings.matchFramesRequired
      const isOutOfCooldown = now - lastAdvanceAtRef.current >= ADVANCE_COOLDOWN_MS

      if (hasHold && isOutOfCooldown) {
        advancePrompt(now)
      }
    } else {
      matchedFramesRef.current = 0
    }

    rafRef.current = requestAnimationFrame(runDetectionLoop)
  }

  const startAudioCapture = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: micSettings.echoCancellation,
        noiseSuppression: micSettings.noiseSuppression,
        autoGainControl: micSettings.autoGainControl,
      },
    })
    const context = new window.AudioContext()
    await context.resume()
    const source = context.createMediaStreamSource(stream)
    const analyser = context.createAnalyser()

    analyser.fftSize = micSettings.fftSize
    source.connect(analyser)

    detectorsRef.current = [
      YIN({
        sampleRate: context.sampleRate,
        threshold: micSettings.yinThreshold,
        probabilityThreshold: micSettings.yinProbabilityThreshold,
      }),
    ]

    streamRef.current = stream
    audioContextRef.current = context
    sourceRef.current = source
    analyserRef.current = analyser
  }

  const startMicTest = async () => {
    if (isRunning) return
    if (!isMicEnabled) {
      setErrorMessage('mic-disabled')
      return false
    }

    setErrorMessage(null)
    setDetectedFrequency(null)
    setDetectedNoteLabel('-')
    setCentsToTarget(null)
    setInputLevel(0)
    matchedFramesRef.current = 0
    targetNoteRef.current = null

    cleanupAudio()

    try {
      await startAudioCapture()
      setIsMicTestRunning(true)
      isMicTestRunningRef.current = true
      runDetectionLoop()
      return true
    } catch (error) {
      cleanupAudio()
      setErrorMessage('mic-unavailable')
      return false
    }
  }

  const stopMicTest = () => {
    sessionEndAtRef.current = null
    targetNoteRef.current = null
    cleanupAudio()
    stopCalibration()
    setDetectedFrequency(null)
    setDetectedNoteLabel('-')
    setCentsToTarget(null)
    setInputLevel(0)
  }

  const startSession = async () => {
    if (isMicTestRunningRef.current) {
      stopMicTest()
    }

    setErrorMessage(null)
    setMode(MODE_IDLE)
    setCorrectAnswers(0)

    if (noteOnly) {
      const firstTarget = getRandomNote(targetNoteRef.current)
      targetNoteRef.current = firstTarget
      activePromptRef.current = { root: null, interval: null }
      setTargetNote(firstTarget)
      setActivePrompt({ root: null, interval: null })
    } else {
      const firstPrompt = buildIntervalPrompt(
        activePromptRef.current.root,
        activePromptRef.current.interval,
        targetNoteRef.current
      )
      targetNoteRef.current = firstPrompt.target
      activePromptRef.current = { root: firstPrompt.root, interval: firstPrompt.interval }
      setTargetNote(firstPrompt.target)
      setActivePrompt({ root: firstPrompt.root, interval: firstPrompt.interval })
    }

    setDetectedFrequency(null)
    setDetectedNoteLabel('-')
    setCentsToTarget(null)
    setInputLevel(0)
    matchedFramesRef.current = 0
    lastAdvanceAtRef.current = 0
    setRemainingMs(sessionDurationMs)
    setSessionElapsedMs(null)

    sessionStartedAtRef.current = performance.now()
    sessionEndAtRef.current = performance.now() + sessionDurationMs
    setMode(MODE_RUNNING)
    startTimer()

    if (!isMicEnabled) {
      cleanupAudio()
      return
    }

    try {
      await startAudioCapture()
      runDetectionLoop()
    } catch (error) {
      cleanupTimer()
      cleanupAudio()
      setMode(MODE_IDLE)
      sessionStartedAtRef.current = null
      sessionEndAtRef.current = null
      setErrorMessage('mic-unavailable')
    }
  }

  const closeRecap = () => {
    setMode(MODE_IDLE)
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

  const notesPerSecond =
    sessionElapsedMs && sessionElapsedMs > 0 ? (correctAnswers / (sessionElapsedMs / 1000)).toFixed(2) : '0.00'
  const notesPerSecondValue = sessionElapsedMs && sessionElapsedMs > 0 ? correctAnswers / (sessionElapsedMs / 1000) : 0
  const equivalent100NotesSeconds = notesPerSecondValue > 0 ? 100 / notesPerSecondValue : null

  const handleMainAreaClick = (event) => {
    if (!isRunning) return
    if (event.target.closest('[data-control="true"]')) return
    manualAdvance()
  }

  return {
    anchorType,
    setAnchorType,
    isChained,
    setIsChained,
    direction,
    setDirection,
    minutes,
    setMinutes,
    fixedRoot,
    setFixedRoot,
    targetNote,
    activeRoot,
    activeInterval,
    mode,
    isRunning,
    isShowingRecap,
    closeRecap,
    correctAnswers,
    errorMessage,
    setErrorMessage,
    remainingMs,
    detectedFrequency,
    centsToTarget,
    inputLevel,
    isDebugEnabled,
    setIsDebugEnabled,
    isMicEnabled,
    setIsMicEnabled,
    micSettings,
    updateMicSetting,
    isMicTestRunning,
    isMicSettingsVisible,
    setIsMicSettingsVisible,
    qualityScore,
    calibrationPhase,
    calibrationSecondsLeft,
    calibrationSuggestion,
    startCalibration,
    stopCalibration,
    applyCalibrationSuggestion,
    sessionElapsedMs,
    notesPerSecond,
    equivalent100NotesSeconds,
    detectedNoteLabel,
    matchedFramesRef,
    startMicTest,
    stopMicTest,
    startSession,
    stopSession,
    handleMainAreaClick,
    isMicTestRunningRef,
  }
}
