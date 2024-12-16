import { IsBoolean, IsEnum, IsIn, IsOptional } from 'class-validator'
import { PKCEMethods } from 'oidc-provider'

export class PkcePartDto {
  @IsOptional()
  @IsBoolean()
  public enabled?: boolean

  @IsOptional()
  @IsIn(['S256', 'plain'])
  public methods?: PKCEMethods[]

}
