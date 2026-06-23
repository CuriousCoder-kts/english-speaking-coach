import type { Scene } from '../types'
import { SCENES } from '../data/scenes'

interface SceneSelectorProps {
  onSelect: (scene: Scene) => void
}

export function SceneSelector({ onSelect }: SceneSelectorProps) {
  return (
    <div className="scene-selector">
      <header className="hero">
        <p className="eyebrow">AI English Speaking Coach</p>
        <h1>
          Practice real conversations,
          <em> not textbook drills</em>
        </h1>
        <p className="subtitle">
          Choose a scenario, speak naturally, and get instant feedback on pronunciation,
          grammar, and expression.
        </p>
      </header>

      <div className="scene-grid">
        {SCENES.map((scene) => (
          <button
            key={scene.id}
            className="scene-card"
            onClick={() => onSelect(scene)}
            type="button"
          >
            <span className="scene-icon">{scene.icon}</span>
            <div className="scene-info">
              <h3>{scene.title}</h3>
              <span className="scene-zh">{scene.titleZh}</span>
              <p>{scene.description}</p>
            </div>
            <span className={`difficulty ${scene.difficulty}`}>{scene.difficulty}</span>
          </button>
        ))}
      </div>

      <footer className="browser-note">
        Best experience in Chrome or Edge with microphone enabled. Optional: set{' '}
        <code>VITE_OPENAI_API_KEY</code> for smarter AI responses.
      </footer>
    </div>
  )
}
