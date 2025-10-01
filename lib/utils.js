export const NOTES = ['A', 'B', 'C', 'D', 'E', 'G', 'F', 'Ab', 'Bb', 'Db', 'Eb', 'Gb']
export const getRandomNote = () => NOTES[Math.floor(Math.random() * NOTES.length)]

export const INTERVALS = [
  '1',
  '2b',
  '2',
  '2#',
  '3b',
  '3',
  '4',
  '4#',
  '5b',
  '5',
  '5#',
  '6b',
  '6',
  '7b',
  '7',
  '9b',
  '9',
  '9#',
  '13b',
  '13',
]

const _getRandomInterval = () => INTERVALS[Math.floor(Math.random() * INTERVALS.length)]

export function getRandomInterval(otherThan = null) {
  if (!otherThan) {
    return _getRandomInterval()
  }

  let interval = _getRandomInterval()
  while (interval === otherThan) {
    interval = _getRandomInterval()
  }
  return interval
}

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
