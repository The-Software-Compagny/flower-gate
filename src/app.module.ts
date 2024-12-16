import { RedisModule } from '@nestjs-modules/ioredis'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RequestContextModule } from '@the-software-compagny/nestjs_module_restools'
import { RedisOptions } from 'ioredis'
import { OidcModule } from 'nest-oidc-provider'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import config from './config'
import { InteractionModule } from './interaction/interaction.module'
import { OidcConfigModule } from './oidc-config/oidc-config.module'
import { OidcConfigService } from './oidc-config/oidc-config.service'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'node:path'
import { RendererModule } from './renderer/renderer.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'single',
        url: config.get<string>('ioredis.uri'),
        options: config.get<RedisOptions>('ioredis.options'),
      }),
    }),
    InteractionModule,
    RendererModule.register({
      input: join(process.cwd(), 'assets/css/input.css'),
    }, [{
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/static',
    }]),
    OidcModule.forRootAsync({
      imports: [OidcConfigModule],
      useExisting: OidcConfigService,
    }),
    RequestContextModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
