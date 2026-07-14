import { EN } from './layout'
import { USEFUL_ROOTS } from '../lib/utils'
import { ANCHOR_DYNAMIC, ANCHOR_FIXED, DIRECTION_BACKWARD, DIRECTION_FORWARD } from './use-trainer-session'

function getSelectableButtonClass(isSelected) {
  const common = 'px-3 py-2 rounded-full text-sm transition-colors'
  if (isSelected) {
    return `${common} bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white`
  }

  return `${common} bg-gray-200 text-gray-700 hover:bg-emerald-600 hover:text-white dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-emerald-600`
}

export function IntervalPreSessionOptions({
  anchorType,
  setAnchorType,
  isChained,
  setIsChained,
  fixedRoot,
  setFixedRoot,
  direction,
  setDirection,
  isRunning,
  lang,
}) {
  return (
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

      {anchorType === ANCHOR_FIXED && (
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
  )
}
