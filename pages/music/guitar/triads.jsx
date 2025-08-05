import Layout from '@/components/layout'
import Permutation from '@/components/permutation'
import { NOTES } from '../../../lib/utils'

const sets = ['654', '543', '432', '321']
const inversions = ['R', 'I', 'II']

let zip = []
for (let h = 0; h < NOTES.length; h++) {
  for (let i = 0; i < sets.length; i++) {
    for (let j = 0; j < inversions.length; j++) {
      zip.push([NOTES[h], sets[i], inversions[j]])
    }
  }
}

export default function Triads() {
  return (
    <Layout>
      {({}) => (
        <>
          <Permutation
            elements={zip}
            getElemFn={(elements, idx) => {
              const [note, set, inversion] = elements[idx]
              return (
                <div className="flex flex-col items-center">
                  <div className="mb-4">{`${note}`}</div>
                  <div className="mb-4">{`${set}`}</div>
                  <div>{`${inversion}`}</div>
                </div>
              )
            }}
          />
        </>
      )}
    </Layout>
  )
}
