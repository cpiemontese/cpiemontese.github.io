export const NOTES = ['A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab']
export const USEFUL_ROOTS = ['A', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab']

export const NOTE_TO_PITCH_CLASS = {
  'C': 0,
  'C#': 1,
  'Db': 1,
  'D': 2,
  'D#': 3,
  'Eb': 3,
  'E': 4,
  'F': 5,
  'F#': 6,
  'Gb': 6,
  'G': 7,
  'G#': 8,
  'Ab': 8,
  'A': 9,
  'A#': 10,
  'Bb': 10,
  'B': 11,
}

export const getRandomNote = (otherThan = null) => {
  if (!otherThan) {
    return NOTES[Math.floor(Math.random() * NOTES.length)]
  }

  let note = NOTES[Math.floor(Math.random() * NOTES.length)]
  while (note === otherThan) {
    note = NOTES[Math.floor(Math.random() * NOTES.length)]
  }
  return note
}

export const getRandomUsefulRoot = (otherThan = null) => {
  if (!otherThan) {
    return USEFUL_ROOTS[Math.floor(Math.random() * USEFUL_ROOTS.length)]
  }

  let note = USEFUL_ROOTS[Math.floor(Math.random() * USEFUL_ROOTS.length)]
  while (note === otherThan) {
    note = USEFUL_ROOTS[Math.floor(Math.random() * USEFUL_ROOTS.length)]
  }
  return note
}

export const INTERVALS = [
  ['1'],
  ['2b', '9b'],
  ['2', '9'],
  ['2#', '9#'],
  ['3b'],
  ['3'],
  ['4', '11'],
  ['4#', '11#'],
  ['5b'],
  ['5'],
  ['5#'],
  ['6b', '13b'],
  ['6', '13'],
  ['7b'],
  ['7'],
]

const _getRandomElem = (list) => list[Math.floor(Math.random() * list.length)]

const _flattenInterval = (interval) => {
  if (interval.length === 1) {
    return interval[0]
  } else {
    return _getRandomElem(interval)
  }
}

const _getRandomInterval = () => _flattenInterval(_getRandomElem(INTERVALS))

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
