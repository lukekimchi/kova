import { DAYS } from '../types'

function getWeekDays(startDate, weekId) {
  return DAYS.map((_, i) => {
    if (!startDate) return { dateStr: null, label: '' }
    const d = new Date(startDate + 'T00:00:00')
    d.setDate(d.getDate() + (weekId - 1) * 7 + i)
    return {
      dateStr: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    }
  })
}

export default function WeightView({ plan, totalWeeks, onSave }) {
  const { activeWeek, startDate, weights = {} } = plan
  const days = getWeekDays(startDate, activeWeek)

  function prevWeek() { if (activeWeek > 1) onSave({ activeWeek: activeWeek - 1 }) }
  function nextWeek() { if (activeWeek < totalWeeks) onSave({ activeWeek: activeWeek + 1 }) }

  function saveWeight(dateStr, raw) {
    const next = { ...(plan.weights ?? {}) }
    const trimmed = raw.trim()
    if (!trimmed) {
      delete next[dateStr]
    } else {
      const n = parseFloat(trimmed)
      if (!isNaN(n) && n > 0) next[dateStr] = n
    }
    onSave({ weights: next })
  }

  const fmt = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const weekStart = days[0]?.dateStr ? new Date(days[0].dateStr + 'T00:00:00') : null
  const weekEnd   = days[6]?.dateStr ? new Date(days[6].dateStr + 'T00:00:00') : null

  return (
    <div className="weight-view">
      <div className="week-nav">
        <button className="icon-btn" onClick={prevWeek} disabled={activeWeek === 1}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="week-label">
          <span className="week-title">Week {activeWeek} of {totalWeeks}</span>
          {weekStart && <span className="week-dates">{fmt(weekStart)} – {fmt(weekEnd)}</span>}
        </div>
        <button className="icon-btn" onClick={nextWeek} disabled={activeWeek === totalWeeks}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="weight-list">
        {DAYS.map((day, i) => {
          const { dateStr, label } = days[i]
          const current = dateStr ? (weights[dateStr] ?? '') : ''

          return (
            <div key={dateStr ?? i} className="weight-row">
              <span className="weight-day">{day.toUpperCase()}</span>
              {label && <span className="weight-date">{label}</span>}
              <div className="weight-input-wrap">
                <input
                  key={dateStr}
                  type="number"
                  inputMode="decimal"
                  className="weight-input"
                  defaultValue={current}
                  placeholder="—"
                  step="0.1"
                  onBlur={e => dateStr && saveWeight(dateStr, e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
                />
                <span className="weight-unit">kg</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
