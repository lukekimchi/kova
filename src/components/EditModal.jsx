import { useState } from 'react'
import { SESSION_TYPES } from '../types'

export default function EditModal({ session, canRemove, onSave, onRemove, onClose }) {
  const [type, setType] = useState(session.type)
  const [note, setNote] = useState(session.note)

  function handleSave() {
    onSave({ ...session, type, note })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Edit session</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} />
            </svg>
          </button>
        </div>
        <div className="type-grid">
          {Object.entries(SESSION_TYPES).map(([key, { label }]) => (
            <button
              key={key}
              className={`type-btn${type === key ? ' selected' : ''}`}
              onClick={() => setType(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <textarea
          className="note-input"
          placeholder="Setup (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
        />
        <button className="btn btn-primary" onClick={handleSave}>Save</button>
        {canRemove && (
          <button className="btn btn-danger" onClick={onRemove}>Remove session</button>
        )}
      </div>
    </div>
  )
}
