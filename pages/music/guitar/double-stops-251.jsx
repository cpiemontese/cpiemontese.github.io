import Layout from '@/components/layout'
import Permutation from '@/components/permutation'
import { NOTES } from '../../../lib/utils'

const types = ['△', '-7', '7']
const stringCombinations = ['4-3', '3-2', '2-1']
const order = ['37', '73']

let zipStringCombinationsAndOrder = []

for (var sc of stringCombinations) {
  for (var o of order) {
    zipStringCombinationsAndOrder.push([sc, o])
  }
}

let zip = []
for (var root of NOTES) {
  for (var sco_II of zipStringCombinationsAndOrder) {
    for (var sco_V of zipStringCombinationsAndOrder) {
      for (var sco_I of zipStringCombinationsAndOrder) {
        zip.push([root, sco_II, sco_V, sco_I])
      }
    }
  }
}

export default function DoubleStops251() {
  return (
    <Layout>
      {({}) => (
        <>
          <Permutation
            elements={zip}
            getElemFn={(elements, idx) => {
              const [root, sco_II, sco_V, sco_I] = elements[idx]
              return (
                <div className="flex flex-col items-center">
                  <div>{`${root}`}</div>
                  <div>{`II, ${sco_II[0]}, ${sco_II[1]}`}</div>
                  <div>{`V, ${sco_V[0]}, ${sco_V[1]}`}</div>
                  <div>{`I, ${sco_I[0]}, ${sco_I[1]}`}</div>
                </div>
              )
            }}
          />
        </>
      )}
    </Layout>
  )
}
