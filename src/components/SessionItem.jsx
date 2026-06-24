import { DAYS, SESSION_TYPES } from '../types'

export default function SessionItem({ session, onToggle, onEdit }) {
  const { label, color } = SESSION_TYPES[session.type] ?? SESSION_TYPES.rest

  return (
    <div
      className={`session-item${session.completed ? ' completed' : ''}`}
      style={{ '--session-accent': color }}
    >
      <button className="session-main" onClick={() => onEdit(session)}>
        <span className="session-day">{DAYS[session.day]}</span>
        <span className="session-info">
          <span className="session-type">{label}</span>
          {session.note && <span className="session-note">{session.note}</span>}
        </span>
      </button>
      <button
        className={`check-btn${session.completed ? ' checked' : ''}`}
        onClick={() => onToggle(session)}
        aria-label={session.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {session.completed ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <span className="check-circle" />
        )}
      </button>
    </div>
  )
}
