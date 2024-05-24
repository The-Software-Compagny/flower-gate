import { IsBoolean, IsEnum } from 'class-validator'
import { PKCEMethods } from 'oidc-provider';

export class PkcePartDto {
  // @IsEnum(PKCEMethods, { each: true })
  methods?: PKCEMethods[];

  @IsBoolean()
  required?: boolean;
}
