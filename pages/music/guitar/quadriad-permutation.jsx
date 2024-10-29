import Layout from '@/components/layout'
import Permutation from '@/components/permutation'

const strings = [1, 2, 3, 4, 5, 6]

const stringCombinations = [
  [2, 2],
  [1, 3],
  [3, 1],
]

const quadriadTypes = ['Maj', 'Min', 'Dom', 'HDim', 'Dim']

let zip = []
for (let i = 0; i < strings.length; i++) {
  for (let j = 0; j < stringCombinations.length; j++) {
    for (let k = 0; k < quadriadTypes.length; k++) {
      zip.push([strings[i], stringCombinations[j], quadriadTypes[k]])
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
              const [string, combination, quadriadType] = elements[idx]
              return `String ${string} - ${combination[0]}/${combination[1]} - triad ${quadriadType}`
            }}
          />
        </>
      )}
    </Layout>
  )
}
