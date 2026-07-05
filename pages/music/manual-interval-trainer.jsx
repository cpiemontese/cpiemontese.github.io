import { useEffect, useMemo, useRef, useState } from 'react'
import Layout, { EN } from '../../components/layout'
import { TrainerPromptCard, TrainerStatusPill } from '../../components/trainer-ui'
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

  const [allDurations, setAllDurations] = useState([])

  useEffect(() => {
    setStartingNote(getRandomNote())
    setCurrentInterval(getRandomInterval())
  }, [])

  // Keep recap intentionally simple: only total time and average time per answered note.
  const recap = useMemo(() => {
    const totalNotes = allDurations.length
    const totalTime = allDurations.reduce((acc, value) => acc + value, 0)
    const avgPerNote = totalNotes ? totalTime / totalNotes : null
    return { totalTime, avgPerNote }
  }, [allDurations])

  const startSession = () => {
    setAllDurations([])
    setRound(0)
    setIsShowingRecap(false)
    setIsRunning(true)
    lastAnswerAtRef.current = performance.now()
  }

  const handleMainAreaClick = () => {
    // Same gesture for all states: start, progress, then reset after recap.
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
    const previousAnswerAt = lastAnswerAtRef.current

    // Track the time needed to answer the current note/interval prompt.
    if (previousAnswerAt != null && currentInterval != null) {
      const answerDuration = now - previousAnswerAt
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
        <div className="relative flex min-h-screen">
          <div
            className="relative z-10 flex-1 flex flex-col items-center place-content-center select-none px-4"
            onClick={handleMainAreaClick}
          >
            <h1 className="text-2xl md:text-4xl mb-8 text-center font-semibold tracking-tight">
              {lang === EN ? 'Manual interval trainer' : 'Interval trainer manuale'}
            </h1>

            {isRunning && (
              <div className="w-full max-w-xl mb-5 flex justify-center px-1">
                <TrainerStatusPill className="shadow-sm">
                  <div className="text-sm md:text-base text-gray-600 dark:text-gray-300 tracking-wide">
                    {`Round ${round + 1}/${SESSION_LENGTH}`}
                  </div>
                </TrainerStatusPill>
              </div>
            )}

            {!isRunning && !isShowingRecap && (
              <div className="text-center">
                <TrainerPromptCard>
                  <p className="text-3xl md:text-5xl font-mono font-semibold leading-tight text-emerald-700 dark:text-emerald-300">
                    {lang === EN ? `Start from ${startingNote || '-'}` : `Parti da ${startingNote || '-'}`}
                  </p>
                </TrainerPromptCard>
                <p className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-300">
                  {lang === EN ? 'Click anywhere to start.' : 'Clicca ovunque per iniziare.'}
                </p>
              </div>
            )}

            {isRunning && (
              <div className="text-center">
                <TrainerPromptCard>
                  <p className="text-4xl md:text-6xl font-mono font-semibold leading-tight text-emerald-700 dark:text-emerald-300">
                    {currentInterval}
                  </p>
                </TrainerPromptCard>
                <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
                  {lang === EN ? 'Click to confirm and go next' : 'Clicca per confermare e andare avanti'}
                </p>
              </div>
            )}

            {isShowingRecap && (
              <div className="w-full max-w-2xl mx-auto p-6 text-center rounded-3xl border border-gray-200/70 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/60 backdrop-blur">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                  {lang === EN ? 'Session recap' : 'Riepilogo sessione'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-900/20">
                    <div className="text-gray-600 dark:text-gray-300">
                      {lang === EN ? 'Total time' : 'Tempo totale'}
                    </div>
                    <div className="text-2xl font-semibold mt-1">{formatDuration(recap.totalTime)}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-900/20">
                    <div className="text-gray-600 dark:text-gray-300">
                      {lang === EN ? 'Average per note' : 'Media per nota'}
                    </div>
                    <div className="text-2xl font-semibold mt-1">{formatDuration(recap.avgPerNote)}</div>
                  </div>
                </div>

                <p className="mt-6 text-sm md:text-base text-gray-600 dark:text-gray-300">
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
