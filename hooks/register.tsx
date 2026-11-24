import type { Register, ThemeSetArgs } from 'claude-code'

import { BAND_HEIGHT, BAND_WIDTH, dateBand, dateLines } from './date'
import { colors, problems, sound, style } from './look'
import { consult } from './oracle'
import { buildScene } from './scene'

const SCENE_ID = 'olympus-night'

export const register: Register = on => {
  // Built once per load: the scene is still, so it is painted once.
  let scene = ''

  on('session.start', async ($, e, next) => {
    const now = new Date(await $.clock.now())
    scene = buildScene(now.getMonth())

    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    const base: ThemeSetArgs = { colors, backdrop: { scene: SCENE_ID, glass: { blur: 0, opacity: 0.15 } } }
    // Glass with no blur: the panels let the sky show through without the GPU cost of frosting.
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

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || scene === '') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={scene} alt="Head of Hermes in dots under a night sky" />
  })

  // The date as a Greek inscription above the prompt; it turns into English
  // under the pointer.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.hasSurvey) {
      return next(e)
    }
    const { Box, Svg } = $.ui.resolve(e)
    const lines = dateLines(new Date(await $.clock.now()))

    return (
      <Box justifyContent="center">
        <Svg
          source={dateBand(lines)}
          alt={`${lines.greek}, ${lines.greekSub}: ${lines.english}, ${lines.englishSub}`}
          width={BAND_WIDTH}
          height={BAND_HEIGHT}
          isInteractive
        />
      </Box>
    )
  })
}
