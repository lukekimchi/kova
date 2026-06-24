import { useState } from 'react'

function weeksBetween(start, end) {
  if (!start || !end) return null
  const n = Math.floor((new Date(end) - new Date(start)) / 604800000)
  return n > 0 ? n : null
}

export default function SettingsModal({ plan, onSave, onClose }) {
  const [marathonDate, setMarathonDate] = useState(plan.marathonDate ?? '')
  const [startDate,    setStartDate]    = useState(plan.startDate    ?? '')
  const [isDark,       setIsDark]       = useState(plan.isDark)

  const trainingWeeks = weeksBetween(startDate, marathonDate)

  function handleSave() {
    onSave({ marathonDate: marathonDate || null, startDate: startDate || null, isDark })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} />
            </svg>
          </button>
        </div>

        <div className="setting-row">
          <label className="setting-label">Race date</label>
          <input type="date" className="date-input" value={marathonDate} onChange={e => setMarathonDate(e.target.value)} />
        </div>

        <div className="setting-row">
          <label className="setting-label">Training starts</label>
          <input type="date" className="date-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>

        {trainingWeeks !== null ? (
          <p className="hint">Training weeks: <strong>{trainingWeeks}</strong></p>
        ) : (marathonDate || startDate) ? (
          <p className="hint">Set both dates to calculate weeks</p>
        ) : null}

        <div className="setting-row">
          <label className="setting-label">Dark mode</label>
          <button className={`toggle${isDark ? ' on' : ''}`} onClick={() => setIsDark(!isDark)} aria-label="Toggle dark mode" />
        </div>

        <button className="btn btn-primary" onClick={handleSave}>Save</button>
      </div>
    </div>
  )
}
