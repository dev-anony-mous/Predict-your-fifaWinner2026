'use client'
import React from 'react'
import type { Screen, AppState } from '@/lib/types'

interface Step {
  n: number
  label: string
  key: Screen
  active: boolean
  accessible: boolean
  onClick: () => void
}

interface TopNavProps {
  screen: Screen
  name: string
  steps: Step[]
  onRestart: () => void
}

export default function TopNav({ screen, name, steps, onRestart }: TopNavProps) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(239,232,217,.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e2d6bd',
      }}
    >
      <div
        style={{
          maxWidth: 1300,
          margin: '0 auto',
          padding: '12px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          flexWrap: 'wrap',
        }}
      >
        {/* Wordmark */}
        <div
          onClick={() => steps.find(s => s.key === 'welcome')?.onClick()}
          style={{
            fontFamily: "'Ubuntu', sans-serif",
            fontWeight: 700,
            fontSize: 21,
            letterSpacing: '-.01em',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            color: '#1b1d24',
          }}
        >
          PREDICT <span style={{ color: '#c0892b' }}>26</span>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', flex: 1 }}>
          {steps.map(st => (
            <div
              key={st.key}
              onClick={st.onClick}
              className="p26-step"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '6px 11px',
                borderRadius: 20,
                cursor: st.accessible ? 'pointer' : 'default',
                background: st.active ? '#1b1d24' : 'transparent',
                opacity: st.accessible ? 1 : 0.4,
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "'Ubuntu', sans-serif",
                  background: st.active ? '#c0892b' : '#e2d6bd',
                  color: st.active ? '#fff' : '#8a7a52',
                  flex: '0 0 auto',
                }}
              >
                {st.n}
              </span>
              <span
                style={{
                  fontFamily: "'Ubuntu', sans-serif",
                  fontWeight: 500,
                  fontSize: 13,
                  color: st.active ? '#fff' : '#6a6256',
                  whiteSpace: 'nowrap',
                }}
              >
                {st.label}
              </span>
            </div>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {name && screen !== 'welcome' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                background: '#fff',
                border: '1px solid #e2d6bd',
                borderRadius: 20,
                padding: '4px 5px 4px 13px',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: 13, color: '#8a8170' }}>Playing as</span>
              <span
                style={{
                  fontFamily: "'Ubuntu', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  color: '#1b1d24',
                }}
              >
                {name}
              </span>
            </div>
          )}
          <button
            onClick={onRestart}
            title="Start over"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#fff',
              border: '1px solid #e2d6bd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 15,
              color: '#8a8170',
            }}
          >
            ↺
          </button>
        </div>
      </div>
    </div>
  )
}
