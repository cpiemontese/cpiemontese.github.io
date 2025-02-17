import { useEffect, useState } from 'react'

import Layout from '@/components/layout'
import Permutation from '@/components/permutation'
import { NOTES, QUADRIAD_TYPES } from '../../lib/utils'

const chords = []

for (let n = 0; n < NOTES.length; n++) {
  for (let qt = 0; qt < QUADRIAD_TYPES.length; qt++) {
    chords.push([NOTES[n], QUADRIAD_TYPES[qt]])
  }
}

export default function RandomChords() {
  return (
    <Layout>
      {({ _lang }) => (
        <>
          <Permutation
            elements={chords}
            getElemFn={(elements, idx) => {
              const [note, quadriadType] = elements[idx]
              return <div>{`${note}${quadriadType}`}</div>
            }}
          />
        </>
      )}
    </Layout>
  )
}
