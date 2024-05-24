import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Response } from 'express'
import { AppModule } from './app.module'
import { urlencoded } from 'body-parser'

declare const module: any;
(async (): Promise<void> => {
  // await setupJose()
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
    cors: true,
  })

  app.use((_, res: Response, next: Function) => {
    res.removeHeader('x-powered-by')
    next()
  })

  app.setViewEngine('pug')

  // app.use(cookieParser())
  app.use('/interaction', urlencoded({ extended: false }))

  await app.listen(2000, async (): Promise<void> => {
    Logger.log('OIDC is READY on <http://localhost:2000/.well-known/openid-configuration> !')
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose((): Promise<void> => app.close())
  }
})()
