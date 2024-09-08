import Layout from '../components/layout'
import Permutation from '../components/permutation'

const turnarounds = [
  '1625',
  '1645',
  '1627',
  '1647',
  '1325',
  '1345',
  '1327',
  '1347',
  '3625',
  '3645',
  '3627',
  '3647',
  '3125',
  '3145',
  '3127',
  '3147',
  '6125',
  '6145',
  '6127',
  '6147',
  '6325',
  '6345',
  '6327',
  '6347',
]

export default function TurnaroundPermutationGenerator() {
  return (
    <Layout>
      {({ _lang }) => (
        <>
          <Permutation elements={turnarounds} />
        </>
      )}
    </Layout>
  )
}
