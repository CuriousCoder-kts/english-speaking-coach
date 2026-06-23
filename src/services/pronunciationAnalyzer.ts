import type { PronunciationResult, WordScore } from '../types'

const CHALLENGING_WORDS: Record<string, string> = {
  th: 'Practice "th" by placing tongue between teeth — e.g., "think", "three"',
  r: 'Roll or tap the "r" lightly — avoid substituting with "l"',
  v: 'Upper teeth on lower lip for "v" — don\'t use "w" sound',
  w: 'Round lips for "w" — distinct from "v"',
  ed: 'Past tense "-ed" can be /t/, /d/, or /ɪd/ depending on the ending',
}

const COMMON_MISPRONUNCIATIONS = [
  'comfortable', 'vegetable', 'specifically', 'particularly',
  'development', 'architecture', 'responsibility', 'entrepreneur',
  'colleague', 'schedule', 'recommendation', 'restaurant',
]

export function analyzePronunciation(
  transcript: string,
  confidence: number,
  alternativeConfidences: number[] = [],
): PronunciationResult {
  const words = transcript
    .toLowerCase()
    .replace(/[^\w\s'-]/g, '')
    .split(/\s+/)
    .filter(Boolean)

  const wordScores: WordScore[] = words.map((word, i) => {
    const altConf = alternativeConfidences[i] ?? confidence
    const blended = confidence * 0.7 + altConf * 0.3
    let score = Math.round(blended * 100)
    let issue: string | undefined

    if (COMMON_MISPRONUNCIATIONS.includes(word) && score < 85) {
      issue = `"${word}" is commonly mispronounced — listen to native speakers and practice slowly.`
      score = Math.min(score, 75)
    }

    if (word.length > 8 && score < 80) {
      issue = issue ?? 'Long word — try breaking it into syllables.'
    }

    if (/^th/.test(word) && score < 85) {
      issue = issue ?? CHALLENGING_WORDS.th
    }

    return { word, score, issue }
  })

  const overallScore =
    wordScores.length > 0
      ? Math.round(wordScores.reduce((sum, w) => sum + w.score, 0) / wordScores.length)
      : Math.round(confidence * 100)

  const feedback: string[] = []

  if (overallScore >= 90) {
    feedback.push('Excellent clarity! Your pronunciation is very clear.')
  } else if (overallScore >= 75) {
    feedback.push('Good pronunciation overall. Focus on any flagged words.')
  } else if (overallScore >= 60) {
    feedback.push('Understandable, but some words need practice. Slow down slightly.')
  } else {
    feedback.push('Speech was hard to recognize. Try speaking slower and enunciating each word.')
  }

  const weakWords = wordScores.filter((w) => w.score < 70)
  if (weakWords.length > 0) {
    feedback.push(`Practice these words: ${weakWords.map((w) => w.word).join(', ')}`)
  }

  return { overallScore, wordScores, feedback }
}

export function computeFluencyScore(
  avgWordsPerTurn: number,
  avgPauseRatio: number,
  turnCount: number,
): number {
  if (turnCount === 0) return 0

  const lengthScore = Math.min(100, avgWordsPerTurn * 15)
  const pauseScore = Math.max(0, 100 - avgPauseRatio * 200)
  const engagementScore = Math.min(100, turnCount * 8)

  return Math.round(lengthScore * 0.35 + pauseScore * 0.35 + engagementScore * 0.3)
}
