import type { DateLines } from './date'
import { BUST_DOTS_DAY, BUST_DOTS_NIGHT, BUST_HEIGHT, BUST_WIDTH } from './hermes-dots'

// The backdrop: a night sky with a dotted head of Hermes and the month's
// constellation in dark mode, and a dawn over a distant temple in light mode.
// Everything is still: it is built once and painted once.

type Pt = [number, number]

let seed = 11
function rnd(): number {
  seed = (seed * 16807) % 2147483647
  return seed / 2147483647
}

// --- the month's constellation -------------------------------------------------

type Constellation = { name: string; stars: Pt[]; lines: [number, number][] }

const SKY: Constellation[] = [
  { name: 'ΩΡΙΩΝ', stars: [[25, 18], [44, 6], [62, 24], [38, 55], [45, 52], [52, 49], [32, 90], [66, 86]], lines: [[0, 1], [1, 2], [0, 3], [2, 5], [3, 4], [4, 5], [3, 6], [5, 7]] },
  { name: 'ΤΑΥΡΟΣ', stars: [[70, 72], [55, 55], [45, 50], [50, 44], [60, 50], [15, 20], [35, 8]], lines: [[0, 1], [1, 2], [1, 4], [4, 3], [2, 5], [3, 6]] },
  { name: 'ΔΙΔΥΜΟΙ', stars: [[30, 8], [48, 14], [26, 40], [50, 44], [18, 70], [32, 78], [54, 72], [66, 86]], lines: [[0, 2], [2, 4], [2, 5], [1, 3], [3, 6], [6, 7], [2, 3]] },
  { name: 'ΛΕΩΝ', stars: [[72, 72], [70, 52], [62, 36], [66, 22], [77, 16], [45, 60], [12, 58], [40, 44]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 1]] },
  { name: 'ΑΡΚΤΟΣ', stars: [[4, 30], [22, 24], [38, 28], [50, 36], [54, 58], [80, 60], [86, 38]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]] },
  { name: 'ΣΚΟΡΠΙΟΣ', stars: [[10, 8], [16, 24], [12, 42], [28, 32], [38, 42], [44, 55], [48, 68], [56, 80], [70, 87], [82, 80], [85, 67], [78, 60]], lines: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11]] },
  { name: 'ΛΥΡΑ', stars: [[34, 8], [45, 32], [62, 36], [56, 72], [40, 68]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 1]] },
  { name: 'ΤΟΞΟΤΗΣ', stars: [[22, 40], [36, 30], [52, 36], [52, 58], [36, 64], [22, 56], [70, 30], [74, 56], [6, 50], [43, 17]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [2, 6], [6, 7], [7, 3], [0, 8], [8, 5], [1, 9], [9, 2]] },
  { name: 'ΚΥΚΝΟΣ', stars: [[50, 4], [50, 38], [50, 66], [50, 94], [14, 28], [86, 32]], lines: [[0, 1], [1, 2], [2, 3], [4, 1], [1, 5]] },
  { name: 'ΠΗΓΑΣΟΣ', stars: [[22, 30], [62, 24], [66, 64], [26, 70], [10, 86], [2, 78], [6, 14]], lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [0, 6]] },
  { name: 'ΚΑΣΣΙΟΠΕΙΑ', stars: [[5, 40], [25, 62], [45, 36], [66, 56], [92, 30]], lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  { name: 'ΠΛΕΙΑΔΕΣ', stars: [[40, 40], [50, 33], [58, 42], [46, 49], [54, 54], [64, 49], [42, 58]], lines: [] },
]

