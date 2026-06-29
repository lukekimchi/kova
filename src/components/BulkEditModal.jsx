import { useState } from 'react'
import { SESSION_TYPES, DAYS } from '../types'

function getCurrentDayTypes(weeks) {
  if (!weeks.length) return {}
  const result = {}
  for (const session of weeks[0].sessions) {
    result[session.day] = session.type
  }
  return result
}

function getExistingSetup(weeks) {
  const setup = {}
  for (const week of weeks) {
    for (const session of week.sessions) {
      if (!(session.type in setup)) {
        setup[session.type] = session.note ?? ''
      }
    }
  }
  return setup
}

export default function BulkEditModal({ plan, onSave, onClose }) {
  const [dayTypes, setDayTypes] = useState(() => getCurrentDayTypes(plan.weeks))
  const [setup,    setSetup]    = useState(() => getExistingSetup(plan.weeks))

  function handleSave() {
    onSave({
      weeks: plan.weeks.map(week => ({
        ...week,
        sessions: week.sessions.map(session => {
          const newType = dayTypes[session.day] ?? session.type
          return {
            ...session,
            type: newType,
            note: setup[newType] ?? session.note,
          }
        }),
      })),
    })
    onClose()
  }

  const typesInUse = [...new Set(Object.values(dayTypes))].filter(t => t in SESSION_TYPES)

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Bulk edit</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} />
            </svg>
          </button>
        </div>

        {/* ---- Schedule ---- */}
        <p className="modal-section-label">Schedule</p>
        <div className="bulk-schedule">
          {DAYS.map((day, i) => (
            <div key={i} className="bulk-day-row">
              <span className="bulk-day-label">{day.toUpperCase()}_</span>
              <div className="bulk-select-wrap">
                <select
                  className="bulk-day-select"
                  value={dayTypes[i] ?? 'rest'}
                  onChange={e => setDayTypes(prev => ({ ...prev, [i]: e.target.value }))}
                >
                  {Object.entries(SESSION_TYPES).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* ---- Setup ---- */}
        <p className="modal-section-label">Setup</p>
        {typesInUse.map(type => (
          <div key={type} className="bulk-row">
            <span className="bulk-type">{SESSION_TYPES[type].label}.</span>
            <textarea
              className="note-input bulk-note"
              rows={2}
              placeholder="Setup…"
              value={setup[type] ?? ''}
              onChange={e => setSetup(prev => ({ ...prev, [type]: e.target.value }))}
            />
          </div>
        ))}

        <button className="btn btn-primary" onClick={handleSave}>Apply to all weeks</button>
      </div>
    </div>
  )
}
