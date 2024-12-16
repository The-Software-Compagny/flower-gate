import { Module } from '@nestjs/common'
import { OidcConfigService } from './oidc-config.service'
import { StorageModule } from '~/storage/storage.module'

@Module({
  imports: [StorageModule],
  providers: [OidcConfigService],
  exports: [OidcConfigService],
})
export class OidcConfigModule { }
