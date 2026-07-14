import { TrainerPromptCard } from './trainer-ui'

export function NoteRunningPrompt({ targetNote }) {
  return (
    <TrainerPromptCard>
      <p className="text-3xl md:text-5xl font-mono font-semibold leading-tight text-emerald-700 dark:text-emerald-300">
        {targetNote || '-'}
      </p>
    </TrainerPromptCard>
  )
}
