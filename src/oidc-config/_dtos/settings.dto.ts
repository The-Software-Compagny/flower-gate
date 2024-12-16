import { IsOptional, IsUrl, ValidateNested } from 'class-validator'
import { PkcePartDto } from './_settings/pkce.part.dto'
import { FeaturesPartDto } from './_settings/features.part.dto'
import { TtlPartDto } from './_settings/ttl.part.dto'
import { CookiesPartDto } from './_settings/cookies.part.dto'

export class SettingsDto {
  @IsOptional()
  @IsUrl({
    require_protocol: true,
    require_tld: true,
    protocols: ['http', 'https'],
  })
  public issuer?: string

  @IsOptional()
  @ValidateNested({ each: true })
  public claims?: {
    //TODO: Check if this is the correct type
    [key: string]: string[]
  }

  @IsOptional()
  @ValidateNested()
  public pkce?: PkcePartDto

  @IsOptional()
  @ValidateNested()
  public features?: FeaturesPartDto

  @IsOptional()
  @ValidateNested()
  ttl?: TtlPartDto

  @IsOptional()
  @ValidateNested()
  cookies?: CookiesPartDto
}
