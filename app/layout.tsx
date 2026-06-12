import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PREDICT 26 — World Cup 2026 Bracket Predictor',
  description: 'Call every match. Build your bracket. Crown your champion.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&family=Roboto+Condensed:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Roboto Condensed', sans-serif", color: '#1b1d24' }}>
        {children}
      </body>
    </html>
  )
}
