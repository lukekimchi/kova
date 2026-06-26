import { useState } from 'react'
import { DAYS, SESSION_TYPES } from '../types'

export default function AddDoubleModal({ onSave, onClose }) {
  const [day, setDay] = useState(null)
  const [type, setType] = useState(null)

  function handleSave() {
    if (day === null || !type) return
    onSave(day, type)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Add double</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} />
            </svg>
          </button>
        </div>

        <div>
          <p className="modal-section-label">Day</p>
          <div className="day-grid">
            {DAYS.map((d, i) => (
              <button
                key={i}
                className={`day-btn${day === i ? ' selected' : ''}`}
                onClick={() => setDay(i)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="modal-section-label">Type</p>
          <div className="type-grid">
            {Object.entries(SESSION_TYPES).filter(([k]) => k !== 'rest').map(([key, { label, color, bg }]) => (
              <button
                key={key}
                className={`type-btn${type === key ? ' selected' : ''}`}
                style={type === key ? { background: bg, color, borderColor: color } : {}}
                onClick={() => setType(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={day === null || !type}
          style={day === null || !type ? { opacity: 0.4 } : {}}
        >
          Add session
        </button>
      </div>
    </div>
  )
}
