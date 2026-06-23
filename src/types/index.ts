export type SceneId = 'interview' | 'restaurant' | 'meeting' | 'travel' | 'smalltalk'

export interface Scene {
  id: SceneId
  title: string
  titleZh: string
  description: string
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  aiPersona: string
  openingLine: string
  goals: string[]
  vocabulary: string[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  text: string
  timestamp: number
  corrections?: Correction[]
  pronunciationScore?: number
}

export interface Correction {
  type: 'grammar' | 'expression' | 'pronunciation'
  original: string
  suggestion: string
  explanation: string
}

export interface PronunciationResult {
  overallScore: number
  wordScores: WordScore[]
  feedback: string[]
}

export interface WordScore {
  word: string
  score: number
  issue?: string
}

export interface SessionMetrics {
  durationSeconds: number
  turnCount: number
  avgPronunciationScore: number
  grammarAccuracy: number
  fluencyScore: number
  vocabularyUsed: string[]
  correctionsCount: number
  strengths: string[]
  improvements: string[]
}

export interface SessionState {
  scene: Scene | null
  messages: Message[]
  metrics: SessionMetrics
  status: 'idle' | 'selecting' | 'active' | 'summary'
  isListening: boolean
  isSpeaking: boolean
}

export interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}
