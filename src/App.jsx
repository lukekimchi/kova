import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { usePlan } from './hooks/usePlan'
import AuthScreen from './components/AuthScreen'
import WeekDetail from './components/WeekDetail'
import WeekList from './components/WeekList'
import SettingsModal from './components/SettingsModal'
import './App.css'

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()
  const { plan, save, loaded } = usePlan(user?.id)
  const [tab, setTab] = useState('week')
  const [showSettings, setShowSettings] = useState(false)

  if (authLoading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  if (!user) {
    return <AuthScreen onSignIn={signIn} onSignUp={signUp} />
  }

  if (!loaded) {
    return <div className="loading"><div className="spinner" /></div>
  }

  function goToWeek(weekId) {
    save({ activeWeek: weekId })
    setTab('week')
  }

  return (
    <div className={`app${plan.isDark ? ' dark' : ''}`}>
      <header className="header">
        <div className="header-logo">
          <img src="/favicon.svg" alt="" width={22} height={22} />
          <span>kova</span>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => setShowSettings(true)} aria-label="Settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx={12} cy={12} r={3} />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          <button className="icon-btn" onClick={signOut} aria-label="Log out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1={21} y1={12} x2={9} y2={12} />
            </svg>
          </button>
        </div>
      </header>

      <nav className="tabs">
        <button className={`tab${tab === 'week' ? ' active' : ''}`} onClick={() => setTab('week')}>
          This week
        </button>
        <button className={`tab${tab === 'plan' ? ' active' : ''}`} onClick={() => setTab('plan')}>
          Full plan
        </button>
      </nav>

      <main className="main">
        {tab === 'week'
          ? <WeekDetail plan={plan} totalWeeks={plan.weeks.length} onSave={save} />
          : <WeekList plan={plan} onWeekClick={goToWeek} />
        }
      </main>

      {showSettings && (
        <SettingsModal plan={plan} onSave={save} onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}
