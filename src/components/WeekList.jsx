import { SESSION_TYPES } from '../types'

export default function WeekList({ plan, onWeekClick }) {
  const { weeks, activeWeek } = plan

  if (!weeks.length) {
    return <div className="empty-state"><p>Set both dates to calculate weeks</p></div>
  }

  return (
    <div className="week-list">
      {weeks.map(week => {
        const done = week.sessions.filter(s => s.completed).length
        const allDone = done === week.sessions.length

        return (
          <button
            key={week.id}
            className={`week-row${week.id === activeWeek ? ' active' : ''}`}
            onClick={() => onWeekClick(week.id)}
          >
            <span className="week-row-label">W{week.id}</span>
            <div className="week-dots">
              {week.sessions.map((s, i) => (
                <span
                  key={i}
                  className="dot"
                  style={{
                    background: SESSION_TYPES[s.type]?.color ?? '#9ca3af',
                    opacity: s.completed ? 1 : 0.25,
                  }}
                />
              ))}
            </div>
            {allDone ? (
              <span className="week-status done">Done</span>
            ) : done > 0 ? (
              <span className="week-status partial">{done}/{week.sessions.length}</span>
            ) : (
              <span className="week-status" />
            )}
          </button>
        )
      })}
    </div>
  )
}
