export default function Toggle({ toggled, setToggled }) {
  return (
    <div className="flex w-max items-center text-sm text-slate-200">
      <div>🇬🇧</div>
      <button
        className="flex items-center mx-2 px-0.5 bg-slate-700/90 w-8 h-4 rounded-full border border-slate-500/80 focus:outline-none"
        onClick={() => setToggled(!toggled)}
      >
        <div
          className={`bg-emerald-400 w-3 h-3 rounded-full smooth shadow-sm shadow-emerald-600/50 ${
            toggled ? 'translate-x-4' : 'translate-x-0'
          }`}
        ></div>
      </button>
      <div>🇮🇹</div>
    </div>
  )
}
