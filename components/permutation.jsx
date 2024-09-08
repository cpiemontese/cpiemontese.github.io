import { useState } from 'react'

import { shuffle } from '../lib/utils'

function randomPermutation(from, to) {
  const result = []
  for (let i = from; i <= to; i++) {
    result.push(i)
  }
  return shuffle(result)
}
export default function Permutation({ elements, getElemFn = (elements, idx) => elements[idx] }) {
  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false)
  const [randomIndices, setRandomIndices] = useState(randomPermutation(0, elements.length - 1))
  const [currentIdx, setIdx] = useState(0)

  return (
    <div
      id="permutation"
      className="flex flex-col min-h-screen items-center place-content-center select-none"
      onClick={() => {
        if (!started) {
          setStarted(true)
        } else if (!ended && currentIdx === elements.length - 1) {
          setEnded(true)
        } else if (ended) {
          setEnded(false)
          setStarted(true)
          setIdx(0)
          setRandomIndices(randomPermutation(0, elements.length - 1))
        } else {
          setIdx((currentIdx + 1) % elements.length)
        }
      }}
    >
      {!started ? (
        <div className="text-5xl lg:text-6xl">Click here</div>
      ) : ended ? (
        <>
          <div key="end" className="text-5xl lg:text-6xl">
            Restart?
          </div>
        </>
      ) : (
        <>
          <div key="current" className="text-5xl lg:text-6xl">
            {getElemFn(elements, randomIndices[currentIdx])}
          </div>
          <div key="progress" className="text-3xl lg:text-4xl mt-8">
            {currentIdx + 1} / {elements.length}
          </div>
        </>
      )}
    </div>
  )
}
