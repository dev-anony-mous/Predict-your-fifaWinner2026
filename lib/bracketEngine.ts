import { GROUPS, TEAM, PAIRS, R32, THIRD_SLOTS, GKEYS } from './data'
import type { AppState } from './types'

type StateSlice = Pick<AppState, 'approach' | 'matchPicks' | 'ranks' | 'thirds'>

export function rank(name: string): number {
  return TEAM[name]?.[2] ?? 999
}

export function better(a: string, b: string): string {
  return rank(a) <= rank(b) ? a : b
}

export function groupStandings(
  g: string,
  state: Pick<AppState, 'approach' | 'matchPicks' | 'ranks'>,
  officialResults: Record<string, string> = {}
): { order: string[]; complete: boolean } {
  const teams = GROUPS[g]

  if (state.approach === 'match') {
    const wins: Record<string, number> = {}
    teams.forEach(t => (wins[t] = 0))
    let done = 0
    PAIRS.forEach((p, i) => {
      const w = officialResults[`${g}-${i}`] ?? state.matchPicks[`${g}-${i}`]
      if (w) { wins[w]++; done++ }
    })
    const order = [...teams].sort((a, b) => (wins[b] - wins[a]) || rank(a) - rank(b))
    return { order, complete: done === 6 }
  }

  // standings mode
  const r = state.ranks[g] || []
  const rest = teams.filter(t => !r.includes(t))
  return { order: [...r, ...rest], complete: r.length >= 3 }
}

export function allComplete(
  state: Pick<AppState, 'approach' | 'matchPicks' | 'ranks'>,
  officialResults: Record<string, string> = {}
): boolean {
  return GKEYS.every(g => groupStandings(g, state, officialResults).complete)
}

export function results(
  state: Pick<AppState, 'approach' | 'matchPicks' | 'ranks'>,
  officialResults: Record<string, string> = {}
): Record<string, string[]> {
  const o: Record<string, string[]> = {}
  GKEYS.forEach(g => (o[g] = groupStandings(g, state, officialResults).order))
  return o
}

export function thirdsList(
  state: Pick<AppState, 'approach' | 'matchPicks' | 'ranks'>,
  officialResults: Record<string, string> = {}
): Array<{ group: string; team: string }> {
  const res = results(state, officialResults)
  return GKEYS.map(g => ({ group: g, team: res[g][2] }))
}

export function suggested(
  state: Pick<AppState, 'approach' | 'matchPicks' | 'ranks'>,
  officialResults: Record<string, string> = {}
): string[] {
  return [...thirdsList(state, officialResults)]
    .sort((a, b) => rank(a.team) - rank(b.team))
    .slice(0, 8)
    .map(x => x.team)
}

export function assignThirds(state: StateSlice, officialResults: Record<string, string> = {}): Record<number, string | null> {
  const res = results(state, officialResults)
  const sel =
    state.thirds && state.thirds.length === 8
      ? state.thirds
      : suggested(state, officialResults)

  const items = sel.map(t => ({
    team: t,
    group: GKEYS.find(g => res[g][2] === t) || '',
  }))
  const slots = THIRD_SLOTS.map(s => ({ idx: s[0], avoid: s[1], team: null as string | null }))
  const used = new Array(items.length).fill(false)

  const bt = (si: number): boolean => {
    if (si === slots.length) return true
    for (let k = 0; k < items.length; k++) {
      if (used[k]) continue
      if (slots[si].avoid.includes(items[k].group)) continue
      used[k] = true
      slots[si].team = items[k].team
      if (bt(si + 1)) return true
      used[k] = false
      slots[si].team = null
    }
    return false
  }

  if (!bt(0)) {
    let k = 0
    slots.forEach(s => {
      while (used[k]) k++
      s.team = items[k]?.team ?? null
      if (items[k]) used[k] = true
    })
  }

  const m: Record<number, string | null> = {}
  slots.forEach(s => (m[s.idx] = s.team))
  return m
}

export function r32Teams(state: StateSlice, officialResults: Record<string, string> = {}): [string | null, string | null][] {
  const res = results(state, officialResults)
  const tm = assignThirds(state, officialResults)
  return R32.map((mt, i) =>
    mt.map(spec => {
      if (spec === 'T') return tm[i] ?? null
      const pos = spec[0] === '1' ? 0 : 1
      return res[spec[1]]?.[pos] ?? null
    }) as [string | null, string | null]
  )
}

export function teamsOf(
  id: string,
  bracket: Record<string, string>,
  state: StateSlice,
  officialResults: Record<string, string> = {}
): [string | null, string | null] {
  if (id.startsWith('R32-')) return r32Teams(state, officialResults)[+id.slice(4)]

  if (id.startsWith('TP-')) {
    const lose = (k: number): string | null => {
      const t = teamsOf(`SF-${k}`, bracket, state, officialResults)
      const w = bracket[`SF-${k}`]
      if (!w || !t[0] || !t[1]) return null
      return t.find(x => x && x !== w) ?? null
    }
    return [lose(0), lose(1)]
  }

  let fp: [string, string]
  if (id.startsWith('R16-')) {
    const k = +id.slice(4)
    fp = [`R32-${2 * k}`, `R32-${2 * k + 1}`]
  } else if (id.startsWith('QF-')) {
    const k = +id.slice(3)
    fp = [`R16-${2 * k}`, `R16-${2 * k + 1}`]
  } else if (id.startsWith('SF-')) {
    const k = +id.slice(3)
    fp = [`QF-${2 * k}`, `QF-${2 * k + 1}`]
  } else {
    fp = ['SF-0', 'SF-1']
  }
  return [bracket[fp[0]] ?? null, bracket[fp[1]] ?? null]
}

// Cleans user bracket picks that are now invalid due to changed upstream selections.
// officialPicks are never removed.
export function cleanUserPicks(
  userBracket: Record<string, string>,
  officialPicks: Record<string, string>,
  state: StateSlice,
  officialResults: Record<string, string> = {}
): Record<string, string> {
  const effectiveBracket = { ...userBracket, ...officialPicks }
  const cleaned = { ...userBracket }

  for (let p = 0; p < 6; p++) {
    Object.keys(cleaned).forEach(k => {
      if (officialPicks[k]) return
      const t = teamsOf(k, effectiveBracket, state, officialResults)
      if (!t || !t.includes(cleaned[k])) delete cleaned[k]
    })
  }
  return cleaned
}

// Legacy clean used when official results are already merged into bracket
export function clean(
  bracket: Record<string, string>,
  state: StateSlice,
  officialResults: Record<string, string> = {}
): Record<string, string> {
  const b = { ...bracket }
  for (let p = 0; p < 6; p++) {
    Object.keys(b).forEach(k => {
      const t = teamsOf(k, b, state, officialResults)
      if (!t || !t.includes(b[k])) delete b[k]
    })
  }
  return b
}

export function champion(bracket: Record<string, string>): string | null {
  return bracket['F-0'] ?? null
}

export function finalist(bracket: Record<string, string>): string | null {
  const c = champion(bracket)
  if (!c) return null
  // we need teams of F-0 — caller must pass effective bracket
  return null
}

export function finalistFrom(
  bracket: Record<string, string>,
  state: StateSlice,
  officialResults: Record<string, string> = {}
): string | null {
  const c = bracket['F-0']
  if (!c) return null
  const t = teamsOf('F-0', bracket, state, officialResults)
  return t.find(x => x && x !== c) ?? null
}

export function bronze(bracket: Record<string, string>): string | null {
  return bracket['TP-0'] ?? null
}
