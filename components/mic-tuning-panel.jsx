import { EN } from './layout'

export function MicTuningPanel({
  lang,
  isRunning,
  micSettings,
  updateMicSetting,
  isMicEnabled,
  isMicTestRunning,
  startMicTest,
  stopMicTest,
  detectedFrequency,
  inputLevel,
  detectedNoteLabel,
  centsToTarget,
}) {
  return (
    <div className="mt-3 rounded-2xl border border-gray-200/80 dark:border-gray-700/70 px-4 py-4 text-left">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="text-sm text-gray-500">{lang === EN ? 'Mic tuning' : 'Taratura microfono'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-500">
        <label className="flex flex-col gap-1">
          <span>Min Hz: {micSettings.minFrequencyHz}</span>
          <input
            type="range"
            min={40}
            max={120}
            step={1}
            value={micSettings.minFrequencyHz}
            onChange={(event) => updateMicSetting('minFrequencyHz', Number(event.target.value))}
            disabled={isRunning}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>Input gate RMS: {micSettings.minRms.toFixed(4)}</span>
          <input
            type="range"
            min={0.0001}
            max={0.002}
            step={0.0001}
            value={micSettings.minRms}
            onChange={(event) => updateMicSetting('minRms', Number(event.target.value))}
            disabled={isRunning}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>Cent tolerance: {micSettings.toleranceCents}</span>
          <input
            type="range"
            min={30}
            max={150}
            step={5}
            value={micSettings.toleranceCents}
            onChange={(event) => updateMicSetting('toleranceCents', Number(event.target.value))}
            disabled={isRunning}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>Stable frames: {micSettings.matchFramesRequired}</span>
          <input
            type="range"
            min={1}
            max={6}
            step={1}
            value={micSettings.matchFramesRequired}
            onChange={(event) => updateMicSetting('matchFramesRequired', Number(event.target.value))}
            disabled={isRunning}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>YIN threshold: {micSettings.yinThreshold.toFixed(2)}</span>
          <input
            type="range"
            min={0.05}
            max={0.2}
            step={0.01}
            value={micSettings.yinThreshold}
            onChange={(event) => updateMicSetting('yinThreshold', Number(event.target.value))}
            disabled={isRunning}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>YIN probability: {micSettings.yinProbabilityThreshold.toFixed(2)}</span>
          <input
            type="range"
            min={0.1}
            max={0.7}
            step={0.01}
            value={micSettings.yinProbabilityThreshold}
            onChange={(event) => updateMicSetting('yinProbabilityThreshold', Number(event.target.value))}
            disabled={isRunning}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs text-gray-500">
        <label className="flex items-center justify-between gap-2">
          <span>FFT size</span>
          <select
            className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            value={micSettings.fftSize}
            onChange={(event) => updateMicSetting('fftSize', Number(event.target.value))}
            disabled={isRunning}
          >
            {[2048, 4096, 8192].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center justify-between gap-2">
          <span>Max Hz</span>
          <input
            type="number"
            min={500}
            max={3000}
            step={50}
            className="w-24 px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            value={micSettings.maxFrequencyHz}
            onChange={(event) => updateMicSetting('maxFrequencyHz', Number(event.target.value))}
            disabled={isRunning}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={micSettings.echoCancellation}
            onChange={(event) => updateMicSetting('echoCancellation', event.target.checked)}
            disabled={isRunning}
          />
          Echo cancellation
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={micSettings.noiseSuppression}
            onChange={(event) => updateMicSetting('noiseSuppression', event.target.checked)}
            disabled={isRunning}
          />
          Noise suppression
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={micSettings.autoGainControl}
            onChange={(event) => updateMicSetting('autoGainControl', event.target.checked)}
            disabled={isRunning}
          />
          Auto gain control
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500">{lang === EN ? 'Mic check' : 'Test microfono'}</p>
        {isMicTestRunning ? (
          <button
            className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200"
            onClick={stopMicTest}
            disabled={isRunning}
          >
            {lang === EN ? 'Stop test' : 'Ferma test'}
          </button>
        ) : (
          <button
            className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700 hover:bg-emerald-600 hover:text-white dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-emerald-600"
            onClick={startMicTest}
            disabled={isRunning || !isMicEnabled}
          >
            {lang === EN ? 'Start test' : 'Avvia test'}
          </button>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-500">
        {lang === EN
          ? 'Use this to calibrate input level and detection without starting an exercise.'
          : 'Usalo per calibrare livello input e detection senza avviare un esercizio.'}
      </p>

      <p className="mt-3 text-xs mb-1 text-gray-500 font-mono bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-2">
        Hz {detectedFrequency ? detectedFrequency.toFixed(1) : '-'} | In {inputLevel.toFixed(4)} | Note{' '}
        {detectedNoteLabel} | Ct{' '}
        {centsToTarget != null && Number.isFinite(centsToTarget) ? centsToTarget.toFixed(1) : '-'}
      </p>
    </div>
  )
}
