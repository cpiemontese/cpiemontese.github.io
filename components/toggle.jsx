export default function Toggle ({ toggled, setToggled }) {
  return (
    <div className="flex w-max items-center">
      <div>🇬🇧</div>
      <button
        className="flex items-center mx-2 px-0.5 bg-gray-200 dark:bg-gray-600 w-8 h-4 rounded-full focus:outline-none"
        onClick={() => setToggled(!toggled)}
      >
        <div
          className={`bg-white dark:bg-gray-900 w-3 h-3 rounded-full smooth ${toggled ? 'translate-x-4' : 'translate-x-0'
            }`}
        ></div>
      </button>
      <div>🇮🇹</div>
    </div>
  )
}
