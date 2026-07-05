import { useEffect, useMemo, useRef, useState } from 'react'
import Layout, { EN } from '../../components/layout'
import { getRandomInterval, getRandomNote } from '../../lib/utils'

const SESSION_LENGTH = 100

const formatDuration = (ms) => {
  if (ms == null) return '-'
  const seconds = ms / 1000
  if (seconds < 10) return `${seconds.toFixed(2)}s`
  if (seconds < 60) return `${seconds.toFixed(1)}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  return `${minutes}m ${remainingSeconds}s`
}

export default function ManualIntervalTrainerPage() {
  const [round, setRound] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [currentInterval, setCurrentInterval] = useState(null)
  const [isShowingRecap, setIsShowingRecap] = useState(false)
  const [startingNote, setStartingNote] = useState(null)

  const lastAnswerAtRef = useRef(null)

  const [durationsByInterval, setDurationsByInterval] = useState({})
  const [allDurations, setAllDurations] = useState([])

  useEffect(() => {
    setStartingNote(getRandomNote())
    setCurrentInterval(getRandomInterval())
  }, [])

  const recap = useMemo(() => {
    const perInterval = Object.fromEntries(
      Object.entries(durationsByInterval).map(([name, values]) => {
        if (!values.length) {
          return [name, { count: 0, avg: null, min: null, max: null }]
        }

        const total = values.reduce((acc, value) => acc + value, 0)
        const avg = total / values.length
        const min = Math.min(...values)
        const max = Math.max(...values)

        return [name, { count: values.length, avg, min, max }]
      })
    )

    const totalAnswers = allDurations.length
    const totalTime = allDurations.reduce((acc, value) => acc + value, 0)
    const globalAvg = totalAnswers ? totalTime / totalAnswers : null
    const fastest = totalAnswers ? Math.min(...allDurations) : null
    const slowest = totalAnswers ? Math.max(...allDurations) : null

    let mostChallenging = null
    for (const [name, stats] of Object.entries(perInterval)) {
      if (!stats.count) continue
      if (!mostChallenging || stats.avg > mostChallenging.avg) {
        mostChallenging = { name, avg: stats.avg, count: stats.count }
      }
    }

    return { perInterval, totalAnswers, totalTime, globalAvg, fastest, slowest, mostChallenging }
  }, [durationsByInterval, allDurations])

  const startSession = () => {
    setDurationsByInterval({})
    setAllDurations([])
    setRound(0)
    setIsShowingRecap(false)
    setIsRunning(true)
    lastAnswerAtRef.current = performance.now()
  }

  const handleMainAreaClick = () => {
    if (isShowingRecap) {
      setIsShowingRecap(false)
      setIsRunning(false)
      setRound(0)
      setStartingNote(getRandomNote())
      setCurrentInterval(getRandomInterval())
      lastAnswerAtRef.current = null
      return
    }

    if (!isRunning) {
      startSession()
      return
    }

    const now = performance.now()
    const answeredInterval = currentInterval
    const previousAnswerAt = lastAnswerAtRef.current

    if (previousAnswerAt != null && answeredInterval != null) {
      const answerDuration = now - previousAnswerAt

      setDurationsByInterval((prev) => {
        const values = prev[answeredInterval] ? [...prev[answeredInterval], answerDuration] : [answerDuration]
        return { ...prev, [answeredInterval]: values }
      })

      setAllDurations((prev) => [...prev, answerDuration])
    }

    if (round + 1 === SESSION_LENGTH) {
      setIsRunning(false)
      setIsShowingRecap(true)
      lastAnswerAtRef.current = null
      return
    }

    setRound((current) => current + 1)
    setCurrentInterval((interval) => getRandomInterval(interval))
    lastAnswerAtRef.current = now
  }

  return (
    <Layout>
      {({ lang }) => (
        <div className="flex min-h-screen">
          <div
            className="flex-1 flex flex-col items-center place-content-center select-none"
            onClick={handleMainAreaClick}
          >
            <h1 className="text-xl md:text-2xl mb-8 text-center">
              {lang === EN ? 'Manual interval trainer' : 'Interval trainer manuale'}
            </h1>

            {!isRunning && !isShowingRecap && (
              <div className="text-center">
                <div className="text-3xl md:text-5xl lg:text-6xl">
                  {lang === EN ? 'Starting note' : 'Nota di partenza'}: {startingNote}
                </div>
                <p className="mt-4 text-gray-600">
                  {lang === EN ? 'Click anywhere to start.' : 'Clicca ovunque per iniziare.'}
                </p>
              </div>
            )}

            {isRunning && (
              <>
                <div className="text-5xl lg:text-6xl mb-8">{currentInterval}</div>
                <div className="text-xl md:text-3xl lg:text-4xl">
                  {round + 1} / {SESSION_LENGTH}
                </div>
              </>
            )}

            {isShowingRecap && (
              <div className="w-full max-w-3xl mx-auto p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4">{lang === EN ? 'Session recap' : 'Riepilogo sessione'}</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-6">
                  <div className="p-3 rounded-lg">
                    <div className="text-gray-500">{lang === EN ? 'Total answers' : 'Risposte totali'}</div>
                    <div className="text-lg font-medium">{recap.totalAnswers}</div>
                  </div>
                  <div className="p-3 rounded-lg">
                    <div className="text-gray-500">{lang === EN ? 'Total time' : 'Tempo totale'}</div>
                    <div className="text-lg font-medium">{formatDuration(recap.totalTime)}</div>
                  </div>
                  <div className="p-3 rounded-lg">
                    <div className="text-gray-500">{lang === EN ? 'Global average' : 'Media globale'}</div>
                    <div className="text-lg font-medium">{formatDuration(recap.globalAvg)}</div>
                  </div>
                  <div className="p-3 rounded-lg">
                    <div className="text-gray-500">{lang === EN ? 'Fastest (single)' : 'Piu veloce (singola)'}</div>
                    <div className="text-lg font-medium">{formatDuration(recap.fastest)}</div>
                  </div>
                  <div className="p-3 rounded-lg">
                    <div className="text-gray-500">{lang === EN ? 'Slowest (single)' : 'Piu lenta (singola)'}</div>
                    <div className="text-lg font-medium">{formatDuration(recap.slowest)}</div>
                  </div>
                  <div className="p-3 rounded-lg">
                    <div className="text-gray-500">
                      {lang === EN ? 'Most challenging interval' : 'Intervallo piu difficile'}
                    </div>
                    <div className="text-lg font-medium">
                      {recap.mostChallenging
                        ? `${recap.mostChallenging.name} (${formatDuration(recap.mostChallenging.avg)})`
                        : '-'}
                    </div>
                  </div>
                </div>

                <h3 className="mt-6 mb-2 font-medium">{lang === EN ? 'By interval' : 'Per intervallo'}</h3>
                <div className="max-h-[45vh] overflow-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-800">
                      <tr>
                        <th className="px-3 py-2">Int.</th>
                        <th className="px-3 py-2">#</th>
                        <th className="px-3 py-2">Avg</th>
                        <th className="px-3 py-2">Min</th>
                        <th className="px-3 py-2">Max</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(recap.perInterval)
                        .sort((a, b) => (b[1].avg ?? 0) - (a[1].avg ?? 0))
                        .map(([name, stats]) => (
                          <tr key={name} className="odd:bg-gray-500">
                            <td className="px-3 py-2 font-mono">{name}</td>
                            <td className="px-3 py-2">{stats.count}</td>
                            <td className="px-3 py-2">{formatDuration(stats.avg)}</td>
                            <td className="px-3 py-2">{formatDuration(stats.min)}</td>
                            <td className="px-3 py-2">{formatDuration(stats.max)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-6 text-gray-600">
                  {lang === EN ? 'Click anywhere to start over.' : 'Clicca ovunque per ricominciare.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}
