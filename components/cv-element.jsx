export default function CVElement({ className, lang, title, subtitle, period, list, grade, children }) {
  return (
    <div
      className={`rounded-xl border border-slate-700/80 bg-slate-900 px-5 py-4 shadow-lg shadow-black/20 ${className}`}
    >
      <div className="mb-2 border-l-2 border-emerald-500/90 pl-3">
        <h3 className="text-2xl font-bold text-emerald-400">{title}</h3>
        {subtitle && <h4 className="text-lg text-slate-200">{subtitle}</h4>}
        {period && <p className="text-md uppercase text-emerald-400 tracking-wide">{period}</p>}
      </div>
      {list && (
        <ul className="mt-4 list-disc list-outside pl-5 marker:text-slate-500">
          {list.map((element, index) => (
            <li key={index} className={`${index + 1 < list.length ? 'mb-2' : ''} text-slate-200`}>
              {element[lang]}
            </li>
          ))}
        </ul>
      )}
      {children !== undefined ? children : null}
      {grade && <p className="mt-2 text-sm text-emerald-400">{grade}</p>}
    </div>
  )
}
