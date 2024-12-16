import { IsOptional, IsString } from "class-validator"

export class CookiesNamesPartDto {
  @IsOptional()
  @IsString()
  public session?: string

  @IsOptional()
  @IsString()
  public interaction?: string

  @IsOptional()
  @IsString()
  public resume?: string

  @IsOptional()
  @IsString()
  public state?: string
}
