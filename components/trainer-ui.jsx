function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function TrainerStatusPill({ children, className = '' }) {
  return (
    <div
      className={joinClasses(
        'inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 md:px-3 md:py-2',
        className
      )}
    >
      {children}
    </div>
  )
}

export function TrainerPromptCard({ children, className = '' }) {
  return (
    <div
      className={joinClasses(
        'mb-3 inline-flex items-center justify-center rounded-2xl border border-emerald-300/60 bg-emerald-50 px-6 py-4 dark:border-emerald-500/40 dark:bg-emerald-900/20',
        className
      )}
    >
      {children}
    </div>
  )
}
