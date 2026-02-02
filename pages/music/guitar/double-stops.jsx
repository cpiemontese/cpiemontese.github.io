import Layout from '@/components/layout'
import Permutation from '@/components/permutation'
import { NOTES } from '../../../lib/utils'

const types = ['major', 'minor', 'dominant']

const stringCombinations = ['4-3', '3-2', '2-1']

const order = ['37', '73']

let zip = []
for (let h = 0; h < NOTES.length; h++) {
  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < stringCombinations.length; j++) {
      for (let k = 0; k < order.length; k++) {
        zip.push([NOTES[h], types[i], stringCombinations[j], order[k]])
      }
    }
  }
}

export default function DoubleStops() {
  return (
    <Layout>
      {({}) => (
        <>
          <Permutation
            elements={zip}
            getElemFn={(elements, idx) => {
              const [note, type, combination, order] = elements[idx]
              return (
                <div className="flex flex-col items-center">
                  <div>{`${note} ${type}`}</div>
                  <div>{`${combination}`}</div>
                  <div>{`${order}`}</div>
                </div>
              )
            }}
          />
        </>
      )}
    </Layout>
  )
}
