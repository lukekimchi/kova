import { DAYS, SESSION_TYPES, getPaletteColors } from '../types'

function weekStartDate(startDate, weekId) {
  if (!startDate) return null
  const d = new Date(startDate + 'T00:00:00')
  d.setDate(d.getDate() + (weekId - 1) * 7)
  return d
}

function weekAvg(startDate, weekId, weights) {
  if (!startDate || !weights) return null
  const vals = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate + 'T00:00:00')
    d.setDate(d.getDate() + (weekId - 1) * 7 + i)
    const key = d.toISOString().slice(0, 10)
    if (weights[key] != null) vals.push(weights[key])
  }
  return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null
}

const fmtWC  = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const fmtMon = d => d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

export default function WeekList({ plan, onWeekClick }) {
  const { weeks, activeWeek, startDate, palette, weightTracking, weights } = plan

  if (!weeks.length) {
    return <div className="empty-state"><p>Set both dates to calculate weeks</p></div>
  }

  const items = []
  let lastMonth = null
  weeks.forEach(week => {
    const ws = weekStartDate(startDate, week.id)
    const month = ws ? ws.getMonth() * 100 + ws.getFullYear() : null
    if (ws && month !== lastMonth) {
      items.push({ type: 'month', label: fmtMon(ws) })
      lastMonth = month
    }
    items.push({ type: 'week', week, ws })
  })

  return (
    <div className={`cal${weightTracking ? ' cal--weight' : ''}`}>
      <div className="cal-head">
        <div className="cal-head-spacer" />
        {DAYS.map(d => (
          <div key={d} className="cal-head-day">{d.slice(0, 2).toUpperCase()}</div>
        ))}
        {weightTracking && <div className="cal-head-day cal-head-avg">KG</div>}
      </div>

      {items.map((item, idx) => {
        if (item.type === 'month') {
          return <div key={`m-${idx}`} className="cal-month-label">{item.label}</div>
        }

        const { week, ws } = item
        const byDay = DAYS.map((_, i) => week.sessions.filter(s => s.day === i))
        const allDone = week.sessions.length > 0 && week.sessions.every(s => s.completed)

        const avg     = weightTracking ? weekAvg(startDate, week.id, weights) : null
        const prevAvg = weightTracking && week.id > 1 ? weekAvg(startDate, week.id - 1, weights) : null
        const trend   = avg != null && prevAvg != null
          ? (avg < prevAvg ? 'down' : avg > prevAvg ? 'up' : null)
          : null

        return (
          <button
            key={week.id}
            className={`cal-week${week.id === activeWeek ? ' cal-week--active' : ''}`}
            onClick={() => onWeekClick(week.id)}
          >
            <div className="cal-week-label">
              <span className="cal-week-num">W{week.id}</span>
              {ws && <span className="cal-week-date">{fmtWC(ws)}</span>}
              {allDone && <span className="cal-done-badge">✓</span>}
            </div>

            {byDay.map((sessions, i) => {
              const primary  = sessions[0]
              const isDouble = sessions.length > 1

              if (!primary) {
                return <span key={i} className="cal-cell cal-cell--empty" />
              }

              const c      = getPaletteColors(palette ?? 'frost', primary.type, plan.customPalette)
              const isDone = sessions.every(s => s.completed)

              return (
                <span
                  key={i}
                  className={`cal-cell${isDone ? ' cal-cell--done' : ''}`}
                  style={{ background: c.bold, color: c.text }}
                >
                  <span className="cal-cell-type">
                    {SESSION_TYPES[primary.type]?.label[0] ?? '?'}
                  </span>
                  {isDouble && <span className="cal-cell-double" />}
                </span>
              )
            })}

            {weightTracking && (
              <span className={`cal-avg${trend ? ` cal-avg--${trend}` : ''}`}>
                {avg != null ? avg.toFixed(1) : '—'}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
