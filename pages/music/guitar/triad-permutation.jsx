import Layout from '@/components/layout'
import Permutation from '@/components/permutation'

const notes = ['A', 'B', 'C', 'D', 'E', 'G', 'F', 'Ab', 'Bb', 'Db', 'Eb', 'Gb']
const strings = [1, 2, 3, 4, 5]
const stringCombinations = ['mono', '1/2', '2/1']
const triadTypes = ['', '-', '°', '+']

let zip = []
for (let h = 0; h < notes.length; h++) {
  for (let i = 0; i < strings.length; i++) {
    for (let j = 0; j < stringCombinations.length; j++) {
      for (let k = 0; k < triadTypes.length; k++) {
        zip.push([notes[h], strings[i], stringCombinations[j], triadTypes[k]])
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
              const [note, string, combination, triadType] = elements[idx]
              return `String ${string} - ${combination} - ${note}${triadType}`
            }}
          />
        </>
      )}
    </Layout>
  )
}
