import { join } from 'node:path'
import { type Config } from 'tailwindcss'
import daisyui from 'daisyui'
import { addIconSelectors } from '@iconify/tailwind'
import { parse } from 'yaml'
import { readFileSync } from 'node:fs'
import { assign } from 'radash'
import { Logger } from '@nestjs/common'

let twc: Partial<Config> = {}
const logger = new Logger('TailwindConfig')
const twcPath = join(process.cwd(), '/config/tailwind.yml')

try {
  twc = parse(readFileSync(twcPath, 'utf8') || '{}')
  logger.log(`Successfully parsed ${twcPath}`)
} catch (e) {
  logger.warn(`Unable to parse extra config: ${e.message}`)
}

export default <Config>assign(twc, {
  content: [
    ...Object.values(twc.content || []).map((content) => {
      if (typeof content === 'string') {
        return content
      }
      return content
    }),
    "./config/**/*.{yml, yaml, json}",
    "./views/**/*.{hbs, html}",
    "./assets/**/*.{js, ts, css}",
  ],
  plugins: [
    daisyui,
    addIconSelectors(['mdi']),
    ...(twc.plugins || []).map((plugin: string | any) => {
      if (typeof plugin === 'string') {
        return require(plugin)
      }
      return require(plugin?.name)(plugin?.options)
    }),
  ],
  daisyui: {
    logs: false,
    ...twc?.daisyui || {},
    themes: [
      ...twc.daisyui?.themes || [],
      "light",
      "dark",
    ],
  },
})
