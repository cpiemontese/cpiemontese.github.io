import { useState } from 'react'
import Layout from '../components/layout'

import { shuffle } from '../lib/utils'

function randomPermutation(from, to) {
  const result = []
  for (let i = from; i <= to; i++) {
    result.push(i)
  }
  return shuffle(result)
}

const stringPerDot = [
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [2, 1],
  [2, 2],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [3, 1],
  [3, 2],
  [3, 3],
  [3, 4],
  [3, 5],
  [3, 6],
  [4, 1],
  [4, 2],
  [4, 3],
  [4, 4],
  [4, 5],
  [4, 6],
  [5, 1],
  [5, 2],
  [5, 3],
  [5, 4],
  [5, 5],
  [5, 6],
  [6, 1],
  [6, 2],
  [6, 3],
  [6, 4],
  [6, 5],
  [6, 6],
]

export default function GuitarStringDotPermutationGenerator() {
  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false)
  const [randomIndices, setRandomIndices] = useState(randomPermutation(0, stringPerDot.length - 1))
  const [currentIdx, setIdx] = useState(0)

  return (
    <Layout>
      {({ _lang }) => (
        <>
          <div
            id="scale"
            className="flex flex-col min-h-screen items-center place-content-center select-none"
            onClick={() => {
              if (!started) {
                setStarted(true)
              } else if (!ended && currentIdx === stringPerDot.length - 1) {
                setEnded(true)
              } else if (ended) {
                setEnded(false)
                setStarted(true)
                setIdx(0)
                setRandomIndices(randomPermutation(0, stringPerDot.length - 1))
              } else {
                setIdx((currentIdx + 1) % stringPerDot.length)
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
                <div key="string-and-dot" className="text-5xl lg:text-6xl">
                  String {stringPerDot[randomIndices[currentIdx]][0]} Dot {stringPerDot[randomIndices[currentIdx]][1]}
                </div>
                <div key="progress" className="text-3xl lg:text-4xl mt-8">
                  {currentIdx + 1} / {stringPerDot.length}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </Layout>
  )
}
