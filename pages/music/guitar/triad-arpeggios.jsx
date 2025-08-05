import Layout from '@/components/layout'
import Permutation from '@/components/permutation'
import { NOTES } from '../../../lib/utils'

const strings = [2, 3, 4, 5, 6]
const stringCombinations = ['mono', '1/2', '2/1']
const triadTypes = ['', '-', '°', '+']

let zip = []
for (let h = 0; h < NOTES.length; h++) {
  for (let i = 0; i < strings.length; i++) {
    for (let j = 0; j < stringCombinations.length; j++) {
      for (let k = 0; k < triadTypes.length; k++) {
        zip.push([NOTES[h], strings[i], stringCombinations[j], triadTypes[k]])
      }
    }
  }
}

export default function TriadArpeggios() {
  return (
    <Layout>
      {({}) => (
        <>
          <Permutation
            elements={zip}
            getElemFn={(elements, idx) => {
              const [note, string, combination, triadType] = elements[idx]
              return (
                <div className="flex flex-col items-center">
                  <div className="mb-4">{`String ${string}`}</div>
                  <div className="mb-4">{`${combination}`}</div>
                  <div>{`${note}${triadType}`}</div>
                </div>
              )
            }}
          />
        </>
      )}
    </Layout>
  )
}
