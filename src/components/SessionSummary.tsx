import type { Scene, SessionMetrics } from '../types'

interface SessionSummaryProps {
  scene: Scene
  metrics: SessionMetrics
  onRestart: () => void
  onNewScene: () => void
}

export function SessionSummary({ scene, metrics, onRestart, onNewScene }: SessionSummaryProps) {
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  return (
    <div className="session-summary">
      <header>
        <p className="eyebrow">Session Complete</p>
        <h2>
          {scene.icon} {scene.title}
        </h2>
        <p className="summary-meta">
          {formatDuration(metrics.durationSeconds)} · {metrics.turnCount} turns ·{' '}
          {metrics.correctionsCount} corrections
        </p>
      </header>

      <div className="summary-scores">
        <ScoreRing label="Pronunciation" score={metrics.avgPronunciationScore} />
        <ScoreRing label="Grammar" score={metrics.grammarAccuracy} />
        <ScoreRing label="Fluency" score={metrics.fluencyScore} />
      </div>

      <div className="summary-columns">
        <div className="summary-block strengths">
          <h3>Strengths</h3>
          <ul>
            {metrics.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="summary-block improvements">
          <h3>Areas to Improve</h3>
          <ul>
            {metrics.improvements.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      {metrics.vocabularyUsed.length > 0 && (
        <div className="vocab-used">
          <h3>Words You Used</h3>
          <div className="vocab-tags">
            {metrics.vocabularyUsed.slice(0, 12).map((w) => (
              <span key={w} className="vocab-tag">
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="summary-actions">
        <button className="primary-btn" onClick={onRestart} type="button">
          Practice Again
        </button>
        <button className="secondary-btn" onClick={onNewScene} type="button">
          Choose New Scene
        </button>
      </div>
    </div>
  )
}

function ScoreRing({ label, score }: { label: string; score: number }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#0d9488' : score >= 60 ? '#d97706' : '#dc2626'

  return (
    <div className="score-ring">
      <svg viewBox="0 0 100 100" width="100" height="100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="54" textAnchor="middle" className="ring-text">
          {score}
        </text>
      </svg>
      <span>{label}</span>
    </div>
  )
}
