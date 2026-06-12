'use client'
import React, { useState, useEffect } from 'react'
import type { Prediction } from '@/lib/types'

const STORAGE_KEY = 'p26_admin_pw'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [inputPw, setInputPw] = useState('')
  const [error, setError] = useState('')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [resultMatchId, setResultMatchId] = useState('')
  const [resultWinner, setResultWinner] = useState('')
  const [resultLabel, setResultLabel] = useState('')
  const [resultMsg, setResultMsg] = useState('')

  // Restore session
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) setPassword(saved)
    } catch {}
  }, [])

  useEffect(() => {
    if (password) fetchPredictions(password)
  }, [password])

  async function fetchPredictions(pw: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/predictions', {
        headers: { 'x-admin-password': pw },
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Unauthorized'); setPassword(''); return }
      setPredictions(data.predictions ?? [])
    } catch {
      setError('Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  async function login() {
    setError('')
    const res = await fetch('/api/predictions', {
      headers: { 'x-admin-password': inputPw },
    })
    const data = await res.json()
    if (!res.ok) { setError('Wrong password'); return }
    try { sessionStorage.setItem(STORAGE_KEY, inputPw) } catch {}
    setPassword(inputPw)
    setPredictions(data.predictions ?? [])
  }

  async function postOfficialResult() {
    setResultMsg('')
    if (!resultMatchId || !resultWinner) return
    const res = await fetch('/api/official-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ match_id: resultMatchId, winner: resultWinner, match_label: resultLabel }),
    })
    const data = await res.json()
    setResultMsg(res.ok ? `✓ Saved: ${resultMatchId} → ${resultWinner}` : `Error: ${data.error}`)
    if (res.ok) { setResultMatchId(''); setResultWinner(''); setResultLabel('') }
  }

  function exportCSV() {
    const headers = ['Name', 'Champion', 'Finalist', 'Bronze', 'Approach', 'Submitted']
    const rows = predictions.map(p => [
      p.user_name, p.champion ?? '', p.finalist ?? '', p.bronze ?? '',
      p.approach ?? '', p.submitted_at,
    ])
    const csv = [headers, ...rows]
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `predict26_predictions_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  if (!password) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#efe8d9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Roboto Condensed', sans-serif",
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&family=Roboto+Condensed:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <div
          style={{
            background: '#fff',
            border: '1px solid #e2d6bd',
            borderRadius: 18,
            padding: '40px 36px',
            width: '100%',
            maxWidth: 380,
            boxShadow: '0 14px 40px rgba(0,0,0,.08)',
          }}
        >
          <div
            style={{
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: 700,
              fontSize: 26,
              marginBottom: 4,
              color: '#1b1d24',
            }}
          >
            PREDICT <span style={{ color: '#c0892b' }}>26</span> Admin
          </div>
          <div style={{ fontSize: 14, color: '#8a8170', marginBottom: 24 }}>
            Dashboard — enter admin password to continue.
          </div>
          <input
            type="password"
            value={inputPw}
            onChange={e => setInputPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Password"
            style={{
              width: '100%',
              border: '1px solid #e2d6bd',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 15,
              fontFamily: 'inherit',
              outline: 'none',
              background: '#faf7f2',
              color: '#1b1d24',
            }}
          />
          {error && (
            <div style={{ color: '#e0533d', fontSize: 13, marginTop: 8 }}>{error}</div>
          )}
          <button
            onClick={login}
            style={{
              marginTop: 14,
              width: '100%',
              background: '#c0892b',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '11px',
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            Log in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#efe8d9',
        fontFamily: "'Roboto Condensed', sans-serif",
        color: '#1b1d24',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&family=Roboto+Condensed:wght@400;500;700&display=swap"
        rel="stylesheet"
      />

      {/* Nav */}
      <div
        style={{
          background: '#1b1d24',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontFamily: "'Ubuntu', sans-serif",
            fontWeight: 700,
            fontSize: 20,
            color: '#fff',
          }}
        >
          PREDICT <span style={{ color: '#c0892b' }}>26</span>{' '}
          <span style={{ fontSize: 13, color: '#8a8170', marginLeft: 8 }}>Admin</span>
        </div>
        <button
          onClick={() => { setPassword(''); try { sessionStorage.removeItem(STORAGE_KEY) } catch {} }}
          style={{
            background: 'transparent',
            border: '1px solid #3a3c45',
            color: '#8a8170',
            borderRadius: 8,
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          Log out
        </button>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 22px 60px' }}>
        {/* Post official result */}
        <div
          style={{
            background: '#fff',
            border: '1px solid #e2d6bd',
            borderRadius: 14,
            padding: '20px 22px',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontFamily: "'Ubuntu', sans-serif",
              fontWeight: 700,
              fontSize: 17,
              marginBottom: 12,
              color: '#1b1d24',
            }}
          >
            Post official match result
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 12, color: '#8a8170', marginBottom: 4 }}>
                Match ID (e.g. A-0, R32-3)
              </div>
              <input
                value={resultMatchId}
                onChange={e => setResultMatchId(e.target.value)}
                placeholder="A-0"
                style={inputStyle}
              />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#8a8170', marginBottom: 4 }}>Winner team name</div>
              <input
                value={resultWinner}
                onChange={e => setResultWinner(e.target.value)}
                placeholder="Mexico"
                style={inputStyle}
              />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#8a8170', marginBottom: 4 }}>Label (optional)</div>
              <input
                value={resultLabel}
                onChange={e => setResultLabel(e.target.value)}
                placeholder="Group A matchday 1"
                style={{ ...inputStyle, width: 200 }}
              />
            </div>
            <button
              onClick={postOfficialResult}
              style={{
                background: '#c0892b',
                color: '#fff',
                border: 'none',
                borderRadius: 9,
                padding: '9px 16px',
                cursor: 'pointer',
                fontFamily: "'Ubuntu', sans-serif",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Save result
            </button>
          </div>
          {resultMsg && (
            <div
              style={{
                marginTop: 10,
                fontSize: 13,
                color: resultMsg.startsWith('✓') ? '#1f8a60' : '#e0533d',
              }}
            >
              {resultMsg}
            </div>
          )}
        </div>

        {/* Stats + export */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 15, color: '#6a6256' }}>
            <b style={{ color: '#1b1d24', fontFamily: "'Ubuntu', sans-serif", fontSize: 22 }}>
              {predictions.length}
            </b>{' '}
            predictions total
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => fetchPredictions(password)}
              style={{
                background: '#fff',
                border: '1px solid #e2d6bd',
                borderRadius: 9,
                padding: '8px 14px',
                cursor: 'pointer',
                fontSize: 13,
                color: '#6a6256',
              }}
            >
              ↺ Refresh
            </button>
            <button
              onClick={exportCSV}
              style={{
                background: '#1b1d24',
                color: '#fff',
                border: 'none',
                borderRadius: 9,
                padding: '8px 16px',
                cursor: 'pointer',
                fontFamily: "'Ubuntu', sans-serif",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#8a8170' }}>Loading…</div>
        ) : predictions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#8a8170' }}>
            No predictions yet.
          </div>
        ) : (
          <div
            style={{
              background: '#fff',
              border: '1px solid #e2d6bd',
              borderRadius: 14,
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f6f1e6', borderBottom: '1px solid #e2d6bd' }}>
                  {['Name', 'Champion', 'Finalist', 'Bronze', 'Approach', 'Submitted', ''].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: '10px 14px',
                        textAlign: 'left',
                        fontFamily: "'Roboto Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: '.08em',
                        color: '#b08a3a',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {predictions.map((p, i) => (
                  <React.Fragment key={p.id}>
                    <tr
                      style={{
                        borderBottom: '1px solid #f0eade',
                        background: i % 2 === 0 ? '#fff' : '#faf7f2',
                      }}
                    >
                      <td style={tdStyle}>{p.user_name}</td>
                      <td style={{ ...tdStyle, fontFamily: "'Ubuntu', sans-serif", fontWeight: 700 }}>
                        {p.champion ?? '—'}
                      </td>
                      <td style={tdStyle}>{p.finalist ?? '—'}</td>
                      <td style={tdStyle}>{p.bronze ?? '—'}</td>
                      <td style={tdStyle}>{p.approach ?? '—'}</td>
                      <td style={tdStyle}>
                        {new Date(p.submitted_at).toLocaleString('en-GB', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                          style={{
                            fontSize: 12,
                            color: '#b08a3a',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 700,
                          }}
                        >
                          {expandedId === p.id ? '▲ Hide' : '▼ Expand'}
                        </button>
                      </td>
                    </tr>
                    {expandedId === p.id && (
                      <tr style={{ borderBottom: '1px solid #e2d6bd', background: '#f9f5ec' }}>
                        <td colSpan={7} style={{ padding: '12px 16px' }}>
                          <GroupTop3Table top3={p.group_top3 ?? {}} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function GroupTop3Table({ top3 }: { top3: Record<string, string[]> }) {
  const gkeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
  return (
    <div>
      <div
        style={{
          fontFamily: "'Roboto Condensed', sans-serif",
          fontSize: 11,
          letterSpacing: '.1em',
          color: '#b08a3a',
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        GROUP TOP 3
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 8,
        }}
      >
        {gkeys.map(g => {
          const t = top3[g] ?? []
          return (
            <div
              key={g}
              style={{
                background: '#fff',
                border: '1px solid #e6dcc6',
                borderRadius: 8,
                padding: '8px 10px',
                fontSize: 13,
              }}
            >
              <div
                style={{
                  fontFamily: "'Ubuntu', sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  color: '#b08a3a',
                  marginBottom: 4,
                }}
              >
                Group {g}
              </div>
              {t.map((team, i) => (
                <div key={team} style={{ color: i === 0 ? '#1b1d24' : '#6a6256', lineHeight: 1.6 }}>
                  {i + 1}. {team}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  border: '1px solid #e2d6bd',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 14,
  fontFamily: "'Roboto Condensed', sans-serif",
  outline: 'none',
  background: '#faf7f2',
  color: '#1b1d24',
  width: 130,
}

const tdStyle: React.CSSProperties = {
  padding: '10px 14px',
  color: '#1b1d24',
  whiteSpace: 'nowrap',
}
