'use client'
import React from 'react'
import Flag from './Flag'
import { GKEYS, ROUND_N } from '@/lib/data'
import { teamsOf, finalistFrom, bronze, results } from '@/lib/bracketEngine'
import type { AppState } from '@/lib/types'

interface ResultsScreenProps {
  state: AppState
  effectiveBracket: Record<string, string>
  officialResults: Record<string, string>
  copied: boolean
  onShare: () => void
  onEditBracket: () => void
  onRestart: () => void
}

export default function ResultsScreen({
  state,
  effectiveBracket,
  officialResults,
  copied,
  onShare,
  onEditBracket,
  onRestart,
}: ResultsScreenProps) {
  const champ = effectiveBracket['F-0'] ?? null
  const fin = champ ? finalistFrom(effectiveBracket, state, officialResults) : null
  const bz = bronze(effectiveBracket)
  const name = state.name || 'Friend'

  const res = buildResults(state, officialResults)

  const road = buildRoad(champ, effectiveBracket, state, officialResults)

  return (
    <div
      className="p26-anim-up"
      style={{ maxWidth: 920, margin: '0 auto', padding: '34px 22px 100px' }}
    >
      {/* Shared view banner */}
      {state.shared && (
        <div
          style={{
            background: '#fff',
            border: '1px solid #e2d6bd',
            borderRadius: 12,
            padding: '12px 18px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ fontSize: 15, color: '#6a6256' }}>
            You&apos;re viewing <b style={{ color: '#1b1d24' }}>{name}&apos;s</b> bracket
            prediction.
          </div>
          <button
            onClick={onRestart}
            style={{
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              background: '#c0892b',
              color: '#fff',
              borderRadius: 9,
              padding: '8px 16px',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            Make your own →
          </button>
        </div>
      )}

      {champ ? (
        <>
          {/* Champion hero */}
          <div
            style={{
              background: '#1b1d24',
              borderRadius: 22,
              padding: '40px 30px',
              textAlign: 'center',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 50% 0%, rgba(192,137,43,.35), transparent 60%)',
              }}
            />
            <div style={{ position: 'relative' }}>
              <div className="p26-anim-pop-slow" style={{ fontSize: 56 }}>
                🏆
              </div>
              <div
                style={{
                  fontFamily: "'Roboto Condensed', sans-serif",
                  fontSize: 12,
                  letterSpacing: '.28em',
                  color: '#e8c25f',
                  marginTop: 8,
                }}
              >
                YOUR PREDICTED CHAMPION
              </div>
              <div style={{ fontSize: 54, marginTop: 10 }}>
                <Flag name={champ} height="1.6em" />
              </div>
              <div
                style={{
                  fontFamily: "'Ubuntu', sans-serif",
                  fontWeight: 700,
                  fontSize: 44,
                  marginTop: 4,
                  lineHeight: 1,
                }}
              >
                {champ}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: '#cfc7b6',
                  marginTop: 18,
                  maxWidth: 560,
                  margin: '18px auto 0',
                  lineHeight: 1.5,
                }}
              >
                {fin
                  ? `Congrats ${name}, you predicted ${champ} will beat ${fin} in the final!`
                  : `Congrats ${name}, ${champ} are your champions!`}
              </div>
              {fin && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 14,
                    background: 'rgba(255,255,255,.07)',
                    border: '1px solid rgba(255,255,255,.14)',
                    borderRadius: 14,
                    padding: '12px 20px',
                    marginTop: 22,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Ubuntu', sans-serif",
                      fontWeight: 700,
                      fontSize: 17,
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Flag name={champ} height="1em" /> {champ}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: '#e8c25f',
                      fontFamily: "'Roboto Condensed', sans-serif",
                      letterSpacing: '.1em',
                    }}
                  >
                    DEF.
                  </span>
                  <span
                    style={{
                      fontFamily: "'Ubuntu', sans-serif",
                      fontWeight: 500,
                      fontSize: 17,
                      color: '#cfc7b6',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Flag name={fin} height="1em" /> {fin}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Share */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e6dcc6',
              borderRadius: 16,
              padding: '20px 22px',
              marginTop: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Ubuntu', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#1b1d24',
                }}
              >
                Share your bracket
              </div>
              <div style={{ fontSize: 14, color: '#8a8170', marginTop: 3 }}>
                Copy a link that opens your exact predictions for friends to see.
              </div>
            </div>
            <button
              onClick={onShare}
              style={{
                fontFamily: "'Ubuntu', sans-serif",
                fontWeight: 500,
                fontSize: 15,
                padding: '11px 20px',
                borderRadius: 11,
                cursor: 'pointer',
                background: copied ? '#1f8a60' : '#c0892b',
                color: '#fff',
                whiteSpace: 'nowrap',
                border: 'none',
              }}
            >
              {copied ? '✓ Link copied!' : '🔗 Copy share link'}
            </button>
          </div>

          {/* Podium */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e6dcc6',
              borderRadius: 16,
              padding: '26px 22px 22px',
              marginTop: 18,
            }}
          >
            <div
              style={{
                fontFamily: "'Ubuntu', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 20,
                textAlign: 'center',
                color: '#1b1d24',
              }}
            >
              Final standings
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: 14,
              }}
            >
              {/* Silver - 2nd */}
              <PodiumBlock
                flag={fin}
                name={fin ?? '—'}
                pos={2}
                height={72}
                numColor="#8a8170"
                blockBg="#ecebe6"
                blockBorder="#ddd8cc"
                fontSize={22}
                nameFontSize={15}
              />
              {/* Gold - 1st */}
              <PodiumBlock
                flag={champ}
                name={champ}
                pos={1}
                height={106}
                numColor="#b0801f"
                blockBg="#f6e3b8"
                blockBorder="#e2c987"
                fontSize={28}
                nameFontSize={17}
                crown
              />
              {/* Bronze - 3rd */}
              <PodiumBlock
                flag={bz}
                name={bz ?? 'TBD'}
                pos={3}
                height={54}
                numColor="#a9733c"
                blockBg="#eddcc6"
                blockBorder="#ddc7a6"
                fontSize={20}
                nameFontSize={15}
              />
            </div>
            {!bz && (
              <div
                style={{ textAlign: 'center', fontSize: 13, color: '#a3946c', marginTop: 16 }}
              >
                Pick the third-place playoff back on the bracket to crown your bronze medalist.
              </div>
            )}
          </div>

          {/* Champion's road */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e6dcc6',
              borderRadius: 16,
              padding: 22,
              marginTop: 18,
            }}
          >
            <div
              style={{
                fontFamily: "'Ubuntu', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 14,
                color: '#1b1d24',
              }}
            >
              {champ}&apos;s road to glory
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {road.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    background: '#f9f5ec',
                    border: '1px solid #efe6d2',
                    borderRadius: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Roboto Condensed', sans-serif",
                      fontSize: 11,
                      letterSpacing: '.1em',
                      color: '#b08a3a',
                      fontWeight: 700,
                      width: 110,
                      flex: '0 0 auto',
                    }}
                  >
                    {r.round}
                  </span>
                  <span style={{ fontSize: 14, color: '#8a8170' }}>beat</span>
                  <Flag name={r.opp} height="1em" />
                  <span
                    style={{
                      fontFamily: "'Ubuntu', sans-serif",
                      fontWeight: 500,
                      fontSize: 15,
                      color: '#1b1d24',
                    }}
                  >
                    {r.opp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Group winners */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e6dcc6',
              borderRadius: 16,
              padding: 22,
              marginTop: 18,
            }}
          >
            <div
              style={{
                fontFamily: "'Ubuntu', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 14,
                color: '#1b1d24',
              }}
            >
              Your 12 group winners
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: 10,
              }}
            >
              {GKEYS.map(g => {
                const winner = res[g]?.[0] ?? null
                return (
                  <div
                    key={g}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      padding: '9px 11px',
                      background: '#f9f5ec',
                      border: '1px solid #efe6d2',
                      borderRadius: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: '#c0892b',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: '0 0 auto',
                      }}
                    >
                      {g}
                    </span>
                    {winner && <Flag name={winner} height="1em" />}
                    <span
                      style={{
                        fontFamily: "'Ubuntu', sans-serif",
                        fontWeight: 500,
                        fontSize: 14,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: '#1b1d24',
                      }}
                    >
                      {winner ?? '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer actions */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              marginTop: 24,
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={onEditBracket}
              style={{
                fontFamily: "'Ubuntu', sans-serif",
                fontWeight: 500,
                fontSize: 15,
                background: '#fff',
                border: '1px solid #e2d6bd',
                borderRadius: 11,
                padding: '11px 22px',
                cursor: 'pointer',
                color: '#6a6256',
              }}
            >
              ← Edit bracket
            </button>
            <button
              onClick={onRestart}
              style={{
                fontFamily: "'Ubuntu', sans-serif",
                fontWeight: 500,
                fontSize: 15,
                background: '#1b1d24',
                color: '#fff',
                borderRadius: 11,
                padding: '11px 22px',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Start a new prediction
            </button>
          </div>
        </>
      ) : (
        /* No champion yet */
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48 }}>🏟️</div>
          <div
            style={{
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: 700,
              fontSize: 24,
              marginTop: 14,
              color: '#1b1d24',
            }}
          >
            No champion yet
          </div>
          <div style={{ fontSize: 15, color: '#6a6256', marginTop: 8 }}>
            Finish the bracket to crown your winner.
          </div>
          <button
            onClick={onEditBracket}
            style={{
              display: 'inline-block',
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: 500,
              fontSize: 15,
              background: '#c0892b',
              color: '#fff',
              borderRadius: 11,
              padding: '11px 22px',
              cursor: 'pointer',
              marginTop: 20,
              border: 'none',
            }}
          >
            Go to bracket →
          </button>
        </div>
      )}
    </div>
  )
}

