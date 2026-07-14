import { TrainerPromptCard } from './trainer-ui'
import { EN } from './layout'
import { DIRECTION_FORWARD } from './use-trainer-session'

function renderIntervalLabel(interval) {
  if (interval === '11' || interval === '13') {
    return <span className="tracking-[-0.05em]">{interval}</span>
  }

  return interval
}

export function IntervalRunningPrompt({ direction, lang, activeInterval, activeRoot }) {
  return (
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
  )
}
