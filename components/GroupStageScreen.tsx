'use client'
import React from 'react'
import Flag from './Flag'
import { GROUPS, PAIRS, GKEYS, TEAM } from '@/lib/data'
import { groupStandings, rank, better } from '@/lib/bracketEngine'
import type { AppState } from '@/lib/types'

interface GroupStageScreenProps {
  state: Pick<AppState, 'approach' | 'matchPicks' | 'ranks'>
  officialResults: Record<string, string>
  allDone: boolean
  onPickMatch: (g: string, i: number, team: string) => void
  onToggleRank: (g: string, team: string) => void
  onFillGroup: (g: string) => void
  onFillAll: () => void
  onContinue: () => void
}

export default function GroupStageScreen({
  state,
  officialResults,
  allDone,
  onPickMatch,
  onToggleRank,
  onFillGroup,
  onFillAll,
  onContinue,
}: GroupStageScreenProps) {
  const isMatch = state.approach === 'match'

  const title = isMatch ? 'Pick your match winners' : 'Set your group tables'
  const sub = isMatch
    ? 'Tap the winner of every match — tables and qualifiers update live.'
    : 'Tap teams 1st → 4th in each group. Top 2 advance automatically.'

  return (
    <div
      className="p26-anim-up-fast"
      style={{ maxWidth: 1300, margin: '0 auto', padding: '30px 22px 90px' }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Roboto Condensed', sans-serif",
              fontSize: 12,
              letterSpacing: '.2em',
              color: '#b08a3a',
              fontWeight: 700,
            }}
          >
            STEP 2 · GROUP STAGE
          </div>
          <div
            style={{
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: 700,
              fontSize: 32,
              marginTop: 6,
              color: '#1b1d24',
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 15, color: '#6a6256', marginTop: 4 }}>{sub}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onFillAll}
            style={{
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: '#6a6256',
              background: '#fff',
              border: '1px solid #e2d6bd',
              borderRadius: 10,
              padding: '9px 16px',
              cursor: 'pointer',
            }}
          >
            ⚡ Fill all by ranking
          </button>
          <button
            onClick={onContinue}
            disabled={!allDone}
            style={{
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              padding: '9px 18px',
              borderRadius: 10,
              cursor: allDone ? 'pointer' : 'not-allowed',
              background: allDone ? '#c0892b' : '#e6dcc6',
              color: allDone ? '#fff' : '#b3a98f',
              border: 'none',
            }}
          >
            {allDone ? 'Continue' : 'Finish all groups'} →
          </button>
        </div>
      </div>

      {/* Group cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
          gap: 16,
          marginTop: 24,
        }}
      >
        {GKEYS.map(g => (
          <GroupCard
            key={g}
            g={g}
            state={state}
            officialResults={officialResults}
            isMatch={isMatch}
            onPickMatch={onPickMatch}
            onToggleRank={onToggleRank}
            onFillGroup={onFillGroup}
          />
        ))}
      </div>
    </div>
  )
}

function GroupCard({
  g,
  state,
  officialResults,
  isMatch,
  onPickMatch,
  onToggleRank,
  onFillGroup,
}: {
  g: string
  state: Pick<AppState, 'approach' | 'matchPicks' | 'ranks'>
  officialResults: Record<string, string>
  isMatch: boolean
  onPickMatch: (g: string, i: number, team: string) => void
  onToggleRank: (g: string, team: string) => void
  onFillGroup: (g: string) => void
}) {
  const st = groupStandings(g, state, officialResults)
  const done = st.complete

  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${done ? '#dcc89a' : '#e6dcc6'}`,
        borderRadius: 14,
        padding: 16,
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <div
          style={{
            fontFamily: "'Ubuntu', sans-serif",
            fontWeight: 700,
            fontSize: 17,
            whiteSpace: 'nowrap',
            color: '#1b1d24',
          }}
        >
          Group {g}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
          <span
            style={{
              fontFamily: "'Roboto Condensed', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '.06em',
              padding: '3px 8px',
              borderRadius: 12,
              background: done ? '#e7f4ee' : '#f2ece0',
              color: done ? '#1f8a60' : '#a3946c',
            }}
          >
            {done ? '✓ Done' : 'In progress'}
          </span>
          <button
            onClick={() => onFillGroup(g)}
            title="Auto-pick this group"
            style={{
              fontSize: 13,
              color: '#b08a3a',
              cursor: 'pointer',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              padding: 0,
            }}
          >
            ⚡
          </button>
        </div>
      </div>

      {isMatch ? (
        <MatchMode
          g={g}
          state={state}
          officialResults={officialResults}
          standings={st}
          onPickMatch={onPickMatch}
        />
      ) : (
        <StandingsMode g={g} state={state} onToggleRank={onToggleRank} />
      )}
    </div>
  )
}

function MatchMode({
  g,
  state,
  officialResults,
  standings,
  onPickMatch,
}: {
  g: string
  state: Pick<AppState, 'matchPicks'>
  officialResults: Record<string, string>
  standings: { order: string[] }
  onPickMatch: (g: string, i: number, team: string) => void
}) {
  const teams = GROUPS[g]

  return (
    <div>
      {PAIRS.map((p, i) => {
        const a = teams[p[0]]
        const b = teams[p[1]]
        const matchId = `${g}-${i}`
        const isLocked = !!officialResults[matchId]
        const w = officialResults[matchId] ?? state.matchPicks[matchId]

        const teamBtn = (team: string) => ({
          picked: w === team,
          dim: !!w && w !== team,
        })

        return (
          <div
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}
          >
            <TeamBtn
              team={a}
              picked={teamBtn(a).picked}
              dim={teamBtn(a).dim}
              locked={isLocked}
              onClick={() => !isLocked && onPickMatch(g, i, a)}
            />
            <span
              style={{
                fontSize: 10,
                color: '#b3a98f',
                fontWeight: 700,
                flex: '0 0 auto',
              }}
            >
              v
            </span>
            <TeamBtn
              team={b}
              picked={teamBtn(b).picked}
              dim={teamBtn(b).dim}
              locked={isLocked}
              onClick={() => !isLocked && onPickMatch(g, i, b)}
            />
          </div>
        )
      })}

      {/* THROUGH strip */}
      <div
        style={{
          marginTop: 12,
          paddingTop: 10,
          borderTop: '1px dashed #e4dac3',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          color: '#8a8170',
        }}
      >
        <span
          style={{
            fontFamily: "'Roboto Condensed', sans-serif",
            letterSpacing: '.08em',
            fontWeight: 700,
            color: '#b08a3a',
          }}
        >
          THROUGH
        </span>
        {standings.order.slice(0, 3).map((t, idx) => (
          <span
            key={t}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              color: idx < 2 ? '#1b1d24' : '#9a9082',
              opacity: idx < 2 ? 1 : 0.8,
            }}
          >
            <Flag name={t} height="0.9em" />
            <span>{TEAM[t]?.[1] ?? t}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function TeamBtn({
  team,
  picked,
  dim,
  locked,
  onClick,
}: {
  team: string
  picked: boolean
  dim: boolean
  locked: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="p26-row-hover"
      style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 9px',
        borderRadius: 7,
        cursor: locked ? 'default' : 'pointer',
        fontFamily: "'Ubuntu', sans-serif",
        fontWeight: 500,
        fontSize: 13,
        background: picked ? '#c0892b' : '#f6f1e6',
        color: picked ? '#fff' : '#2a2c33',
        border: `1px solid ${picked ? '#c0892b' : '#ece2cf'}`,
        opacity: dim ? 0.5 : 1,
        outline: locked && picked ? '2px solid #a9741d' : 'none',
      }}
    >
      <Flag name={team} height="0.9em" />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {team}
      </span>
      {locked && picked && (
        <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.7 }}>🔒</span>
      )}
    </div>
  )
}

