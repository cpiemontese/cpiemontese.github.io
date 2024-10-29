import Layout from '@/components/layout'
import Permutation from '@/components/permutation'

const strings = [1, 2, 3, 4, 5, 6]

const stringCombinations = [
  [1, 1],
  [1, 2],
  [2, 1],
]

const triadTypes = ['Maj', 'Min', 'Dim', 'Aug']

let zip = []
for (let i = 0; i < strings.length; i++) {
  for (let j = 0; j < stringCombinations.length; j++) {
    for (let k = 0; k < triadTypes.length; k++) {
      zip.push([strings[i], stringCombinations[j], triadTypes[k]])
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
              const [string, combination, triadType] = elements[idx]
              return `String ${string} - ${combination[0]}/${combination[1]} - triad ${triadType}`
            }}
          />
        </>
      )}
    </Layout>
  )
}
