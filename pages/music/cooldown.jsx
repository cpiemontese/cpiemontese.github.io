import { useEffect, useState } from 'react'

import Layout from '../../components/layout'

const table = [
  '4',
  '1',
  '13b',
  '7',
  '5#',
  '11',
  '3',
  '2#',
  '1',
  '4',
  '6b',
  '3',
  '7b',
  '5#',
  '11#',
  '6b',
  '1',
  '3b',
  '5#',
  '6',
  '7',
  '3',
  '5#',
  '13',
  '11',
  '1',
  '6b',
  '5b',
  '3b',
  '13b',
  '1',
  '7b',
  '5',
  '11#',
  '6b',
  '3',
  '5#',
  '4',
  '6b',
  '7b',
  '5b',
  '4',
  '3b',
  '2',
  '5#',
  '11',
  '7b',
  '5',
  '6b',
  '13',
  '5#',
  '4',
  '11#',
  '13b',
  '7',
  '5',
  '6b',
  '4',
  '1',
  '6',
  '5',
  '3b',
  '4',
  '6b',
  '1',
  '5b',
  '1',
  '2b',
  '2',
  '2#',
  '3b',
  '3',
  '4',
  '4#',
  '5b',
  '5',
  '5#',
  '6b',
  '6',
  '7b',
  '7',
  '9b',
  '9',
  '9#',
  '11',
  '11#',
  '13b',
  '13',
]

const notes = ['A', 'B', 'C', 'D', 'E', 'G', 'F', 'Ab', 'Bb', 'Db', 'Eb', 'Gb']

export default function RandomIntervals() {
  const [interval, setInterval] = useState(0)
  const [init, setInit] = useState(false)
  const [startingNote, setStartingNote] = useState(null)

  useEffect(() => {
    setStartingNote(notes[Math.floor(Math.random() * notes.length)])
  }, [])

  return (
    <Layout>
      {({ _lang }) => (
        <>
          <div
            id="cooldown"
            className="flex flex-col min-h-screen items-center place-content-center select-none"
            onClick={() => {
              if (!init) {
                setInit(true)
                return
              }

              if (interval + 1 === table.length) {
                setInit(false)
                setInterval(0)
              } else {
                setInterval(interval + 1)
              }
            }}
          >
            {!init ? (
              <div key="starting-note" className="text-5xl lg:text-6xl">
                Starting note: {startingNote}
              </div>
            ) : (
              <div key="interval" className="text-5xl lg:text-6xl">
                {table[interval]}
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  )
}
