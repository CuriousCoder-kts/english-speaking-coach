import { useCallback, useEffect, useRef, useState } from 'react'
import type { SpeechRecognitionResult } from '../types'

interface UseSpeechRecognitionOptions {
  lang?: string
  continuous?: boolean
  onResult?: (result: SpeechRecognitionResult) => void
  onError?: (error: string) => void
}

type SpeechRecognitionInstance = {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const { lang = 'en-US', continuous = true, onResult, onError } = options
  const [isListening, setIsListening] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isSupported] = useState(() => getSpeechRecognition() !== null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const shouldRestart = useRef(false)

  const onResultRef = useRef(onResult)
  const onErrorRef = useRef(onError)
  onResultRef.current = onResult
  onErrorRef.current = onError

  useEffect(() => {
    const SpeechRecognitionClass = getSpeechRecognition()
    if (!SpeechRecognitionClass) return

    const recognition = new SpeechRecognitionClass()
    recognition.continuous = continuous
    recognition.interimResults = true
    recognition.lang = lang

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let finalText = ''
      let confidence = 0.8

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript
        confidence = result[0].confidence || 0.8

        if (result.isFinal) {
          finalText += text
        } else {
          interim += text
        }
      }

      setInterimTranscript(interim)

      if (finalText.trim()) {
        onResultRef.current?.({
          transcript: finalText.trim(),
          confidence,
          isFinal: true,
        })
        setInterimTranscript('')
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return
      onErrorRef.current?.(event.error)
      setIsListening(false)
      shouldRestart.current = false
    }

    recognition.onend = () => {
      if (shouldRestart.current) {
        try {
          recognition.start()
        } catch {
          setIsListening(false)
          shouldRestart.current = false
        }
      } else {
        setIsListening(false)
      }
    }

    recognitionRef.current = recognition

    return () => {
      shouldRestart.current = false
      recognition.abort()
    }
  }, [lang, continuous])

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition) return

    try {
      shouldRestart.current = true
      recognition.start()
      setIsListening(true)
    } catch {
      // already started
    }
  }, [])

  const stopListening = useCallback(() => {
    shouldRestart.current = false
    recognitionRef.current?.stop()
    setIsListening(false)
    setInterimTranscript('')
  }, [])

  return {
    isSupported,
    isListening,
    interimTranscript,
    startListening,
    stopListening,
  }
}
