// The backdrop: a night sky with a dotted bust of Athena and the month's
// constellation in dark mode, and a dawn over a distant temple in light mode.
// Everything is still: it is built once and painted once.

type Pt = [number, number]

// --- the dotted bust ---------------------------------------------------------

const LIGHT = norm([-0.55, -0.6, 0.6])

function norm(v: [number, number, number]): [number, number, number] {
  const l = Math.hypot(v[0], v[1], v[2])
  return [v[0] / l, v[1] / l, v[2] / l]
}

// Lambert light on an ellipsoid of radii rx, ry (depth rz) centred at cx, cy.
function ellipsoid(x: number, y: number, cx: number, cy: number, rx: number, ry: number): number | null {
  const u = (x - cx) / rx
  const v = (y - cy) / ry
  const d = u * u + v * v
  if (d > 1) return null
  const z = Math.sqrt(1 - d)
  const n = norm([u, v, z])
  return Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2])
}

function inEllipse(x: number, y: number, cx: number, cy: number, rx: number, ry: number): number {
  const u = (x - cx) / rx
  const v = (y - cy) / ry
  return u * u + v * v
}

// Soft bump: 1 at the centre of the ellipse, 0 at its edge.
function bump(x: number, y: number, cx: number, cy: number, rx: number, ry: number): number {
  const d = inEllipse(x, y, cx, cy, rx, ry)
  return d >= 1 ? 0 : (1 - d) * (1 - d)
}

let seed = 11
function rnd(): number {
  seed = (seed * 16807) % 2147483647
  return seed / 2147483647
}

// Brightness 0..1 at a point of a 600 x 800 box, or null outside the bust.
function bust(x: number, y: number): number | null {
  // Crest of the helmet: a sweeping plume of horse hair over the top.
  const cx = 360
  const cy = 330
  const r = Math.hypot(x - cx, y - cy)
  const a = Math.atan2(y - cy, x - cx)
  if (r > 196 && r < 236 && a > -2.75 && a < -0.55) {
    const strand = 0.5 + 0.5 * Math.sin(a * 60)
    const edge = 1 - Math.abs(r - 216) / 20
    return 0.35 + 0.5 * strand * edge + 0.15 * (a < -1.6 ? 1 : 0)
  }
  // Crest holder.
  if (r >= 170 && r <= 196 && a > -2.2 && a < -1.2) {
    return 0.5 + 0.3 * Math.cos(a + 1.7)
  }

  // Helmet dome, pushed up over the brow, with a bright brim.
  if (y < 335 || (y < 345 && inEllipse(x, y, 300, 430, 100, 140) > 0.75)) {
    const h = ellipsoid(x, y, 300, 300, 150, 135)
    if (h !== null) {
      const brim = y > 312 ? 0.25 : 0
      const rim = inEllipse(x, y, 300, 300, 150, 135) > 0.86 ? 0.15 : 0
      return Math.min(1, h * 0.95 + brim + rim)
    }
  }

  // Curls of hair falling beside the face.
  for (const [hx, hy] of [[200, 395], [400, 395], [210, 465], [390, 465]] as Pt[]) {
    const c = ellipsoid(x, y, hx, hy, 34, 52)
    if (c !== null && inEllipse(x, y, 300, 430, 100, 140) > 0.9) {
      return c * (0.55 + 0.45 * Math.sin((x + y) * 0.25) ** 2)
    }
  }

  // Face.
  const f = ellipsoid(x, y, 300, 430, 100, 140)
  if (f !== null) {
    let b = 0.15 + f * 0.95
    // brow ridge, cheeks and chin catch the light
    b += 0.25 * bump(x, y, 300, 385, 85, 14)
    b += 0.2 * bump(x, y, 262, 468, 30, 22) + 0.12 * bump(x, y, 340, 468, 26, 22)
    b += 0.25 * bump(x, y, 300, 548, 34, 18)
    // eye sockets: almond shadows under a lit lid
    b -= 0.8 * bump(x, y, 258, 416, 27, 10) + 0.8 * bump(x, y, 342, 416, 25, 10)
    b -= 0.3 * bump(x, y, 258, 410, 34, 18) + 0.3 * bump(x, y, 342, 410, 32, 18)
    b += 0.3 * bump(x, y, 258, 403, 26, 5) + 0.25 * bump(x, y, 342, 403, 24, 5)
    // nose: a lit ridge with its shadow to the right
    b += 0.35 * bump(x, y, 297, 448, 7, 46)
    b -= 0.55 * bump(x, y, 313, 462, 9, 34)
    b -= 0.6 * bump(x, y, 290, 494, 8, 5) + 0.6 * bump(x, y, 312, 494, 8, 5)
    b += 0.2 * bump(x, y, 300, 488, 14, 6)
    // lips
    b -= 0.65 * bump(x, y, 300, 522, 28, 4)
    b += 0.2 * bump(x, y, 300, 531, 18, 5)
    b -= 0.25 * bump(x, y, 300, 540, 14, 4)
    // shadow down the far side of the face
    if (x > 370) b -= 0.15
    return Math.max(0, Math.min(1, b))
  }

  // Neck: a cylinder.
  if (x > 248 && x < 352 && y >= 520 && y < 660) {
    const u = (x - 300) / 52
    const n = norm([u, 0, Math.sqrt(Math.max(0, 1 - u * u))])
    const lit = Math.max(0, n[0] * LIGHT[0] + n[2] * LIGHT[2])
    return (y < 575 ? 0.35 : 0.15) + lit * 0.75
  }

  // Shoulders and the folds of the peplos.
  const s = ellipsoid(x, y, 300, 800, 250, 170)
  if (s !== null) {
    const fold = 0.5 + 0.5 * Math.sin(x * 0.07 + Math.sin(y * 0.03) * 2)
    const aegis = bump(x, y, 300, 690, 110, 50)
    return Math.min(1, s * (0.55 + 0.45 * fold) + 0.2 * aegis)
  }

  return null
}

