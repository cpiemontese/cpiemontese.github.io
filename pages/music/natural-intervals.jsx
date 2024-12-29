import { useState, useEffect } from 'react'

import Layout from '../components/layout'

const table = [
  [
    [2, 1, 5, 4, 6, 3, 7, 5, 4, 6],
    [3, 5, 4, 6, 7, 3, 5, 6, 4, 1],
    [5, 3, 4, 2, 6, 1, 7, 5, 4, 6],
  ],
  [
    [5, 4, 1, 6, 7, 5, 4, 3, 2, 1],
    [4, 6, 3, 7, 5, 4, 6, 1, 3, 5],
    [6, 7, 3, 5, 6, 4, 1, 6, 5, 3],
  ],
  [
    [6, 1, 7, 5, 4, 6, 3, 5, 4, 1],
    [6, 7, 5, 4, 3, 2, 1, 5, 4, 6],
    [7, 5, 4, 6, 1, 3, 5, 4, 6, 7],
  ],
  [
    [5, 6, 4, 1, 6, 5, 3, 4, 6, 1],
    [5, 4, 6, 3, 5, 4, 1, 6, 7, 5],
    [3, 5, 6, 4, 1, 6, 5, 3, 4, 6],
  ],
  [
    [7, 5, 4, 6, 3, 5, 4, 1, 6, 7],
    [4, 3, 2, 1, 5, 4, 6, 3, 7, 5],
    [6, 1, 3, 5, 4, 6, 7, 3, 5, 6],
  ],
  [
    [1, 6, 5, 3, 4, 6, 1, 7, 5, 4],
    [3, 6, 7, 3, 2, 5, 6, 4, 1, 6],
    [3, 4, 6, 1, 7, 5, 4, 6, 3, 5],
  ],
  [
    [1, 6, 7, 5, 4, 3, 2, 1, 5, 4],
    [3, 7, 5, 4, 6, 1, 3, 5, 4, 6],
    [3, 5, 6, 4, 1, 6, 5, 3, 4, 6],
  ],
  [
    [7, 2, 5, 4, 6, 3, 5, 4, 1, 6],
    [5, 4, 3, 5, 6, 4, 1, 6, 5, 3],
    [6, 1, 7, 5, 4, 6, 3, 5, 1, 6],
  ],
  [
    [5, 4, 6, 3, 5, 4, 1, 6, 7, 5],
    [3, 5, 6, 4, 1, 6, 5, 3, 4, 6],
    [7, 5, 4, 6, 3, 5, 4, 1, 6, 7],
  ],
  [
    [4, 3, 2, 1, 5, 4, 6, 3, 7, 5],
    [6, 1, 3, 5, 4, 6, 7, 3, 5, 6],
    [1, 6, 5, 3, 4, 6, 1, 7, 5, 4],
  ],
]

const getLine = () => Math.floor(Math.random() * table.length)

export default function RandomIntervals() {
  const [line, setLine] = useState(0)

  useEffect(() => {
    setLine(getLine())
  }, [])

  return (
    <Layout>
      {({ _lang }) => (
        <>
          <div
            id="intervals"
            className="flex flex-col min-h-screen items-center place-content-center select-none"
            onClick={() => {
              setLine(getLine())
            }}
          >
            {table[line].map((intervals, idx) => (
              <div
                key={`interval-${idx}`}
                className={`text-5xl lg:text-6xl ${idx === table[line].length - 1 ? '' : 'mb-8'}`}
              >
                {intervals.join(' ')}
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}
