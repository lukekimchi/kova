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

const DEFAULT_NOTES = {
  easy:     '12km + 6x100 strides',
  rest:     'RECOVER',
  strength: 'GYM',
}

function makeWeek(idx) {
  return {
    id: idx + 1,
    sessions: Array.from({ length: 7 }, (_, d) => {
      const type = DEFAULT_PATTERNS[idx % 2][d]
      return {
        id: idx * 7 + d + 1,
        day: d,
        type,
        note: DEFAULT_NOTES[type] ?? '',
        completed: false,
      }
    }),
  }
}

function resizeWeeks(weeks, n) {
  if (n <= 0) return []
  if (n > weeks.length)
    return [...weeks, ...Array.from({ length: n - weeks.length }, (_, i) => makeWeek(weeks.length + i))]
  return weeks.slice(0, n)
}

const VALID_PALETTES = new Set(['frost', 'ocean', 'custom'])
function resolvePalette(p) { return VALID_PALETTES.has(p) ? p : 'frost' }

const EMPTY = { marathonDate: null, startDate: null, activeWeek: 1, isDark: false, palette: 'frost', customPalette: {}, weightTracking: false, weights: {}, weeks: [] }

export function usePlan(userId) {
  const [plan, setPlan]       = useState(null)
  const [loaded, setLoaded]   = useState(false)
  const planRef               = useRef(null)

  useEffect(() => { planRef.current = plan }, [plan])

  useEffect(() => {
    if (!userId) return

    supabase
      .from('plan')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error('usePlan load error:', error)
        const p = data
          ? {
              marathonDate: data.marathon_date ?? null,
              startDate:    data.start_date    ?? null,
              activeWeek:   data.active_week   ?? 1,
              isDark:       data.is_dark       ?? false,
              palette:         resolvePalette(data.palette),
              customPalette:   data.custom_palette   ?? {},
              weightTracking:  data.weight_tracking  ?? false,
              weights:         data.weights          ?? {},
              weeks:           data.weeks            ?? [],
            }
          : { ...EMPTY }
        setPlan(p)
        planRef.current = p
        setLoaded(true)
      })
  }, [userId])

  const save = useCallback((updates) => {
    if (!userId) return
    const prev = planRef.current
    const next = { ...prev, ...updates }

    if ('marathonDate' in updates || 'startDate' in updates) {
      const n = weeksBetween(next.startDate, next.marathonDate)
      next.weeks = resizeWeeks(next.weeks, n)
      if (next.activeWeek > Math.max(1, n)) next.activeWeek = Math.max(1, n)
    }

    setPlan(next)
    planRef.current = next

    supabase
      .from('plan')
      .upsert({
        user_id:       userId,
        marathon_date: next.marathonDate,
        start_date:    next.startDate,
        active_week:   next.activeWeek,
        is_dark:         next.isDark,
        palette:         next.palette,
        custom_palette:  next.customPalette,
        weight_tracking: next.weightTracking,
        weights:         next.weights,
        weeks:           next.weeks,
        updated_at:    new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) console.error('usePlan save error:', error)
      })
  }, [userId])

  return { plan, save, loaded }
}
