import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { urlencoded } from 'body-parser'
import { Response } from 'express'
import { engine } from 'express-handlebars'
import handlebars from 'handlebars'
import handlebarsLayouts from 'handlebars-layouts'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { promisified } from 'pem'
import { AppModule } from './app.module'

declare const module: any;
(async (): Promise<void> => {
  // await setupJose()
  if (!existsSync('./secrets/private-key.pem') || !existsSync('./secrets/public-certificate.pem')) {
    const keys = await promisified.createCertificate({ days: 365, selfSigned: true })
    Logger.log('Creating self-signed certificate...')
    try {
      writeFileSync('./secrets/private-key.pem', keys.serviceKey)
      writeFileSync('./secrets/public-certificate.pem', keys.certificate)
    } catch (error) {
      Logger.error(error)
      process.exit(1)
    }
  }
  const httpsOptions = {
    key: readFileSync('./secrets/private-key.pem'),
    cert: readFileSync('./secrets/public-certificate.pem'),
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
    bodyParser: false,
    cors: true,
  })

  app.use((_, res: Response, next: Function) => {
    res.removeHeader('x-powered-by')
    next()
  })

  handlebars.registerHelper(handlebarsLayouts(handlebars))
  app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: join(process.cwd(), '/views/layouts'),
    partialsDir: join(process.cwd(), '/views/partials'),
    helpers: {
      json: (context: any) => JSON.stringify(context, null, 2),
    },
  }))
  app.setViewEngine('hbs')
  app.setBaseViewsDir(join(process.cwd(), '/views/pages'))

  app.use('/interaction', urlencoded({ extended: false }))

  await app.listen(2000, async (): Promise<void> => {
    Logger.log('FlowerGate is READY on <https://localhost:2000/oidc/.well-known/openid-configuration> !')
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose((): Promise<void> => app.close())
  }
})()
