import { IsOptional, IsString, ValidateNested } from "class-validator";
import { CookiesOptionsPartDto } from "./cookies-options.part.dto";
import { CookiesNamesPartDto } from "./cookies-names.part.dto";

export class CookiesPartDto {
  @IsOptional()
  @ValidateNested()
  names?: CookiesNamesPartDto

  @IsOptional()
  @ValidateNested()
  public long?: CookiesOptionsPartDto

  @IsOptional()
  @ValidateNested()
  public short?: CookiesOptionsPartDto

  @IsOptional()
  @IsString({ each: true })
  public keys?: string[]
}
