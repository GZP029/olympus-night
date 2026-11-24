import { expect, test } from 'claude-code/testing'

const NOW = Date.UTC(2026, 10, 24, 12)

function stubs(on: any, sets: unknown[], logs: string[]) {
  on('clock.now', () => ({ value: NOW }))
  on('session.start', (_: unknown, e: any) => e)
  on('command.register', () => ({ value: undefined }))
  on('ui.log', (_: unknown, e: any) => {
    logs.push(JSON.stringify(e))
    return { value: undefined }
  })
  on('ui.status', () => ({ value: undefined }))
  on('ui.toast', () => ({ value: undefined }))
  on('theme.set', (_: unknown, e: any) => {
    sets.push(e)
    return { value: { isDrawn: true } }
  })
}

test('the whole look is taken: colors, scene, style and sound', async ($, on) => {
  const sets: any[] = []
  const logs: string[] = []
  stubs(on, sets, logs)

  await $.session.start({ source: 'startup', cwd: '/tmp' } as never)

  expect(logs).toEqual([])
  expect(sets.length).toBe(1)
  expect(Object.keys(sets[0])).toContain('sound')
  expect(Object.keys(sets[0])).toContain('style')
})

test('/oraculo answers with a saying', async ($, on) => {
  stubs(on, [], [])
  await $.session.start({ source: 'startup', cwd: '/tmp' } as never)
  const r = await $.command.run({ command: 'oraculo', args: '¿lanzo mi startup?' } as never)

  expect(r.text).toContain('ΜΑΝΤΕΙΟΝ')
  expect(r.text).toContain('—')
})

test('the backdrop carries the Greek date', async ($, on) => {
  stubs(on, [], [])
  await $.session.start({ source: 'startup', cwd: '/tmp' } as never)
  const ui = await $.ui.mount({ plugin: 'olympus-night', surface: 'desktop', component: 'Backdrop', props: { scene: 'olympus-night' } } as never)
  const svg: any = await ui.find({ type: 'Svg' })

  expect(JSON.stringify(svg)).toContain('ΝΟΕΜΒΡΙΟΥ')
  await ui.unmount()
})
