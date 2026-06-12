'use client'
import React from 'react'
import { CODE2, TEAM } from '@/lib/data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FlagSvgComponent = React.ComponentType<any>

// Static imports of every flag we need — country-flag-icons tree-shakes the rest
import MX from 'country-flag-icons/react/3x2/MX'
import ZA from 'country-flag-icons/react/3x2/ZA'
import KR from 'country-flag-icons/react/3x2/KR'
import CZ from 'country-flag-icons/react/3x2/CZ'
import CA from 'country-flag-icons/react/3x2/CA'
import BA from 'country-flag-icons/react/3x2/BA'
import QA from 'country-flag-icons/react/3x2/QA'
import CH from 'country-flag-icons/react/3x2/CH'
import BR from 'country-flag-icons/react/3x2/BR'
import MA from 'country-flag-icons/react/3x2/MA'
import HT from 'country-flag-icons/react/3x2/HT'
import US from 'country-flag-icons/react/3x2/US'
import PY from 'country-flag-icons/react/3x2/PY'
import AU from 'country-flag-icons/react/3x2/AU'
import TR from 'country-flag-icons/react/3x2/TR'
import DE from 'country-flag-icons/react/3x2/DE'
import CW from 'country-flag-icons/react/3x2/CW'
import CI from 'country-flag-icons/react/3x2/CI'
import EC from 'country-flag-icons/react/3x2/EC'
import NL from 'country-flag-icons/react/3x2/NL'
import JP from 'country-flag-icons/react/3x2/JP'
import SE from 'country-flag-icons/react/3x2/SE'
import TN from 'country-flag-icons/react/3x2/TN'
import BE from 'country-flag-icons/react/3x2/BE'
import EG from 'country-flag-icons/react/3x2/EG'
import IR from 'country-flag-icons/react/3x2/IR'
import NZ from 'country-flag-icons/react/3x2/NZ'
import ES from 'country-flag-icons/react/3x2/ES'
import CV from 'country-flag-icons/react/3x2/CV'
import SA from 'country-flag-icons/react/3x2/SA'
import UY from 'country-flag-icons/react/3x2/UY'
import FR from 'country-flag-icons/react/3x2/FR'
import SN from 'country-flag-icons/react/3x2/SN'
import IQ from 'country-flag-icons/react/3x2/IQ'
import NO from 'country-flag-icons/react/3x2/NO'
import AR from 'country-flag-icons/react/3x2/AR'
import DZ from 'country-flag-icons/react/3x2/DZ'
import AT from 'country-flag-icons/react/3x2/AT'
import JO from 'country-flag-icons/react/3x2/JO'
import PT from 'country-flag-icons/react/3x2/PT'
import CD from 'country-flag-icons/react/3x2/CD'
import UZ from 'country-flag-icons/react/3x2/UZ'
import CO from 'country-flag-icons/react/3x2/CO'
import HR from 'country-flag-icons/react/3x2/HR'
import GH from 'country-flag-icons/react/3x2/GH'
import PA from 'country-flag-icons/react/3x2/PA'
import GB_ENG from 'country-flag-icons/react/3x2/GB-ENG'
import GB_SCT from 'country-flag-icons/react/3x2/GB-SCT'

const FLAG_MAP: Record<string, FlagSvgComponent> = {
  MX, ZA, KR, CZ, CA, BA, QA, CH, BR, MA, HT,
  US, PY, AU, TR, DE, CW, CI, EC, NL, JP, SE, TN,
  BE, EG, IR, NZ, ES, CV, SA, UY, FR, SN, IQ, NO,
  AR, DZ, AT, JO, PT, CD, UZ, CO, HR, GH, PA,
  'GB-ENG': GB_ENG,
  'GB-SCT': GB_SCT,
}

const chipStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  fontFamily: "'Roboto Condensed', sans-serif",
  background: '#1b1d24',
  color: '#fff',
  borderRadius: '4px',
  padding: '2px 5px',
  letterSpacing: '.02em',
  display: 'inline-block',
  lineHeight: 1.3,
}

interface FlagProps {
  name: string
  height?: string | number
  className?: string
  style?: React.CSSProperties
}

export default function Flag({ name, height = '1em', className, style }: FlagProps) {
  const code = CODE2[name]
  const team = TEAM[name]
  const lbl = team?.[1] ?? name.slice(0, 3).toUpperCase()

  if (!code) return <span style={chipStyle}>{lbl}</span>

  const FlagSvg: FlagSvgComponent | undefined = FLAG_MAP[code]
  if (!FlagSvg) return <span style={chipStyle}>{lbl}</span>

  return (
    <FlagSvg
      className={className}
      style={{
        height,
        width: 'auto',
        borderRadius: '2px',
        display: 'inline-block',
        verticalAlign: '-0.12em',
        boxShadow: '0 0 0 1px rgba(0,0,0,.14)',
        objectFit: 'cover',
        flexShrink: 0,
        ...style,
      }}
    />
  )
}
