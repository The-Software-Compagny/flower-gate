import { IsBoolean, IsOptional } from "class-validator"

export class FeaturePartDto {
  [key: string]: unknown

  @IsOptional()
  @IsBoolean()
  public enabled?: boolean = false
}