function constellation(month: number): string {
  const c = SKY[month % 12]!
  const at = ([x, y]: Pt): Pt => [380 + x * 4.2, 70 + y * 2.4]
  const lines = c.lines
    .map(([a, b]) => {
      const [x1, y1] = at(c.stars[a]!)
      const [x2, y2] = at(c.stars[b]!)
      return `M${x1.toFixed(0)} ${y1.toFixed(0)}L${x2.toFixed(0)} ${y2.toFixed(0)}`
    })
    .join('')
  const stars = c.stars
    .map(s => {
      const [x, y] = at(s)
      return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="2.6"/>`
    })
    .join('')
  const low = Math.max(...c.stars.map(s => at(s)[1]))
  return `<g class="const"><path d="${lines}"/>${stars}<text x="380" y="${(low + 34).toFixed(0)}">${c.name}</text></g>`
}

// --- the night's stars and the day's temple ---------------------------------------

function stars(): string {
  let out = ''
  for (let i = 0; i < 110; i++) {
    const x = (rnd() * 1600).toFixed(0)
    const y = (rnd() * 900).toFixed(0)
    const r = (0.6 + rnd() * 1.3).toFixed(1)
    const o = (0.2 + rnd() * 0.6).toFixed(2)
    out += `<circle cx="${x}" cy="${y}" r="${r}" opacity="${o}"/>`
  }
  return out
}

function meander(): string {
  let d = ''
  for (let i = 0; i < 1600; i += 24) {
    d += `M${i} 22V4H${i + 18}V16H${i + 8}V10H${i + 12}M${i + 18} 22H${i + 24}`
  }
  return `<path class="key" d="${d}"/>`
}

// A small Doric temple on a hill, far away.
function temple(): string {
  let cols = ''
  for (let i = 0; i < 6; i++) {
    const x = 158 + i * 22
    cols += `M${x} 742h9v-54h-9z`
  }
  return `<g class="temple"><path d="M0 820Q220 735 470 790T980 800T1600 790V900H0Z" class="hill"/>` +
    `<path d="M140 748h160v-6H140zM146 742h148v-4H146z${cols}M144 688h152v-10H144zM150 678L220 652L290 678z"/></g>`
}

// The date, cut into the sky above the head, as in an inscription.
function dateMark(l: DateLines): string {
  return `<g class="date"><text class="d1" x="1500" y="86">${l.greek}</text><text class="d2" x="1500" y="110">${l.greekSub}</text></g>`
}

export function buildScene(month: number, date: DateLines): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<style>
.night{display:inline}.day{display:none}
.stars circle{fill:#f1ead6}
.dot{fill:none;stroke:#e6e1d3;stroke-linecap:round}
.const path{fill:none;stroke:#e8cf8a;stroke-opacity:.35;stroke-width:1}
.const circle{fill:#f0d98f}
.const text{fill:#d9b45a;fill-opacity:.55;font:14px serif;letter-spacing:6px}
.key{fill:none;stroke:#d9b45a;stroke-opacity:.3;stroke-width:2}
.date text{font-family:serif;text-anchor:end;fill:#ece8dc}.d1{font-size:24px;letter-spacing:3px}.d2{font-size:11px;letter-spacing:5px;fill:#9d9fba}
.temple path{fill:#2f4a9a;fill-opacity:.12}.temple .hill{fill:#2f4a9a;fill-opacity:.07}
@media (prefers-color-scheme: light){
.night{display:none}.day{display:inline}
.dot{stroke:#2f4a9a}
.key{stroke:#2f4a9a;stroke-opacity:.18}
.date text{fill:#1b1f3d}.date .d2{fill:#5d607c}
}
@media (max-aspect-ratio: 3/2){.bust{transform:translate(120px,40px) scale(.85)}.date{transform:translateX(-60px)}}
@media (max-aspect-ratio: 1/1){.bust{transform:translate(260px,240px) scale(.6)}.date{transform:translateX(-270px)}}
</style>
<defs>
<radialGradient id="night" cx="70%" cy="10%" r="95%"><stop offset="0" stop-color="#1c2352"/><stop offset=".55" stop-color="#0e1230"/><stop offset="1" stop-color="#0a0d1f"/></radialGradient>
<linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d9c4"/><stop offset=".45" stop-color="#f3ead8"/><stop offset="1" stop-color="#e9e4d6"/></linearGradient>
<radialGradient id="sun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff4d6" stop-opacity=".95"/><stop offset=".35" stop-color="#f7d79a" stop-opacity=".55"/><stop offset="1" stop-color="#f7d79a" stop-opacity="0"/></radialGradient>
</defs>
<g class="night"><rect width="1600" height="900" fill="url(#night)"/><g class="stars">${stars()}</g>${constellation(month)}</g>
<g class="day"><rect width="1600" height="900" fill="url(#dawn)"/><circle cx="1250" cy="330" r="330" fill="url(#sun)"/>${temple()}</g>
${meander()}
${dateMark(date)}
<g class="bust"><svg x="1040" y="70" width="460" height="730" viewBox="0 0 ${BUST_WIDTH} ${BUST_HEIGHT}"><g class="night">${BUST_DOTS_NIGHT}</g><g class="day">${BUST_DOTS_DAY}</g></svg></g>
</svg>`
}
