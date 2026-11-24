// The date as a Greek inscription: Greek numerals for the day, Roman for the year.

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