// One dot is "Mx yh0", a zero-length stroke with a round cap. Dots of one size
// share a path, so the whole bust is a handful of paths.
function dottedBust(): string {
  const buckets: string[][] = [[], [], [], [], []]
  const step = 7
  for (let row = 0, y = 80; y < 800; row++, y += step * 0.87) {
    for (let x = 50 + (row % 2 ? step / 2 : 0); x < 600; x += step) {
      const raw = bust(x, y)
      const b = raw === null ? null : raw * Math.min(1, (800 - y) / 110)
      if (b === null || b < 0.08) continue
      const jitter = (rnd() - 0.5) * 0.15
      const level = Math.min(4, Math.floor((b + jitter) * 5))
      if (level < 0) continue
      buckets[level]!.push(`M${x.toFixed(0)} ${y.toFixed(0)}h0`)
    }
  }
  return buckets
    .map((d, i) => (d.length ? `<path class="dot" stroke-width="${(1.4 + i * 1.05).toFixed(2)}" stroke-opacity="${(0.35 + i * 0.15).toFixed(2)}" d="${d.join('')}"/>` : ''))
    .join('')
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

export function buildScene(month: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<style>
.night{display:inline}.day{display:none}
.stars circle{fill:#f1ead6}
.dot{fill:none;stroke:#e6e1d3;stroke-linecap:round}
.const path{fill:none;stroke:#e8cf8a;stroke-opacity:.35;stroke-width:1}
.const circle{fill:#f0d98f}
.const text{fill:#d9b45a;fill-opacity:.55;font:14px serif;letter-spacing:6px}
.key{fill:none;stroke:#d9b45a;stroke-opacity:.3;stroke-width:2}
.temple path{fill:#2f4a9a;fill-opacity:.12}.temple .hill{fill:#2f4a9a;fill-opacity:.07}
@media (prefers-color-scheme: light){
.night{display:none}.day{display:inline}
.dot{stroke:#2f4a9a}
.key{stroke:#2f4a9a;stroke-opacity:.18}
}
@media (max-aspect-ratio: 3/2){.bust{transform:translate(120px,40px) scale(.85)}}
@media (max-aspect-ratio: 1/1){.bust{transform:translate(260px,240px) scale(.6)}}
</style>
<defs>
<radialGradient id="night" cx="70%" cy="10%" r="95%"><stop offset="0" stop-color="#1c2352"/><stop offset=".55" stop-color="#0e1230"/><stop offset="1" stop-color="#0a0d1f"/></radialGradient>
<linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d9c4"/><stop offset=".45" stop-color="#f3ead8"/><stop offset="1" stop-color="#e9e4d6"/></linearGradient>
<radialGradient id="sun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff4d6" stop-opacity=".95"/><stop offset=".35" stop-color="#f7d79a" stop-opacity=".55"/><stop offset="1" stop-color="#f7d79a" stop-opacity="0"/></radialGradient>
</defs>
<g class="night"><rect width="1600" height="900" fill="url(#night)"/><g class="stars">${stars()}</g>${constellation(month)}</g>
<g class="day"><rect width="1600" height="900" fill="url(#dawn)"/><circle cx="1250" cy="330" r="330" fill="url(#sun)"/>${temple()}</g>
${meander()}
<g class="bust"><svg x="990" y="40" width="540" height="700" viewBox="50 80 550 720">${dottedBust()}</svg></g>
</svg>`
}
