import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Response } from 'express'
import { AppModule } from './app.module'
import { urlencoded } from 'body-parser'
import { readFileSync, existsSync, writeFileSync } from 'node:fs'
import { promisified } from 'pem'
import tailwindcss from 'tailwindcss'

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

  app.setViewEngine('pug')
  app.use('/interaction', urlencoded({ extended: false }))

  await app.listen(2000, async (): Promise<void> => {
    Logger.log('FlowerGate is READY on <https://localhost:2000/.well-known/openid-configuration> !')
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose((): Promise<void> => app.close())
  }
})()
