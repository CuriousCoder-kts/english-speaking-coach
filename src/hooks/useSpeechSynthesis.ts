import { useCallback, useEffect, useRef, useState } from 'react'

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported] = useState(() => 'speechSynthesis' in window)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback(
    (text: string, options?: { rate?: number; onEnd?: () => void }) => {
      if (!isSupported) {
        options?.onEnd?.()
        return
      }

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = options?.rate ?? 0.95
      utterance.pitch = 1

      const voices = window.speechSynthesis.getVoices()
      const enVoice =
        voices.find((v) => v.lang.startsWith('en') && v.name.includes('Natural')) ??
        voices.find((v) => v.lang.startsWith('en-US')) ??
        voices.find((v) => v.lang.startsWith('en'))
      if (enVoice) utterance.voice = enVoice

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
        options?.onEnd?.()
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        options?.onEnd?.()
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [isSupported],
  )

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  useEffect(() => {
    const loadVoices = () => window.speechSynthesis.getVoices()
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => {
      stop()
    }
  }, [stop])

  return { isSupported, isSpeaking, speak, stop }
}
