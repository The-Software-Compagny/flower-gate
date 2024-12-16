import { Injectable, Logger } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { RequestContextStorage } from '@the-software-compagny/nestjs_module_restools'
import { Request } from 'express'

export interface AbstractServiceContext {
  [key: string | number]: any;

  moduleRef?: ModuleRef;
  req?: Request & { user?: any };
}

@Injectable()
export abstract class AbstractService {
  protected logger: Logger;
  protected moduleRef: ModuleRef;
  private readonly _req?: Request & { user?: any }

  protected constructor(context?: AbstractServiceContext) {
    this.moduleRef = context?.moduleRef;
    this._req = context?.req;
    this.logger = new Logger(this.serviceName);
  }

  protected get request():
    | (Request & {
      user?: any // eslint-disable-line
    })
    | null {
    return this._req || RequestContextStorage.currentContext?.req;
  }

  public get moduleName(): string {
    //TODO: change modulename from module ref ?
    if (!this.request) throw new Error('Request is not defined in ' + this.constructor.name);
    const moduleName = this.request.path.split('/').slice(1).shift();
    return moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  }

  public get serviceName(): string {
    return this.constructor.name.replace(/Service$/, '');
  }
}
