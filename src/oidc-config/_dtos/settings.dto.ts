import { ValidateNested } from 'class-validator'
import { PkcePartDto } from './_parts/pkce.part.dto'

export class SettingsDto {
  @ValidateNested()
  pkce?: PkcePartDto
}
