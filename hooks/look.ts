import type { ThemeSound, ThemeStyle } from 'claude-code'

import { makeColors } from './make-colors.js'

// Night over Olympus in dark mode; marble and Aegean blue at dawn in light mode.
const made = makeColors({
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

// Marble tablets for the person, papyrus scrolls for Claude.
made.theme.inputs.light = {
  ...made.theme.inputs.light,
  'bg-user-message': '#fbf9f3',
  'text-user-message': '#1b1f3d',
  'bg-assistant-message': '#f3e8cc',
  'text-assistant-message': '#2a2416',
}
made.theme.inputs.dark = {
  ...made.theme.inputs.dark,
  'bg-user-message': '#1c2242',
  'text-user-message': '#ece8dc',
  'bg-assistant-message': '#121733',
  'text-assistant-message': '#ece8dc',
}

export const colors = made.theme
export const problems = made.problems

const GOLD = '#c9a44c'
const GOLD_DEEP = '#8a6b28'

export const style: ThemeStyle = {
  Heading: { fontFamily: ['serif'], fontWeight: 'semibold', letterSpacing: 0.5 },
  // A marble tablet with a Greek key in each corner.
  UserMessage: {
    backgroundColor: 'bg-user-message',
    color: 'text-user-message',
    padding: 22,
    paddingX: 28,
    shadow: { y: 2, blur: 10, color: '#0006' },
    fill: {
      vector: {
        viewBox: 96,
        slice: 24,
        paths: [
          { d: 'M0 0H96V96H0Z', color: 'bg-user-message' },
          { d: 'M3 3H93V93H3Z', strokeWidth: 1, color: GOLD },
          { d: 'M8 20V8H20V16H12V12H16', strokeWidth: 1.5, color: GOLD },
          { d: 'M88 20V8H76V16H84V12H80', strokeWidth: 1.5, color: GOLD },
          { d: 'M8 76V88H20V80H12V84H16', strokeWidth: 1.5, color: GOLD },
          { d: 'M88 76V88H76V80H84V84H80', strokeWidth: 1.5, color: GOLD },
        ],
      },
    },
  },
  // A papyrus scroll between two gilded rods.
  AssistantMessage: {
    backgroundColor: 'bg-assistant-message',
    color: 'text-assistant-message',
    paddingX: 30,
    paddingY: 16,
    fill: {
      vector: {
        viewBox: 96,
        slice: [12, 16, 12, 16],
        paths: [
          { d: 'M8 4H88V92H8Z', color: 'bg-assistant-message' },
          { d: 'M2 3H12V93H2Z', color: GOLD },
          { d: 'M5 3H7V93H5Z', color: GOLD_DEEP },
          { d: 'M0 0H14V5H0Z', color: GOLD_DEEP },
          { d: 'M0 91H14V96H0Z', color: GOLD_DEEP },
          { d: 'M84 3H94V93H84Z', color: GOLD },
          { d: 'M89 3H91V93H89Z', color: GOLD_DEEP },
          { d: 'M82 0H96V5H82Z', color: GOLD_DEEP },
          { d: 'M82 91H96V96H82Z', color: GOLD_DEEP },
        ],
      },
    },
  },
  // Tool calls read like words cut in stone.
  ToolUse: {
    color: 'text-accent',
    fontFamily: ['serif'],
    backgroundColor: 'surface-1',
    borderColor: '#c9a44c55',
    borderWidth: 1,
    radius: 3,
    paddingX: 10,
  },
}

// A quiet night on the mountain: a low lyre drone, wind, and now and then a
// plucked note. Cues are short lyre plucks in D dorian.
export const sound: ThemeSound = {
  ambience: {
    reverb: 0.5,
    layers: [
      { wave: 'triangle', notes: ['D2', 'A2'], drone: true, gain: 0.08, filter: { type: 'lowpass', hz: 500 } },
      { wave: 'pink', drone: true, gain: 0.035, filter: { type: 'lowpass', hz: 350, to: 900 } },
      { wave: 'bell', notes: ['D5', 'F5', 'A5', 'C6', 'E5'], scatter: 0.06, gain: 0.07, attack: 0.01, release: 3 },
    ],
  },
  cues: {
    send: { layers: [{ wave: 'bell', notes: ['A5'], gain: 0.25, release: 0.8 }] },
    tool: { layers: [{ wave: 'sine', notes: ['D6'], gain: 0.06, release: 0.08 }] },
    done: { reverb: 0.4, layers: [{ wave: 'bell', notes: ['D5', 'A5', 'D6'], step: 0.12, gain: 0.25, release: 1.2 }] },
    ask: { layers: [{ wave: 'triangle', notes: ['E5', 'B5'], step: 0.15, gain: 0.2, release: 0.6 }] },
    error: { layers: [{ wave: 'triangle', notes: ['D4', 'C4'], step: 0.18, glide: -2, gain: 0.2, release: 0.7 }] },
    compact: { layers: [{ wave: 'pink', gain: 0.12, attack: 0.3, release: 0.8, filter: { type: 'bandpass', hz: 400, to: 2400 } }] },
    click: { layers: [{ wave: 'bell', notes: ['D5', 'E5', 'G5', 'A5', 'C6', 'D6'], gain: 0.18, release: 1 }] },
  },
}
