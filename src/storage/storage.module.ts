import { Module } from '@nestjs/common'
import { IORedisService } from './_services/io-redis.service'
import { LruService } from './_services/lru.service'

@Module({
  providers: [
    IORedisService,
    LruService,
  ],
  exports: [
    IORedisService,
    LruService,
  ],
})
export class StorageModule { }
