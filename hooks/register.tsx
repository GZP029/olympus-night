import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Night sky over Olympus by default; marble and Aegean blue by day.
const { theme, problems } = makeColors({
  label: 'Olympus Night',
  roles: { accent: '#d9b45a', danger: '#e0675a', success: '#7fbf8a', warning: '#e0a84a', pro: '#9d8ce0' },
  light: {
    roles: { accent: '#2f4a9a', danger: '#b3392f', success: '#3f7a4a', warning: '#9a6410', pro: '#6a4fa0' },
    gray: {
      anchors: {
        'surface-0': '#e9e4d6',
        'surface-1': '#f1ede1',
        'surface-2': '#f8f5ec',
        'text-primary': '#1b1f3d',
        'text-secondary': '#454866',
        'text-muted': '#5d607c',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0a0d1f',
        'surface-1': '#10142b',
        'surface-2': '#151a36',
        'surface-3': '#181d3c',
        'text-primary': '#ece8dc',
        'text-secondary': '#c4c3d2',
        'text-muted': '#9d9fba',
      },
    },
  },
})

// Deterministic starfield and a Greek-key (meander) strip along the top.
function scene(): string {
  let seed = 7
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  let stars = ''
  for (let i = 0; i < 110; i++) {
    const x = (rnd() * 1600).toFixed(0)
    const y = (rnd() * 900).toFixed(0)
    const r = (0.6 + rnd() * 1.4).toFixed(1)
    const o = (0.25 + rnd() * 0.6).toFixed(2)
    stars += `<circle class="s" cx="${x}" cy="${y}" r="${r}" opacity="${o}"/>`
  }
  const key = 'M0 22V4H18V16H8V10H12M18 22H24'
  let meander = ''
  for (let i = 0; i < 1600; i += 24) {
    meander += `<path d="${key}" transform="translate(${i} 0)"/>`
  }
  // a small constellation
  const pts: [number, number][] = [[1180, 220], [1250, 170], [1330, 210], [1390, 140], [1450, 190]]
  const lines = pts.map(([x, y]) => `${x} ${y}`).join(' ')
  const dots = pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" class="c"/>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<style>
.s{fill:#f1ead6}
.c{fill:#e8cf8a}
@media (prefers-color-scheme: light){.s{fill:#2f4a9a}.c{fill:#2f4a9a}}
</style>
<defs>
<radialGradient id="g" cx="50%" cy="0%" r="90%"><stop offset="0" stop-color="#1c2352"/><stop offset="1" stop-color="#0a0d1f"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#g)"/>
${stars}
<polyline points="${lines}" fill="none" stroke="#e8cf8a" stroke-opacity=".35" stroke-width="1"/>
${dots}
<g fill="none" stroke="#d9b45a" stroke-opacity=".35" stroke-width="2">${meander}</g>
</svg>`
}

// Built once: a still scene, no animation, so the GPU only paints it when the window changes.
const SCENE = scene()

const LOOK: ThemeSetArgs = {
  colors: theme,
  overrideColorScheme: 'dark',
  backdrop: { scene: 'olympus-night', glass: false },
  style: {
    Heading: { fontFamily: ['serif'], fontWeight: 'semibold', letterSpacing: 0.5 },
    UserMessage: {
      backgroundColor: 'surface-2',
      borderColor: '#d9b45a66',
      borderWidth: 1,
      radius: 14,
      paddingX: 14,
      paddingY: 10,
    },
  },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    try {
      const set = await $.theme.set(LOOK)

      if (!set.isDrawn) {
        $.ui.status(set.reason)
      }
    } catch (error) {
      $.ui.log(String(error))
      await $.theme.set({ colors: theme, overrideColorScheme: 'dark', backdrop: { scene: 'olympus-night', glass: false } })
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A night sky of stars over Olympus" />
  })
}
