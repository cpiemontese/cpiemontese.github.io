import Layout from '@/components/layout'
import Permutation from '@/components/permutation'
import { NOTES } from '../../../lib/utils'

const strings = [2, 3, 4, 5, 6]

const stringCombinations = [
  [2, 2],
  [1, 3],
  [3, 1],
]

const quadriadTypes = ['△', '-7', '7', 'ø7', '°']

let zip = []
for (let h = 0; h < NOTES.length; h++) {
  for (let i = 0; i < strings.length; i++) {
    for (let j = 0; j < stringCombinations.length; j++) {
      for (let k = 0; k < quadriadTypes.length; k++) {
        zip.push([NOTES[h], strings[i], stringCombinations[j], quadriadTypes[k]])
      }
    }
  }
}

export default function TriadPermutation() {
  return (
    <Layout>
      {({ _lang }) => (
        <>
          <Permutation
            elements={zip}
            getElemFn={(elements, idx) => {
              const [note, string, combination, quadriadType] = elements[idx]
              return (
                <div className="flex flex-col items-center">
                  <div className="mb-4">{`String ${string}`}</div>
                  <div className="mb-4">{`${combination[0]}/${combination[1]}`}</div>
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
