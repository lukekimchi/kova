import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const DEFAULT_PATTERNS = [
  ['easy', 'strength', 'tempo',     'easy', 'rest', 'long', 'rest'],
  ['easy', 'gym',      'intervals', 'easy', 'rest', 'long', 'rest'],
]

function weeksBetween(start, end) {
  if (!start || !end) return 0
  return Math.max(0, Math.floor((new Date(end) - new Date(start)) / 604800000))
}

function makeWeek(idx) {
  return {
    id: idx + 1,
    sessions: Array.from({ length: 7 }, (_, d) => ({
      id: idx * 7 + d + 1,
      day: d,
      type: DEFAULT_PATTERNS[idx % 2][d],
      note: '',
      completed: false,
    })),
  }
}

function resizeWeeks(weeks, n) {
  if (n <= 0) return []
  if (n > weeks.length)
    return [...weeks, ...Array.from({ length: n - weeks.length }, (_, i) => makeWeek(weeks.length + i))]
  return weeks.slice(0, n)
}

const EMPTY = { marathonDate: null, startDate: null, activeWeek: 1, isDark: false, weeks: [] }

export function usePlan() {
  const [plan, setPlan] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const planRef = useRef(null)

  useEffect(() => { planRef.current = plan }, [plan])

  useEffect(() => {
    supabase
      .from('plan')
      .select('*')
      .eq('id', 'default')
      .maybeSingle()
      .then(({ data }) => {
        const p = data
          ? {
              marathonDate: data.marathon_date ?? null,
              startDate:    data.start_date    ?? null,
              activeWeek:   data.active_week   ?? 1,
              isDark:       data.is_dark       ?? false,
              weeks:        data.weeks         ?? [],
            }
          : { ...EMPTY }
        setPlan(p)
        planRef.current = p
        setLoaded(true)
      })
  }, [])

  const save = useCallback((updates) => {
    const prev = planRef.current
    const next = { ...prev, ...updates }

    if ('marathonDate' in updates || 'startDate' in updates) {
      const n = weeksBetween(next.startDate, next.marathonDate)
      next.weeks = resizeWeeks(next.weeks, n)
      if (next.activeWeek > Math.max(1, n)) next.activeWeek = Math.max(1, n)
    }

    setPlan(next)
    planRef.current = next

    supabase.from('plan').upsert({
      id: 'default',
      marathon_date: next.marathonDate,
      start_date:    next.startDate,
      active_week:   next.activeWeek,
      is_dark:       next.isDark,
      weeks:         next.weeks,
      updated_at:    new Date().toISOString(),
    })
  }, [])

  return { plan, save, loaded }
}
