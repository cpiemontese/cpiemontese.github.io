import { useState } from "react";

export default function Toggle({
  toggled,
  setToggled
}) {
  return (
    <div className="flex w-max items-center">
      <div>
        🇬🇧
      </div>
      <button
        className="flex items-center mx-2 px-0.5 bg-gray-200 w-8 h-4 rounded-full focus:outline-none"
        onClick={() => setToggled(!toggled)}
      >
        <div className={`bg-white w-3 h-3 rounded-full smooth transform translate-x-${
          toggled ? 4 : 0
        }`}></div>
      </button>
      <div>
        🇮🇹
      </div>
    </div>
  );
}
