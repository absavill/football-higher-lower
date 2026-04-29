import { createClient } from '@supabase/supabase-js'

// These get filled in from your .env file (see README)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

// ── Leaderboard helpers ───────────────────────────────────────────────────────

export async function loadLeaderboard() {
  if (!supabase) return {}
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('mode_key, player_name, score')
      .order('score', { ascending: false })

    if (error) throw error

    // Group into { modeKey: [{name, score}, ...top10] }
    const lb = {}
    for (const row of data) {
      if (!lb[row.mode_key]) lb[row.mode_key] = []
      if (lb[row.mode_key].length < 10) {
        lb[row.mode_key].push({ name: row.player_name, score: row.score })
      }
    }
    return lb
  } catch (e) {
    console.error('loadLeaderboard error:', e)
    return {}
  }
}

export async function saveScore(modeKey, name, score) {
  if (!supabase) return null
  try {
    const { error } = await supabase
      .from('scores')
      .insert({ mode_key: modeKey, player_name: name.trim().slice(0, 16).toUpperCase(), score })

    if (error) throw error
    return await loadLeaderboard()
  } catch (e) {
    console.error('saveScore error:', e)
    return null
  }
}
