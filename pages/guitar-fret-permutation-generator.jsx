import Layout from '../components/layout'
import Permutation from '../components/permutation'

const stringPerDot = [
  [1, 1],
  [1, 3],
  [1, 5],
  [1, 7],
  [1, 9],
  [1, 12],
  [2, 1],
  [2, 3],
  [2, 5],
  [2, 7],
  [2, 9],
  [2, 12],
  [3, 1],
  [3, 3],
  [3, 5],
  [3, 7],
  [3, 9],
  [3, 12],
  [4, 1],
  [4, 3],
  [4, 5],
  [4, 7],
  [4, 9],
  [4, 12],
  [5, 1],
  [5, 3],
  [5, 5],
  [5, 7],
  [5, 9],
  [5, 12],
  [6, 1],
  [6, 3],
  [6, 5],
  [6, 7],
  [6, 9],
  [6, 12],
]

export default function GuitarStringDotPermutationGenerator() {
  return (
    <Layout>
      {({ _lang }) => (
        <>
          <Permutation
            elements={stringPerDot}
            getElemFn={(elements, idx) => {
              return `String ${elements[idx][0]} Fret ${elements[idx][1]}`
            }}
          />
        </>
      )}
    </Layout>
  )
}
