import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import config, { MongoosePlugin } from './config'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { RedisModule } from '@nestjs-modules/ioredis'
import { RedisOptions } from 'ioredis'
import { AppService } from './app.service'
import { InteractionModule } from './interaction/interaction.module'
import { OidcConfigModule } from './oidc-config/oidc-config.module'
import { OidcConfigService } from './oidc-config/oidc-config.service'
import { OidcModule } from 'nest-oidc-provider'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'node:path'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        for (const plugin of config.get<MongoosePlugin[]>('mongoose.plugins')) {
          import(plugin.package).then((plugin) => {
            mongoose.plugin(plugin.default ? plugin.default : plugin, plugin.options);
          });
        }
        return {
          ...config.get<MongooseModuleOptions>('mongoose.options'),
          uri: config.get<string>('mongoose.uri'),
        };
      },
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/assets',
    }),
    OidcModule.forRootAsync({
      imports: [OidcConfigModule],
      useExisting: OidcConfigService,
    }),
  ],
  providers: [AppService],
})
export class AppModule { }
