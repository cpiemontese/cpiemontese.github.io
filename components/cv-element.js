export default function CVElement({ lang, title, subtitle, period, body, list, grade, children }) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-green-600 dark:text-green-500">{title}</h2>
        {
          subtitle && <h3 className="text-md">{subtitle}</h3>
        }
        {
          period && <p className="text-sm uppercase text-green-600 dark:text-green-500">{period}</p>
        }
      </div>
      { list && <ul className="list-disc">
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