export default function CVElement({ className, lang, title, subtitle, period, body, list, grade, children }) {
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-green-600 dark:text-green-500">{title}</h3>
        {
          subtitle && <h4 className="text-md">{subtitle}</h4>
        }
        {
          period && <p className="text-sm uppercase text-green-600 dark:text-green-500">{period}</p>
        }
      </div>
      { list && <ul className="list-disc list-inside">
        {
          list.map((element, index) =>
            <li key={index} className={`${index + 1 < list.length ? 'mb-2' : ''}`}>
              {element[lang]}
            </li> 
          )
        }
      </ul> }
      { body && <p>{body}</p> }
      {
        grade && <p className="text-sm">{grade}</p>
      }
    </div>
  );
}