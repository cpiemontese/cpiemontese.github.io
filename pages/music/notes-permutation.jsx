import { useState } from 'react'
import Layout from '@/components/layout'
import { NOTES } from '../../lib/utils'

function shuffle(array) {
  const arrayCopy = [...array]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]]
  }
  return arrayCopy
}
export default function NotesPermutation() {
  const [init, setInit] = useState(false)
  const [currentNotes, setNotes] = useState(shuffle(NOTES))

  return (
    <Layout>
      {({ _lang }) => (
        <>
          <div
            id="scale"
            className="flex flex-col sm:flex-row min-h-screen items-center place-content-evenly select-none px-4 text-slate-100"
            onClick={() => {
              if (!init) setInit(true)
              setNotes(shuffle(currentNotes))
            }}
          >
            {!init ? (
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900 px-8 py-6 text-3xl md:text-5xl lg:text-6xl shadow-xl shadow-black/20">
                Click here
              </div>
            ) : (
              currentNotes.map((note, idx) => (
                <div
                  key={note}
                  className={`rounded-2xl border border-slate-700/80 bg-slate-900 px-8 py-6 text-3xl md:text-5xl lg:text-6xl shadow-xl shadow-black/20 ${
                    idx < currentNotes.length - 1 ? 'mb-4 sm:mb-0' : ''
                  }`}
                >
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
