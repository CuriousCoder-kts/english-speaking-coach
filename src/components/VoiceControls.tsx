import type { Correction } from '../types'

interface VoiceControlsProps {
  isListening: boolean
  isSpeaking: boolean
  isProcessing: boolean
  speechSupported: boolean
  onToggleListen: () => void
  onEndSession: () => void
  liveCorrection: Correction | null
}

export function VoiceControls({
  isListening,
  isSpeaking,
  isProcessing,
  speechSupported,
  onToggleListen,
  onEndSession,
  liveCorrection,
}: VoiceControlsProps) {
  return (
    <div className="voice-controls">
      {liveCorrection && (
        <div className={`correction-banner ${liveCorrection.type}`}>
          <span className="banner-label">
            {liveCorrection.type === 'grammar' ? 'Grammar tip' : 'Better expression'}
          </span>
          <p>
            <s>{liveCorrection.original}</s> → <strong>{liveCorrection.suggestion.split('/')[0].trim()}</strong>
          </p>
          <small>{liveCorrection.explanation}</small>
        </div>
      )}

      <div className="control-bar">
        {!speechSupported ? (
          <p className="error-text">Speech recognition is not supported in this browser. Try Chrome or Edge.</p>
        ) : (
          <>
            <button
              className={`mic-button ${isListening ? 'active' : ''}`}
              onClick={onToggleListen}
              disabled={isProcessing || isSpeaking}
              type="button"
              aria-label={isListening ? 'Stop listening' : 'Start speaking'}
            >
              <span className="mic-icon">{isListening ? '⏹' : '🎤'}</span>
              <span>{isListening ? 'Stop' : 'Hold to Speak'}</span>
              {isListening && (
                <span className="waveform">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="bar" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </span>
              )}
            </button>

            <button className="end-button" onClick={onEndSession} type="button">
              End Session
            </button>
          </>
        )}
      </div>

      <p className="hint">
        {isListening
          ? 'Speak naturally — corrections appear after each turn.'
          : isSpeaking
            ? 'Listen to the coach…'
            : 'Tap the microphone when ready to respond.'}
      </p>
    </div>
  )
}
