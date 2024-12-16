import { IsBoolean, IsIn, IsOptional, IsString } from "class-validator"

export class CookiesOptionsPartDto {
  @IsOptional()
  @IsString()
  public path?: string

  @IsOptional()
  @IsString()
  public domain?: string

  @IsOptional()
  @IsBoolean()
  public secure?: boolean

  @IsOptional()
  @IsBoolean()
  public httpOnly?: boolean

  @IsOptional()
  @IsIn(["strict", "lax", "none"])
  public sameSite?: "strict" | "lax" | "none"

  @IsOptional()
  @IsBoolean()
  public signed?: boolean

  @IsOptional()
  @IsBoolean()
  public overwrite?: boolean
}
