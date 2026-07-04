import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E1620',
        panel: '#16202B',
        hairline: '#2A3541',
        fg: '#EDEFF2',
        muted: '#8FA0AF',
        gold: '#E8A33D',
        teal: '#4FD1A5',
        red: '#E2694B',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
}

export default config
