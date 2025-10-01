export const NOTES = ['A', 'B', 'C', 'D', 'E', 'G', 'F', 'Ab', 'Bb', 'Db', 'Eb', 'Gb']
export const getRandomNote = () => NOTES[Math.floor(Math.random() * NOTES.length)]

export const QUADRIAD_TYPES = ['△', '-7', '7', 'ø7', '°']

export function shuffle(array) {
  const arrayCopy = [...array]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]]
  }
  return arrayCopy
}

export function randomPermutation(from, to) {
  const result = []
  for (let i = from; i <= to; i++) {
    result.push(i)
  }
  return shuffle(result)
}
