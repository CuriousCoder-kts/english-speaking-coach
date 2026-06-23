import type { SessionMetrics } from '../types'

interface MetricsPanelProps {
  metrics: Partial<SessionMetrics>
  live?: boolean
}

export function MetricsPanel({ metrics, live = false }: MetricsPanelProps) {
  const items = [
    {
      label: 'Pronunciation',
      value: metrics.avgPronunciationScore ?? 0,
      unit: '%',
      color: 'teal',
    },
    {
      label: 'Grammar',
      value: metrics.grammarAccuracy ?? 100,
      unit: '%',
      color: 'blue',
    },
    {
      label: 'Fluency',
      value: metrics.fluencyScore ?? 0,
      unit: '%',
      color: 'amber',
    },
    {
      label: 'Turns',
      value: metrics.turnCount ?? 0,
      unit: '',
      color: 'violet',
    },
  ]

  return (
    <div className={`metrics-panel ${live ? 'live' : ''}`}>
      <h4>{live ? 'Live Stats' : 'Session Metrics'}</h4>
      <div className="metrics-grid">
        {items.map((item) => (
          <div key={item.label} className={`metric-card ${item.color}`}>
            <span className="metric-label">{item.label}</span>
            <span className="metric-value">
              {item.value}
              {item.unit && <small>{item.unit}</small>}
            </span>
            {live && item.unit === '%' && (
              <div className="metric-bar">
                <div className="metric-fill" style={{ width: `${Math.min(100, item.value)}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
