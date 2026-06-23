import { useCallback, useRef, useState } from 'react'
import type { Scene, Message, SessionMetrics, Correction } from '../types'
import { checkGrammar, computeGrammarAccuracy } from '../services/grammarChecker'
import {
  analyzePronunciation,
  computeFluencyScore,
} from '../services/pronunciationAnalyzer'
import {
  generateCoachResponse,
  buildSessionSummary,
} from '../services/aiCoach'

function createInitialMetrics(): SessionMetrics {
  return {
    durationSeconds: 0,
    turnCount: 0,
    avgPronunciationScore: 0,
    grammarAccuracy: 100,
    fluencyScore: 0,
    vocabularyUsed: [],
    correctionsCount: 0,
    strengths: [],
    improvements: [],
  }
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useSession() {
  const [scene, setScene] = useState<Scene | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [metrics, setMetrics] = useState<SessionMetrics>(createInitialMetrics)
  const [status, setStatus] = useState<'idle' | 'selecting' | 'active' | 'summary'>('selecting')
  const [isProcessing, setIsProcessing] = useState(false)
  const [liveCorrection, setLiveCorrection] = useState<Correction | null>(null)

  const startTimeRef = useRef<number>(0)
  const pronunciationScoresRef = useRef<number[]>([])
  const allCorrectionsRef = useRef<Correction[]>([])
  const wordCountsRef = useRef<number[]>([])
  const turnIndexRef = useRef(0)

  const startSession = useCallback((selectedScene: Scene) => {
    setScene(selectedScene)
    setMessages([
      {
        id: uid(),
        role: 'assistant',
        text: selectedScene.openingLine,
        timestamp: Date.now(),
      },
    ])
    setMetrics(createInitialMetrics())
    setStatus('active')
    setLiveCorrection(null)
    startTimeRef.current = Date.now()
    pronunciationScoresRef.current = []
    allCorrectionsRef.current = []
    wordCountsRef.current = []
    turnIndexRef.current = 0
  }, [])

  const endSession = useCallback(() => {
    if (!scene) return

    const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
    const avgPron =
      pronunciationScoresRef.current.length > 0
        ? Math.round(
            pronunciationScoresRef.current.reduce((a, b) => a + b, 0) /
              pronunciationScoresRef.current.length,
          )
        : 0

    const avgWords =
      wordCountsRef.current.length > 0
        ? wordCountsRef.current.reduce((a, b) => a + b, 0) / wordCountsRef.current.length
        : 0

    const fluency = computeFluencyScore(avgWords, 0.1, turnIndexRef.current)
    const grammarAcc = computeGrammarAccuracy(
      turnIndexRef.current,
      allCorrectionsRef.current.filter((c) => c.type === 'grammar').length,
    )

    const vocabUsed = messages
      .filter((m) => m.role === 'user')
      .flatMap((m) => m.text.toLowerCase().split(/\s+/))

    const { strengths, improvements } = buildSessionSummary(
      scene,
      turnIndexRef.current,
      avgPron,
      grammarAcc,
      fluency,
      allCorrectionsRef.current,
      vocabUsed,
    )

    setMetrics({
      durationSeconds: duration,
      turnCount: turnIndexRef.current,
      avgPronunciationScore: avgPron,
      grammarAccuracy: grammarAcc,
      fluencyScore: fluency,
      vocabularyUsed: [...new Set(vocabUsed.filter((w) => w.length > 3))].slice(0, 20),
      correctionsCount: allCorrectionsRef.current.length,
      strengths,
      improvements,
    })
    setStatus('summary')
    setLiveCorrection(null)
  }, [scene, messages])

  const handleUserSpeech = useCallback(
    async (transcript: string, confidence: number) => {
      if (!scene || isProcessing || !transcript.trim()) return

      setIsProcessing(true)
      setLiveCorrection(null)

      const corrections = checkGrammar(transcript)
      allCorrectionsRef.current.push(...corrections)

      const pronunciation = analyzePronunciation(transcript, confidence)
      pronunciationScoresRef.current.push(pronunciation.overallScore)

      const words = transcript.split(/\s+/).filter(Boolean)
      wordCountsRef.current.push(words.length)
      turnIndexRef.current += 1

      if (corrections.length > 0) {
        setLiveCorrection(corrections[0])
      }

      const userMsg: Message = {
        id: uid(),
        role: 'user',
        text: transcript,
        timestamp: Date.now(),
        corrections,
        pronunciationScore: pronunciation.overallScore,
      }

      setMessages((prev) => [...prev, userMsg])

      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        text: m.text,
      }))

      try {
        const response = await generateCoachResponse({
          scene,
          userMessage: transcript,
          turnIndex: turnIndexRef.current,
          history,
        })

        const assistantMsg: Message = {
          id: uid(),
          role: 'assistant',
          text: response,
          timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, assistantMsg])
        setIsProcessing(false)
        return response
      } catch {
        setIsProcessing(false)
        return null
      }
    },
    [scene, isProcessing, messages],
  )

  const reset = useCallback(() => {
    setScene(null)
    setMessages([])
    setMetrics(createInitialMetrics())
    setStatus('selecting')
    setLiveCorrection(null)
    setIsProcessing(false)
  }, [])

  return {
    scene,
    messages,
    metrics,
    status,
    isProcessing,
    liveCorrection,
    startSession,
    endSession,
    handleUserSpeech,
    reset,
  }
}
