import Layout from '@/components/layout'
import Permutation from '@/components/permutation'
import { NOTES } from '../../../lib/utils'

const types = ['△', '6', '-7', '-6', '7(9,13)', '7#11', '7b9', '7b13', 'ø7']
const roots = ['1', '3', '5', '7']

let zip = []
for (var n of NOTES) {
  for (var t of types) {
    for (var r of roots) {
      zip.push([n, t, r])
    }
  }
}

export default function FourNotesVoicings() {
  return (
    <Layout>
      {({}) => (
        <>
          <Permutation
            elements={zip}
            getElemFn={(elements, idx) => {
              const [note, type, root] = elements[idx]
              return (
                <div className="flex flex-col items-center">
                  <div className="mb-4">{`${note}${type}`}</div>
                  <div>{`${root}`}</div>
                </div>
              )
            }}
          />
        </>
      )}
    </Layout>
  )
}
