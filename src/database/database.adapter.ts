import { Adapter, AdapterPayload } from 'oidc-provider'
import { DatabaseService } from '../database/database.service'

export class DatabaseAdapter implements Adapter {
  constructor(public modelName: string, public dbService: DatabaseService) { }

  async upsert(
    id: string,
    payload: AdapterPayload,
    expiresIn: number,
  ): Promise<void> {
    await this.dbService.upsert(this.modelName, id, payload, expiresIn)
  }

  async find(id: string): Promise<void | AdapterPayload> {
    return (await this.dbService.find(this.modelName, id)) as AdapterPayload
  }

  async findByUserCode(userCode: string): Promise<void | AdapterPayload> {
    return (await this.dbService.findByUserCode(
      this.modelName,
      userCode,
    )) as AdapterPayload
  }

  async findByUid(uid: string): Promise<void | AdapterPayload> {
    return (await this.dbService.findByUid(
      this.modelName,
      uid,
    )) as AdapterPayload
  }

  async consume(id: string): Promise<void> {
    await this.dbService.consume(this.modelName, id)
  }

  async destroy(id: string): Promise<void> {
    await this.dbService.delete(this.modelName, id)
  }

  async revokeByGrantId(grantId: string): Promise<void> {
    await this.dbService.revokeByGrantId(grantId)
  }
}
