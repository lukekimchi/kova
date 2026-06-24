import { useState } from 'react'
import SessionItem from './SessionItem'
import EditModal from './EditModal'

export default function WeekDetail({ plan, totalWeeks, onSave }) {
  const [editing, setEditing] = useState(null)
  const { activeWeek, weeks } = plan
  const week = weeks[activeWeek - 1]

  function prevWeek() { if (activeWeek > 1) onSave({ activeWeek: activeWeek - 1 }) }
  function nextWeek() { if (activeWeek < totalWeeks) onSave({ activeWeek: activeWeek + 1 }) }

  function toggleSession(session) {
    onSave({
      weeks: weeks.map((w, i) => i !== activeWeek - 1 ? w : {
        ...w,
        sessions: w.sessions.map(s => s.id === session.id ? { ...s, completed: !s.completed } : s),
      }),
    })
  }

  function saveEdit(updated) {
    onSave({
      weeks: weeks.map((w, i) => i !== activeWeek - 1 ? w : {
        ...w,
        sessions: w.sessions.map(s => s.id === updated.id ? updated : s),
      }),
    })
  }

  function markAll() {
    const allDone = week.sessions.every(s => s.completed)
    onSave({
      weeks: weeks.map((w, i) => i !== activeWeek - 1 ? w : {
        ...w,
        sessions: w.sessions.map(s => ({ ...s, completed: !allDone })),
      }),
    })
  }

  if (!week) {
    return <div className="empty-state"><p>Set both dates to calculate weeks</p></div>
  }

  const allDone = week.sessions.every(s => s.completed)

  return (
    <div className="week-detail">
      <div className="week-nav">
        <button className="icon-btn" onClick={prevWeek} disabled={activeWeek === 1}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="week-label">
          <span className="week-title">Week {activeWeek} of {totalWeeks}</span>
          {allDone && <span className="done-badge">Week done</span>}
        </div>
        <button className="icon-btn" onClick={nextWeek} disabled={activeWeek === totalWeeks}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <button className="mark-all-btn" onClick={markAll}>
        {allDone ? 'Unmarked' : 'Mark all'}
      </button>

      <div className="session-list">
        {week.sessions.map(session => (
          <SessionItem
            key={session.id}
            session={session}
            onToggle={toggleSession}
            onEdit={setEditing}
          />
        ))}
      </div>

      {editing && (
        <EditModal session={editing} onSave={saveEdit} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}
