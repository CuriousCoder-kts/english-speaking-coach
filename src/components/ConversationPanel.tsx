import type { Message, Scene } from '../types'

interface ConversationPanelProps {
  scene: Scene
  messages: Message[]
  interimTranscript: string
  isListening: boolean
  isSpeaking: boolean
  isProcessing: boolean
}

export function ConversationPanel({
  scene,
  messages,
  interimTranscript,
  isListening,
  isSpeaking,
  isProcessing,
}: ConversationPanelProps) {
  return (
    <div className="conversation-panel">
      <div className="scene-header">
        <span className="scene-badge">{scene.icon} {scene.title}</span>
        <div className="status-indicators">
          {isListening && <span className="pulse-dot listening">Listening</span>}
          {isSpeaking && <span className="pulse-dot speaking">Coach speaking</span>}
          {isProcessing && <span className="pulse-dot processing">Thinking…</span>}
        </div>
      </div>

      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <div className="message-bubble">
              <p>{msg.text}</p>
              {msg.role === 'user' && msg.pronunciationScore !== undefined && (
                <div className="message-meta">
                  <span className={`score-badge ${scoreClass(msg.pronunciationScore)}`}>
                    Pronunciation {msg.pronunciationScore}%
                  </span>
                </div>
              )}
              {msg.corrections && msg.corrections.length > 0 && (
                <div className="inline-corrections">
                  {msg.corrections.map((c, i) => (
                    <div key={i} className={`correction-item ${c.type}`}>
                      <strong>{c.type === 'grammar' ? 'Grammar' : 'Expression'}</strong>
                      <span>
                        "{c.original}" → "{c.suggestion.split('/')[0].trim()}"
                      </span>
                      <small>{c.explanation}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {interimTranscript && (
          <div className="message user interim">
            <div className="message-bubble">
              <p>{interimTranscript}</p>
              <span className="interim-label">Speaking…</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function scoreClass(score: number): string {
  if (score >= 85) return 'good'
  if (score >= 65) return 'ok'
  return 'low'
}
