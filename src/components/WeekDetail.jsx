import { useState } from 'react'
import EditModal from './EditModal'
import AddDoubleModal from './AddDoubleModal'
import { DAYS, SESSION_TYPES, getPaletteColors } from '../types'

export default function WeekDetail({ plan, totalWeeks, onSave }) {
  const [editing, setEditing] = useState(null) // { session, canRemove }
  const [addingDouble, setAddingDouble] = useState(false)
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

  function removeSession(session) {
    onSave({
      weeks: weeks.map((w, i) => i !== activeWeek - 1 ? w : {
        ...w,
        sessions: w.sessions.filter(s => s.id !== session.id),
      }),
    })
  }

  function addDouble(day, type) {
    const maxId = week.sessions.reduce((m, s) => Math.max(m, s.id), 0)
    onSave({
      weeks: weeks.map((w, i) => i !== activeWeek - 1 ? w : {
        ...w,
        sessions: [...w.sessions, { id: maxId + 1, day, type, note: '', completed: false }],
      }),
    })
  }

  if (!week) {
    return <div className="empty-state"><p>Set both dates to calculate weeks</p></div>
  }

  const dayMap = DAYS.map((_, i) => week.sessions.filter(s => s.day === i))
  const allDone = week.sessions.every(s => s.completed)
  const paletteId = plan.palette ?? 'frost'

  const weekStart = plan.startDate
    ? (() => { const d = new Date(plan.startDate + 'T00:00:00'); d.setDate(d.getDate() + (activeWeek - 1) * 7); return d })()
    : null
  const weekEnd = weekStart ? new Date(weekStart.getTime() + 6 * 86400000) : null
  const fmt = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

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
          {weekStart && <span className="week-dates">{fmt(weekStart)} – {fmt(weekEnd)}</span>}
          {allDone && <span className="done-badge">Done</span>}
        </div>
        <button className="icon-btn" onClick={nextWeek} disabled={activeWeek === totalWeeks}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="week-grid">
        {DAYS.map((dayLabel, i) => {
          const sessions = dayMap[i]
          if (sessions.length === 0) return null

          const isDone = sessions.every(s => s.completed)

          if (sessions.length === 1) {
            const session = sessions[0]
            const t = SESSION_TYPES[session.type] ?? SESSION_TYPES.rest
            const c = getPaletteColors(paletteId, session.type, plan.customPalette)
            return (
              <div
                key={i}
                className={`wcard${isDone ? ' wcard--done' : ''}`}
                style={{ background: c.bold, color: c.text }}
              >
                <div className="wcard-top">
                  <span className="wcard-day">{dayLabel.toUpperCase()}</span>
                  <button
                    className="wcard-check"
                    onClick={() => toggleSession(session)}
                    aria-label={session.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {session.completed ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span className="wcard-circle" />
                    )}
                  </button>
                </div>
                <button
                  className="wcard-main"
                  onClick={() => setEditing({ session, canRemove: false })}
                >
                  <span className="wcard-type">{t.label}</span>
                  {session.note && <span className="wcard-note">{session.note}</span>}
                </button>
              </div>
            )
          }

          // Double day
          return (
            <div key={i} className={`wcard wcard--double${isDone ? ' wcard--done' : ''}`}>
              <div className="wcard-day-header">
                <span className="wcard-day">{dayLabel.toUpperCase()}</span>
              </div>
              {sessions.map((session, si) => {
                const t = SESSION_TYPES[session.type] ?? SESSION_TYPES.rest
                const c = getPaletteColors(paletteId, session.type, plan.customPalette)
                return (
                  <div
                    key={session.id}
                    className={`wcard-half${session.completed ? ' wcard-half--done' : ''}`}
                    style={{ background: c.bold, color: c.text }}
                  >
                    <button
                      className="wcard-main"
                      onClick={() => setEditing({ session, canRemove: si > 0 })}
                    >
                      <span className="wcard-type">{t.label}</span>
                    </button>
                    <button
                      className="wcard-check"
                      onClick={() => toggleSession(session)}
                      aria-label={session.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {session.completed ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span className="wcard-circle" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          )
        })}

        <button className="wcard wcard--add" onClick={() => setAddingDouble(true)}>
          <span className="wcard-plus">+</span>
          <span className="wcard-add-label">Add double</span>
        </button>
      </div>

      {editing && (
        <EditModal
          session={editing.session}
          canRemove={editing.canRemove}
          onSave={s => { saveEdit(s); setEditing(null) }}
          onRemove={() => { removeSession(editing.session); setEditing(null) }}
          onClose={() => setEditing(null)}
        />
      )}

      {addingDouble && (
        <AddDoubleModal
          onSave={(day, type) => { addDouble(day, type); setAddingDouble(false) }}
          onClose={() => setAddingDouble(false)}
        />
      )}
    </div>
  )
}
