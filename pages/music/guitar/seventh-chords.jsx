import Layout from '@/components/layout'
import Permutation from '@/components/permutation'
import { NOTES, QUADRIAD_TYPES } from '../../../lib/utils'

const strings = [6, 5, 4]
const bassNotes = [1, 3, 5, 7]

let zip = []
for (let h = 0; h < NOTES.length; h++) {
  for (let i = 0; i < strings.length; i++) {
    for (let j = 0; j < bassNotes.length; j++) {
      for (let k = 0; k < QUADRIAD_TYPES.length; k++) {
        zip.push([NOTES[h], strings[i], bassNotes[j], QUADRIAD_TYPES[k], false])
        // For "drop" fingerings
        if (strings[i] === 6 || strings[i] === 5) {
          zip.push([NOTES[h], strings[i], bassNotes[j], QUADRIAD_TYPES[k], true])
        }
      }
    }
  }
}

export default function SeventhChords() {
  return (
    <Layout>
      {({}) => (
        <>
          <Permutation
            elements={zip}
            getElemFn={(elements, idx) => {
              const [note, string, bassNote, quadriadType, alt] = elements[idx]
              return (
                <div className="flex flex-col items-center">
                  <div className="mb-4">{`String ${string}`}</div>
                  <div className="mb-4">{`bass ${bassNote}`}</div>
                  {alt ? <div className="mb-4">alt</div> : null}
                  <div>{`${note}${quadriadType}`}</div>
                </div>
              )
            }}
          />
        </>
      )}
    </Layout>
  )
}
