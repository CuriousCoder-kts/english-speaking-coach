import { useCallback, useEffect, useRef } from 'react'
import { SceneSelector } from './components/SceneSelector'
import { ConversationPanel } from './components/ConversationPanel'
import { VoiceControls } from './components/VoiceControls'
import { MetricsPanel } from './components/MetricsPanel'
import { SessionSummary } from './components/SessionSummary'
import { useSession } from './hooks/useSession'
import { useSpeechRecognition } from './hooks/useSpeechRecognition'
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis'

export default function App() {
  const {
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
  } = useSession()

  const { isSupported, isListening, interimTranscript, startListening, stopListening } =
    useSpeechRecognition({
      onResult: async (result) => {
        if (!result.isFinal) return
        stopListening()
        const response = await handleUserSpeech(result.transcript, result.confidence)
        if (response) speak(response)
      },
    })

  const { isSpeaking, speak } = useSpeechSynthesis()
  const hasSpokenOpening = useRef(false)

  useEffect(() => {
    if (status === 'active' && messages.length === 1 && !hasSpokenOpening.current) {
      hasSpokenOpening.current = true
      speak(messages[0].text)
    }
    if (status !== 'active') {
      hasSpokenOpening.current = false
    }
  }, [status, messages, speak])

  const toggleListen = useCallback(() => {
    if (isListening) stopListening()
    else startListening()
  }, [isListening, startListening, stopListening])

  const liveMetrics = {
    turnCount: messages.filter((m) => m.role === 'user').length,
    avgPronunciationScore:
      messages.filter((m) => m.pronunciationScore !== undefined).length > 0
        ? Math.round(
            messages
              .filter((m) => m.pronunciationScore !== undefined)
              .reduce((sum, m) => sum + (m.pronunciationScore ?? 0), 0) /
              messages.filter((m) => m.pronunciationScore !== undefined).length,
          )
        : 0,
    grammarAccuracy: metrics.grammarAccuracy,
    fluencyScore: metrics.fluencyScore,
  }

  return (
    <div className="app">
      <nav className="top-nav">
        <div className="brand">
          <span className="brand-icon">🗣️</span>
          <span>SpeakFlow</span>
        </div>
        {status === 'active' && scene && (
          <button className="nav-link" onClick={endSession} type="button">
            Finish &amp; Review
          </button>
        )}
      </nav>

      <main>
        {status === 'selecting' && <SceneSelector onSelect={startSession} />}

        {status === 'active' && scene && (
          <div className="session-layout">
            <div className="session-main">
              <ConversationPanel
                scene={scene}
                messages={messages}
                interimTranscript={interimTranscript}
                isListening={isListening}
                isSpeaking={isSpeaking}
                isProcessing={isProcessing}
              />
              <VoiceControls
                isListening={isListening}
                isSpeaking={isSpeaking}
                isProcessing={isProcessing}
                speechSupported={isSupported}
                onToggleListen={toggleListen}
                onEndSession={endSession}
                liveCorrection={liveCorrection}
              />
            </div>
            <aside className="session-sidebar">
              <MetricsPanel metrics={liveMetrics} live />
              <div className="goals-panel">
                <h4>Session Goals</h4>
                <ul>
                  {scene.goals.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                <h4>Key Vocabulary</h4>
                <div className="vocab-tags">
                  {scene.vocabulary.map((v) => (
                    <span key={v} className="vocab-tag">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {status === 'summary' && scene && (
          <SessionSummary
            scene={scene}
            metrics={metrics}
            onRestart={() => startSession(scene)}
            onNewScene={reset}
          />
        )}
      </main>
    </div>
  )
}
