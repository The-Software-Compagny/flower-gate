import { DynamicModule, Logger, Module, OnModuleInit } from "@nestjs/common"
import { ServeStaticModule, ServeStaticModuleOptions } from "@nestjs/serve-static"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { build } from 'tailwindcss/lib/cli/build'
import { RendererOptions } from "./renderer-options.interface"

@Module({})
export class RendererModule implements OnModuleInit {
  public static readonly TAILWIND_CONFIG_NAME = 'tailwind.config'

  public static options: RendererOptions

  private readonly logger = new Logger(RendererModule.name)

  public async onModuleInit() {
    const args = {}

    const tailwindConfigJs = join(process.cwd(), RendererModule.TAILWIND_CONFIG_NAME + '.js')
    const tailwindConfigTs = join(process.cwd(), RendererModule.TAILWIND_CONFIG_NAME + '.ts')

    if (existsSync(tailwindConfigJs) || existsSync(tailwindConfigTs)) {
      args['--config'] = existsSync(tailwindConfigJs) ? tailwindConfigJs : tailwindConfigTs
    }

    try {
      args['--input'] = RendererModule.options.input
      if (!existsSync(RendererModule.options.input)) {
        throw new Error(`${args['--input']} not found`)
      }

      args['--output'] = join(
        RendererModule.options.rendererRootPath,
        RendererModule.options.output,
      )

      if (process.env.NODE_ENV === 'production') {
        await build({
          ...args,
          '--minify': true,
        })
        return
      }

      await build({
        ...args,
        '--watch': true,
      })
    } catch (error) {
      this.logger.error(error)
    }
  }

  public static register(options: RendererOptions, imported: ServeStaticModuleOptions[] = []): DynamicModule {
    this.options = {
      output: join('css', 'output.css'),
      rendererRootPath: join(process.cwd(), 'dist', 'public'),
      rendererServeRoot: '/assets',
      ...options,
    }

    const nowImported: ServeStaticModuleOptions[] = [
      {
        rootPath: this.options.rendererRootPath,
        serveRoot: this.options.rendererServeRoot,
      },
      ...imported,
    ]

    return {
      module: this,
      imports: [
        ServeStaticModule.forRoot(...nowImported),
      ],
    };
  }
}
