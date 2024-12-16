import { Controller, Get, Logger, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { Response } from 'express'

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)

  constructor(private readonly service: AppService) { }

  @Get()
  public async index(@Res() res: Response) {
    return res.render('index')
  }
}
