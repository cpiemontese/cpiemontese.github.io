import Layout from '../components/layout'
import Permutation from '../components/permutation'

const stringPerDot = [
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [2, 1],
  [2, 2],
  [2, 3],
  [2, 4],
  [2, 5],
  [2, 6],
  [3, 1],
  [3, 2],
  [3, 3],
  [3, 4],
  [3, 5],
  [3, 6],
  [4, 1],
  [4, 2],
  [4, 3],
  [4, 4],
  [4, 5],
  [4, 6],
  [5, 1],
  [5, 2],
  [5, 3],
  [5, 4],
  [5, 5],
  [5, 6],
  [6, 1],
  [6, 2],
  [6, 3],
  [6, 4],
  [6, 5],
  [6, 6],
]

export default function GuitarStringDotPermutationGenerator() {
  return (
    <Layout>
      {({ _lang }) => (
        <>
          <Permutation
            elements={stringPerDot}
            getElemFn={(elements, idx) => {
              return `String ${elements[idx][0]} Dot ${elements[idx][1]}`
            }}
          />
        </>
      )}
    </Layout>
  )
}