function PodiumBlock({
  flag,
  name,
  pos,
  height,
  numColor,
  blockBg,
  blockBorder,
  fontSize,
  nameFontSize,
  crown,
}: {
  flag: string | null
  name: string
  pos: number
  height: number
  numColor: string
  blockBg: string
  blockBorder: string
  fontSize: number
  nameFontSize: number
  crown?: boolean
}) {
  return (
    <div style={{ flex: 1, maxWidth: pos === 1 ? 182 : 170, textAlign: 'center' }}>
      {crown && <div style={{ fontSize: 22, lineHeight: 1 }}>👑</div>}
      <div style={{ fontSize: pos === 1 ? 34 : 30, lineHeight: 1, marginTop: crown ? 4 : 0 }}>
        {flag ? <Flag name={flag} height={pos === 1 ? '1.8em' : '1.6em'} /> : <span style={{ opacity: 0.4 }}>🥉</span>}
      </div>
      <div
        style={{
          fontFamily: "'Ubuntu', sans-serif",
          fontWeight: 700,
          fontSize: nameFontSize,
          marginTop: 6,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: '#1b1d24',
        }}
      >
        {name}
      </div>
      <div
        style={{
          background: blockBg,
          border: `1px solid ${blockBorder}`,
          borderBottom: 'none',
          borderRadius: '10px 10px 0 0',
          height,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: pos === 1 ? 10 : pos === 2 ? 8 : 6,
          marginTop: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'Ubuntu', sans-serif",
            fontWeight: 700,
            fontSize,
            color: numColor,
          }}
        >
          {pos}
        </span>
      </div>
    </div>
  )
}

function buildResults(
  state: AppState,
  officialResults: Record<string, string>
): Record<string, string[]> {
  return results(state, officialResults)
}

const ROUND_LABELS: Record<string, string> = {
  R32: 'Round of 32',
  R16: 'Round of 16',
  QF: 'Quarterfinal',
  SF: 'Semifinal',
  F: 'Final',
}

function buildRoad(
  champ: string | null,
  effectiveBracket: Record<string, string>,
  state: AppState,
  officialResults: Record<string, string>
): { round: string; opp: string }[] {
  if (!champ) return []
  const road: { round: string; opp: string }[] = []
  ;['R32', 'R16', 'QF', 'SF', 'F'].forEach(key => {
    for (let k = 0; k < ROUND_N[key]; k++) {
      const id = `${key}-${k}`
      if (effectiveBracket[id] === champ) {
        const t = teamsOf(id, effectiveBracket, state, officialResults)
        const opp = t.find(x => x && x !== champ)
        if (opp) road.push({ round: ROUND_LABELS[key], opp })
      }
    }
  })
  return road
}
