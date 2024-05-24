'use strict'

import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'

@Injectable()
export class DatabaseService {
  private readonly grantable = new Set([
    'AccessToken',
    'AuthorizationCode',
    'RefreshToken',
    'DeviceCode',
    'BackchannelAuthenticationRequest',
  ])

  private readonly consumable = new Set([
    'AuthorizationCode',
    'RefreshToken',
    'DeviceCode',
    'BackchannelAuthenticationRequest',
  ])

  public constructor(@InjectRedis() private readonly redis: Redis) { }

  private key(model: string, id: string): string {
    return `${model}:${id}`
  }

  private grantKeyFor(id: string): string {
    return `grant:${id}`
  }

  private sessionUidKeyFor(id: string): string {
    return `sessionUid:${id}`
  }

  private userCodeKeyFor(userCode: string): string {
    return `userCode:${userCode}`
  }

  public async upsert(
    model: string,
    id: string,
    payload: Record<string, any>,
    expiresIn: number,
  ) {
    const key = this.key(model, id)
    const store = this.consumable.has(model)
      ? { payload: JSON.stringify(payload) }
      : JSON.stringify(payload)

    const multi = this.redis.multi()
    multi[this.consumable.has(model) ? 'hmset' : 'set'](key, store as any)

    if (expiresIn) {
      multi.expire(key, expiresIn)
    }

    if (this.grantable.has(model) && payload.grantId) {
      const grantKey = this.grantKeyFor(payload.grantId)
      multi.rpush(grantKey, key)

      const ttl = await this.redis.ttl(grantKey)
      if (expiresIn > ttl) {
        multi.expire(grantKey, expiresIn)
      }
    }

    if (payload.userCode) {
      const userCodeKey = this.userCodeKeyFor(payload.userCode)
      multi.set(userCodeKey, id)
      multi.expire(userCodeKey, expiresIn)
    }

    if (payload.uid) {
      const uidKey = this.sessionUidKeyFor(payload.uid)
      multi.set(uidKey, id)
      multi.expire(uidKey, expiresIn)
    }

    // console.log('upsert', model, id, payload, expiresIn, key, store, multi)

    await multi.exec()
  }

  public async delete(model: string, id: string) {
    const key = this.key(model, id)
    await this.redis.del(key)
  }

  public async consume(model: string, id: string) {
    await this.redis.hset(
      this.key(model, id),
      'consumed',
      Math.floor(Date.now() / 1000),
    )
  }

  public async find(model: string, id: string) {
    console.log('find', model, id, this.key(model, id))
    const data = this.consumable.has(model)
      ? await this.redis.hgetall(this.key(model, id))
      : await this.redis.get(this.key(model, id))
    // console.log('parse data', data)

    if (!data) {
      return undefined
    }

    if (typeof data === 'string') {
      return JSON.parse(data)
    }
    const { payload, ...rest } = data
    try {
      // fix with try catch
      return {
        ...rest,
        ...JSON.parse(payload),
      }
    } catch (error) {
      return null
    }
  }

  public async findByUid(model: string, uid: string) {
    const id = await this.redis.get(this.sessionUidKeyFor(uid))
    return this.find(model, id)
  }

  public async findByUserCode(model: string, userCode: string) {
    const id = await this.redis.get(this.userCodeKeyFor(userCode))
    return this.find(model, id)
  }

  public async revokeByGrantId(grantId: string) {
    const grantKey = this.grantKeyFor(grantId)
    const multi = this.redis.multi()
    const tokens = await this.redis.lrange(grantKey, 0, -1)
    tokens.forEach((token) => multi.del(token))
    multi.del(grantKey)
    await multi.exec()
  }
}
