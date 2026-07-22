import Layout, { EN } from './layout'
import { IntervalPreSessionOptions } from './interval-pre-session-options'
import { IntervalRunningPrompt } from './interval-running-prompt'
import { MicTuningPanel } from './mic-tuning-panel'
import { NotePreSessionOptions } from './note-pre-session-options'
import { NoteRunningPrompt } from './note-running-prompt'
import { TrainerStatusPill } from './trainer-ui'
import { ANCHOR_FIXED, DIRECTION_FORWARD, useTrainerSession } from './use-trainer-session'

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

export function IntervalTrainerPage({ noteOnly = false, forceMic = false, defaultMicEnabled = true }) {
  const {
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
    handleMainAreaPointerDown,
    handleMainAreaClick,
    isMicTestRunningRef,
  } = useTrainerSession({ noteOnly, forceMic, defaultMicEnabled })

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

  return (
    <Layout>
      {({ lang }) => (
        <div className="flex min-h-screen" onPointerDown={handleMainAreaPointerDown} onClick={handleMainAreaClick}>
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
                {noteOnly ? (
                  <NotePreSessionOptions />
                ) : (
                  <IntervalPreSessionOptions
                    anchorType={anchorType}
                    setAnchorType={setAnchorType}
                    isChained={isChained}
                    setIsChained={setIsChained}
                    fixedRoot={fixedRoot}
                    setFixedRoot={setFixedRoot}
                    direction={direction}
                    setDirection={setDirection}
                    isRunning={isRunning}
                    lang={lang}
                  />
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

                {isMicSettingsVisible && (
                  <MicTuningPanel
                    lang={lang}
                    isRunning={isRunning}
                    micSettings={micSettings}
                    updateMicSetting={updateMicSetting}
                    isMicEnabled={isMicEnabled}
                    isMicTestRunning={isMicTestRunning}
                    startMicTest={startMicTest}
                    stopMicTest={stopMicTest}
                    detectedFrequency={detectedFrequency}
                    inputLevel={inputLevel}
                    detectedNoteLabel={detectedNoteLabel}
                    centsToTarget={centsToTarget}
                    qualityScore={qualityScore}
                    calibrationPhase={calibrationPhase}
                    calibrationSecondsLeft={calibrationSecondsLeft}
                    calibrationSuggestion={calibrationSuggestion}
                    startCalibration={startCalibration}
                    stopCalibration={stopCalibration}
                    applyCalibrationSuggestion={applyCalibrationSuggestion}
                  />
                )}

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
                      onClick={() => {
                        const next = !isMicEnabled
                        setIsMicEnabled(next)
                        if (!next && isMicTestRunningRef.current) {
                          stopMicTest()
                        }
                        setErrorMessage(null)
                      }}
                    >
                      {isMicEnabled ? (lang === EN ? 'Mic: on' : 'Mic: on') : lang === EN ? 'Mic: off' : 'Mic: off'}
                    </button>
                  )}
                  <button
                    className={getToggleButtonClass(isMicSettingsVisible)}
                    onClick={() => setIsMicSettingsVisible((prev) => !prev)}
                    disabled={isRunning}
                  >
                    {isMicSettingsVisible
                      ? lang === EN
                        ? 'Mic tuning: on'
                        : 'Taratura mic: on'
                      : lang === EN
                      ? 'Mic tuning: off'
                      : 'Taratura mic: off'}
                  </button>
                </div>
              </>
            )}

            {isRunning && (
              <>
                {noteOnly ? (
                  <NoteRunningPrompt targetNote={targetNote} />
                ) : (
                  <IntervalRunningPrompt
                    direction={direction}
                    lang={lang}
                    activeInterval={activeInterval}
                    activeRoot={activeRoot}
                  />
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
                    {detectedNoteLabel} | Ct{' '}
                    {centsToTarget != null && Number.isFinite(centsToTarget) ? centsToTarget.toFixed(1) : '-'} | F{' '}
                    {matchedFramesRef.current}/{micSettings.matchFramesRequired}
                  </p>
                )}
                <div className="mb-3" data-control="true">
                  <button
                    className={getToggleButtonClass(isDebugEnabled)}
                    onClick={() => setIsDebugEnabled((prev) => !prev)}
                  >
                    {isDebugEnabled ? 'Debug: on' : 'Debug: off'}
                  </button>
                </div>
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-6">
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
                  <div className="rounded-xl bg-white/80 dark:bg-gray-900/60 p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      {lang === EN ? 'Equivalent 100 notes' : 'Equivalente 100 note'}
                    </p>
                    <p className="text-lg font-semibold">
                      {equivalent100NotesSeconds != null ? formatElapsed(equivalent100NotesSeconds * 1000) : '-'}
                    </p>
                  </div>
                </div>

                <p className="mb-5 text-sm text-gray-500">
                  {lang === EN ? 'Selected duration' : 'Durata selezionata'}: {minutes}{' '}
                  {lang === EN ? 'minutes' : 'minuti'}
                </p>

                <button className={ACTION_BUTTON_CLASS} onClick={closeRecap}>
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

            {errorMessage === 'mic-disabled' && (
              <p className="mt-6 text-amber-500 max-w-xl">
                {lang === EN
                  ? 'Enable the mic first to run the microphone test.'
                  : 'Attiva prima il microfono per eseguire il test microfono.'}
              </p>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