function StandingsMode({
  g,
  state,
  onToggleRank,
}: {
  g: string
  state: Pick<AppState, 'ranks'>
  onToggleRank: (g: string, team: string) => void
}) {
  const teams = GROUPS[g]
  const ranked = state.ranks[g] || []

  return (
    <div>
      <div style={{ fontSize: 12, color: '#a39a86', margin: '2px 0 4px' }}>
        Tap teams in order: 1st → 4th
      </div>
      {teams.map(t => {
        const pi = ranked.indexOf(t)
        const pos = pi >= 0 ? pi + 1 : ranked.length >= 3 ? 4 : 0

        const bgMap: Record<number, string> = {
          1: '#fbf1d8', 2: '#f1ece1', 3: '#e9f0fb', 4: '#f6f1e6', 0: '#f6f1e6',
        }
        const badgeBg: Record<number, string> = {
          1: '#c0892b', 2: '#8a8170', 3: '#2f6df0', 4: '#c9c1b0', 0: '#c9c1b0',
        }
        const tagColor: Record<number, string> = {
          1: '#c0892b', 2: '#1f9e6e', 3: '#2f6df0', 4: '#b3a98f', 0: '#b3a98f',
        }
        const tagLabel: Record<number, string> = {
          1: 'WINNER', 2: 'ADV', 3: '3rd', 4: 'OUT', 0: '',
        }

        return (
          <div
            key={t}
            onClick={() => onToggleRank(g, t)}
            className="p26-row-hover"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '9px 11px',
              borderRadius: 9,
              cursor: 'pointer',
              marginTop: 7,
              background: bgMap[pos] ?? '#f6f1e6',
              border: `1px solid ${pos > 0 ? '#e2d4b4' : '#ece2cf'}`,
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
                background: badgeBg[pos] ?? '#c9c1b0',
                flex: '0 0 auto',
              }}
            >
              {pos > 0 ? pos : '—'}
            </span>
            <Flag name={t} height="1em" />
            <span style={{ fontSize: 15, color: '#1b1d24' }}>{t}</span>
            <span
              style={{
                marginLeft: 'auto',
                fontFamily: "'Roboto Condensed', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '.08em',
                color: tagColor[pos] ?? '#b3a98f',
              }}
            >
              {tagLabel[pos] ?? ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}
