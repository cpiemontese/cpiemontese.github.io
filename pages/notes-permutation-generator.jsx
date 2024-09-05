import { useState } from 'react'
import Layout from '../components/layout'

function shuffle(array) {
  const arrayCopy = [...array]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]]
  }
  return arrayCopy
}
const notes = ['A', 'B', 'C', 'D', 'E', 'G', 'F', 'Ab', 'Bb', 'Db', 'Eb', 'Gb']

export default function NotesPermutationGenerator() {
  const [init, setInit] = useState(false)
  const [currentNotes, setNotes] = useState(shuffle(notes))

  return (
    <Layout>
      {({ _lang }) => (
        <>
          <div
            id="scale"
            className="flex flex-col sm:flex-row min-h-screen items-center place-content-evenly select-none"
            onClick={() => {
              if (!init) setInit(true)
              setNotes(shuffle(currentNotes))
            }}
          >
            {!init ? (
              <div className="text-5xl lg:text-6xl">Click here</div>
            ) : (
              currentNotes.map((note) => (
                <div key={note} className="text-5xl lg:text-6xl">
                  {note}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </Layout>
  )
}
