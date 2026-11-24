// The date as a Greek inscription, which turns into English under the pointer.

const UNITS = ['', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ϛ', 'Ζ', 'Η', 'Θ']
const TENS = ['', 'Ι', 'Κ', 'Λ']
const MONTHS_GR = ['ΙΑΝΟΥΑΡΙΟΥ', 'ΦΕΒΡΟΥΑΡΙΟΥ', 'ΜΑΡΤΙΟΥ', 'ΑΠΡΙΛΙΟΥ', 'ΜΑΪΟΥ', 'ΙΟΥΝΙΟΥ', 'ΙΟΥΛΙΟΥ', 'ΑΥΓΟΥΣΤΟΥ', 'ΣΕΠΤΕΜΒΡΙΟΥ', 'ΟΚΤΩΒΡΙΟΥ', 'ΝΟΕΜΒΡΙΟΥ', 'ΔΕΚΕΜΒΡΙΟΥ']
const DAYS_GR = ['ΚΥΡΙΑΚΗ', 'ΔΕΥΤΕΡΑ', 'ΤΡΙΤΗ', 'ΤΕΤΑΡΤΗ', 'ΠΕΜΠΤΗ', 'ΠΑΡΑΣΚΕΥΗ', 'ΣΑΒΒΑΤΟ']
const MONTHS_EN = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
const DAYS_EN = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

export function greekNumeral(n: number): string {
  return `${TENS[Math.floor(n / 10)]}${UNITS[n % 10]}ʹ`
}

export function roman(n: number): string {
  const table: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let out = ''
  for (const [v, s] of table) {
    while (n >= v) {
      out += s
      n -= v
    }
  }
  return out
}

export type DateLines = { greek: string; greekSub: string; english: string; englishSub: string }

export function dateLines(d: Date): DateLines {
  return {
    greek: `${greekNumeral(d.getDate())} ${MONTHS_GR[d.getMonth()]}`,
    greekSub: `${DAYS_GR[d.getDay()]} · ${roman(d.getFullYear())}`,
    english: `${d.getDate()} ${MONTHS_EN[d.getMonth()]}`,
    englishSub: `${DAYS_EN[d.getDay()]} · ${d.getFullYear()}`,
  }
}

// Each letter of the inscription lifts away in turn while the English settles in.
// Nothing moves until the pointer is over it.
function letters(text: string, cls: string): string {
  return [...text]
    .map((ch, i) => `<tspan class="${cls}" style="transition-delay:${(i * 0.018).toFixed(3)}s">${ch === ' ' ? '&#160;' : ch}</tspan>`)
    .join('')
}

export const BAND_WIDTH = 460
export const BAND_HEIGHT = 46

export function dateBand(l: DateLines): string {
  const mid = BAND_WIDTH / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BAND_WIDTH} ${BAND_HEIGHT}" width="${BAND_WIDTH}" height="${BAND_HEIGHT}">
<style>
svg{cursor:default}
text{font-family:serif;text-anchor:middle;fill:#ece8dc}
.sub{font-size:9px;letter-spacing:4px;fill:#9d9fba}
.main{font-size:17px;letter-spacing:3px}
.g,.e{transition:opacity .4s ease}
.e{opacity:0}
svg:hover .g{opacity:0}
svg:hover .e{opacity:1}
.gt,.et{transition:transform .6s cubic-bezier(.2,.8,.2,1)}
.et{transform:translateY(7px)}
svg:hover .gt{transform:translateY(-7px)}
svg:hover .et{transform:none}
.line{stroke:#d9b45a;stroke-width:1;stroke-dasharray:${BAND_WIDTH};stroke-dashoffset:${BAND_WIDTH};transition:stroke-dashoffset .8s ease}
svg:hover .line{stroke-dashoffset:0}
.key{fill:none;stroke:#d9b45a;stroke-opacity:.7;stroke-width:1.2}
@media (prefers-color-scheme: light){
text{fill:#1b1f3d}.sub{fill:#5d607c}
.line,.key{stroke:#2f4a9a}
}
@media (prefers-reduced-motion: reduce){.g,.e,.line{transition:none}}
</style>
<path class="key" d="M18 30V18H30V26H22V22H26M${BAND_WIDTH - 18} 30V18H${BAND_WIDTH - 30}V26H${BAND_WIDTH - 22}V22H${BAND_WIDTH - 26}"/>
<g class="gt"><text class="main" x="${mid}" y="22">${letters(l.greek, 'g')}</text><text class="sub" x="${mid}" y="38">${letters(l.greekSub, 'g')}</text></g>
<g class="et"><text class="main" x="${mid}" y="22">${letters(l.english, 'e')}</text><text class="sub" x="${mid}" y="38">${letters(l.englishSub, 'e')}</text></g>
<path class="line" d="M40 43H${BAND_WIDTH - 40}"/>
</svg>`
}
