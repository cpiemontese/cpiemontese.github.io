import { useEffect, useMemo, useRef, useState } from 'react'
import Layout from '../../components/layout'
import { getRandomNote } from '../../lib/utils'

const table = [
  '4',
  '1',
  '13b',
  '7',
  '5#',
  '11',
  '3',
  '2#',
  '1',
  '4',
  '6b',
  '3',
  '7b',
  '5#',
  '11#',
  '6b',
  '1',
  '3b',
  '5#',
  '6',
  '7',
  '3',
  '5#',
  '13',
  '11',
  '1',
  '6b',
  '5b',
  '3b',
  '13b',
  '1',
  '7b',
  '5',
  '11#',
  '6b',
  '3',
  '5#',
  '4',
  '6b',
  '7b',
  '5b',
  '4',
  '3b',
  '2',
  '5#',
  '11',
  '7b',
  '5',
  '6b',
  '13',
  '5#',
  '4',
  '11#',
  '13b',
  '7',
  '5',
  '6b',
  '4',
  '1',
  '6',
  '5',
  '3b',
  '4',
  '6b',
  '1',
  '5b',
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
  '11',
  '11#',
  '13b',
  '13',
]

// Small formatter for milliseconds → human friendly
const fmt = (ms) => {
  if (ms == null) return '-'
  const s = ms / 1000
  if (s < 10) return `${s.toFixed(2)}s`
  if (s < 60) return `${s.toFixed(1)}s`
  const m = Math.floor(s / 60)
  const rs = Math.round(s % 60)
  return `${m}m ${rs}s`
}

export default function RandomIntervals() {
  const [idx, setIdx] = useState(0)
  const [running, setRunning] = useState(false)
  const [showRecap, setShowRecap] = useState(false)
  const [startingNote, setStartingNote] = useState(null)

  // timings
  const lastTickRef = useRef(null)

  // stats accumulated in-memory only
  const [byInterval, setByInterval] = useState({}) // { label: [ms, ms, ...] }
  const [allDurations, setAllDurations] = useState([]) // [ms, ...]

  useEffect(() => {
    setStartingNote(getRandomNote())
  }, [])

  // Derived stats for recap
  const recap = useMemo(() => {
    const perInterval = Object.fromEntries(
      Object.entries(byInterval).map(([name, arr]) => {
        if (!arr.length) return [name, { count: 0, avg: null, min: null, max: null }]
        const sum = arr.reduce((a, b) => a + b, 0)
        const avg = sum / arr.length
        const min = Math.min(...arr)
        const max = Math.max(...arr)
        return [name, { count: arr.length, avg, min, max }]
      })
    )

    const totalCount = allDurations.length
    const totalTime = allDurations.reduce((a, b) => a + b, 0)
    const globalAvg = totalCount ? totalTime / totalCount : null
    const fastest = totalCount ? Math.min(...allDurations) : null
    const slowest = totalCount ? Math.max(...allDurations) : null

    let worst = null // highest average
    for (const [name, s] of Object.entries(perInterval)) {
      if (!s.count) continue
      if (!worst || s.avg > worst.avg) worst = { name, avg: s.avg, count: s.count }
    }

    return { perInterval, totalTime, globalAvg, fastest, slowest, worst, totalCount }
  }, [byInterval, allDurations])

  const startSession = () => {
    // keep the current startingNote; it was just shown to the user
    setByInterval({})
    setAllDurations([])
    setIdx(0)
    setShowRecap(false)
    setRunning(true)
    lastTickRef.current = performance.now()
  }

  const handleClick = () => {
    // From recap → go back to starting-note screen with a NEW note (do NOT start timing yet)
    if (showRecap) {
      setShowRecap(false)
      setRunning(false)
      setIdx(0)
      setStartingNote(getRandomNote())
      lastTickRef.current = null
      return
    }

    // If not running, the first click starts a session (keeps the shown starting note)
    if (!running) {
      startSession()
      return
    }

    // Session running: record current duration + advance
    const now = performance.now()
    const label = table[idx]
    const last = lastTickRef.current

    if (last != null && label != null) {
      const elapsed = now - last
      setByInterval((prev) => {
        const arr = prev[label] ? [...prev[label], elapsed] : [elapsed]
        return { ...prev, [label]: arr }
      })
      setAllDurations((prev) => [...prev, elapsed])
    }

    // End of sequence → show recap (do not change starting note here)
    if (idx + 1 === table.length) {
      setRunning(false)
      setShowRecap(true)
      lastTickRef.current = null
    } else {
      setIdx((i) => i + 1)
      lastTickRef.current = now
    }
  }

  return (
    <Layout>
      {() => (
        <div className="flex min-h-screen">
          {/* Main clickable area */}
          <div className="flex-1 flex flex-col items-center place-content-center select-none" onClick={handleClick}>
            {!running && !showRecap && (
              <div className="text-center">
                <div className="text-3xl md:text-5xl lg:text-6xl">Starting note: {startingNote}</div>
              </div>
            )}

            {running && (
              <>
                <div className="text-5xl lg:text-6xl mb-8">{table[idx]}</div>
                <div className="text-xl md:text-3xl lg:text-4xl">
                  {idx + 1} / {table.length}
                </div>
              </>
            )}

            {showRecap && (
              <div className="w-full max-w-3xl mx-auto p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4">Session recap</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-6">
                  <div className="p-3 rounded-lg">
                    <div className="text-gray-500">Total answers</div>
                    <div className="text-lg font-medium">{recap.totalCount}</div>
                  </div>
                  <div className="p-3 rounded-lg">
                    <div className="text-gray-500">Total time</div>
                    <div className="text-lg font-medium">{fmt(recap.totalTime)}</div>
                  </div>
                  <div className="p-3 rounded-lg">
                    <div className="text-gray-500">Global average</div>
                    <div className="text-lg font-medium">{fmt(recap.globalAvg)}</div>
                  </div>
                  <div className="p-3 rounded-lg">
                    <div className="text-gray-500">Fastest (single)</div>
                    <div className="text-lg font-medium">{fmt(recap.fastest)}</div>
                  </div>
                  <div className="p-3 rounded-lg">
                    <div className="text-gray-500">Slowest (single)</div>
                    <div className="text-lg font-medium">{fmt(recap.slowest)}</div>
                  </div>
                  <div className="p-3 rounded-lg">
                    <div className="text-gray-500">Most challenging interval</div>
                    <div className="text-lg font-medium">
                      {recap.worst ? `${recap.worst.name} (${fmt(recap.worst.avg)})` : '-'}
                    </div>
                  </div>
                </div>

                <h3 className="mt-6 mb-2 font-medium">By interval</h3>
                <div className="max-h-[45vh] overflow-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-800">
                      <tr>
                        <th className="text-left px-3 py-2">Int.</th>
                        <th className="text-right px-3 py-2">#</th>
                        <th className="text-right px-3 py-2">Avg</th>
                        <th className="text-right px-3 py-2">Min</th>
                        <th className="text-right px-3 py-2">Max</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(recap.perInterval)
                        .sort((a, b) => (b[1].avg ?? 0) - (a[1].avg ?? 0))
                        .map(([name, s]) => (
                          <tr key={name} className="odd:bg-gray-500">
                            <td className="px-3 py-2 font-mono">{name}</td>
                            <td className="px-3 py-2 text-right">{s.count}</td>
                            <td className="px-3 py-2 text-right">{fmt(s.avg)}</td>
                            <td className="px-3 py-2 text-right">{fmt(s.min)}</td>
                            <td className="px-3 py-2 text-right">{fmt(s.max)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-6 text-gray-600">Click anywhere to start over.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
