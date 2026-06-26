import { useState } from 'react'
import { PALETTES, SESSION_TYPES, CUSTOM_DEFAULTS } from '../types'

function weeksBetween(start, end) {
  if (!start || !end) return null
  const n = Math.floor((new Date(end) - new Date(start)) / 604800000)
  return n > 0 ? n : null
}

const SWATCH_TYPES = ['easy', 'tempo', 'intervals', 'long', 'strength', 'gym']

export default function SettingsModal({ plan, onSave, onClose }) {
  const [marathonDate,    setMarathonDate]    = useState(plan.marathonDate ?? '')
  const [startDate,       setStartDate]       = useState(plan.startDate ?? '')
  const [isDark,          setIsDark]          = useState(plan.isDark)
  const [palette,         setPalette]         = useState(plan.palette ?? 'frost')
  const [customPalette,   setCustomPalette]   = useState(
    Object.keys(plan.customPalette ?? {}).length ? plan.customPalette : { ...CUSTOM_DEFAULTS }
  )
  const [weightTracking,  setWeightTracking]  = useState(plan.weightTracking ?? false)

  const trainingWeeks = weeksBetween(startDate, marathonDate)

  function handleSave() {
    onSave({ marathonDate: marathonDate || null, startDate: startDate || null, isDark, palette, customPalette, weightTracking })
    onClose()
  }

  function setColor(type, hex) {
    setCustomPalette(prev => ({ ...prev, [type]: hex }))
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

        <div className="setting-row">
          <label className="setting-label">Weight tracking</label>
          <button className={`toggle${weightTracking ? ' on' : ''}`} onClick={() => setWeightTracking(!weightTracking)} aria-label="Toggle weight tracking" />
        </div>

        <div>
          <p className="modal-section-label">Colour palette</p>
          <div className="palette-list">
            {Object.entries(PALETTES).map(([id, pal]) => (
              <button
                key={id}
                className={`palette-option${palette === id ? ' selected' : ''}`}
                onClick={() => setPalette(id)}
              >
                <span className="palette-name">{pal.name}</span>
                <span className="palette-swatches">
                  {SWATCH_TYPES.map(type => (
                    <span key={type} className="palette-swatch" style={{ background: pal.types[type].bold }} />
                  ))}
                </span>
              </button>
            ))}

            {/* Custom option */}
            <button
              className={`palette-option${palette === 'custom' ? ' selected' : ''}`}
              onClick={() => setPalette('custom')}
            >
              <span className="palette-name">Custom</span>
              <span className="palette-swatches">
                {SWATCH_TYPES.map(type => (
                  <span key={type} className="palette-swatch" style={{ background: customPalette[type] ?? CUSTOM_DEFAULTS[type] }} />
                ))}
              </span>
            </button>
          </div>

          {palette === 'custom' && (
            <div className="custom-palette-editor">
              {Object.entries(SESSION_TYPES).map(([type, { label }]) => (
                <div key={type} className="custom-color-row">
                  <span
                    className="custom-color-preview"
                    style={{ background: customPalette[type] ?? CUSTOM_DEFAULTS[type] }}
                  />
                  <span className="custom-color-label">{label}</span>
                  <input
                    type="color"
                    className="color-input"
                    value={customPalette[type] ?? CUSTOM_DEFAULTS[type]}
                    onChange={e => setColor(type, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn btn-primary" onClick={handleSave}>Save</button>
      </div>
    </div>
  )
}
