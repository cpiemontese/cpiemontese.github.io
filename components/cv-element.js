export default function CVElement({ className, lang, title, subtitle, period, list, grade, children }) {
  return (
    <div className={className}>
      <div className="mb-2">
        <h3 className="text-2xl font-bold text-green-600 dark:text-green-500">{title}</h3>
        {
          subtitle && <h4 className="text-lg">{subtitle}</h4>
        }
        {
          period && <p className="text-md uppercase text-green-600 dark:text-green-500">{period}</p>
        }
      </div>
      { list && <ul className="mt-4 list-disc list-inside">
        {
          list.map((element, index) =>
            <li key={index} className={`${index + 1 < list.length ? 'mb-2' : ''}`}>
              {element[lang]}
            </li> 
          )
        }
      </ul> }
      { children !== undefined ? children : null }
      {
        grade && <p className="mt-2 text-sm text-green-600 dark:text-green-500">{grade}</p>
      }
    </div>
  );
}