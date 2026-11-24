import type { Register, ThemeSetArgs } from 'claude-code'

import { dateLines } from './date'
import { colors, problems, sound, style } from './look'
import { consult } from './oracle'
import { buildScene } from './scene'

const SCENE_ID = 'olympus-night'

export const register: Register = on => {
  // The scene is still: built once a day, painted once.
  let scene = ''
  let day = ''

  async function sceneFor(now: number): Promise<string> {
    const d = new Date(now)
    const key = d.toDateString()
    if (key !== day) {
      day = key
      scene = buildScene(d.getMonth(), dateLines(d))
    }
    return scene
  }

  on('session.start', async ($, e, next) => {
    await sceneFor(await $.clock.now())

    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    // Glass with no blur: the panels let the sky show through without the GPU cost of frosting.
    const base: ThemeSetArgs = { colors, backdrop: { scene: SCENE_ID, glass: { blur: 0, opacity: 0.15 } } }
    // Older builds refuse `style` or `sound`: step down until one is taken.
    for (const look of [{ ...base, style, sound }, { ...base, style }, base]) {
      try {
        const set = await $.theme.set(look)
        if (!set.isDrawn) {
          $.ui.status(set.reason)
        }
        break
      } catch (error) {
        $.ui.log(String(error))
      }
    }

    await $.command.register({
      name: 'oraculo',
      description: 'Consulta al oráculo de Delfos: una cita de la filosofía griega',
      argumentHint: '[pregunta]',
      immediate: true,
    })

    return next(e)
  })

  on('command.run', { command: 'oraculo' }, async (_$, e) => ({ text: consult(e.args) }))

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)
    const source = await sceneFor(await $.clock.now())

    return <Svg source={source} alt="Head of Hermes in dots under a night sky, with the date in Greek" />
  })
}
