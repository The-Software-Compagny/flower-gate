import { IsBoolean, IsEnum, IsOptional, ValidateNested } from 'class-validator'
import { FeaturePartDto } from './feature.part.dto'

export class FeaturesPartDto {
  [key: string]: unknown

  @IsOptional()
  @ValidateNested()
  public devInteractions?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public claimsParameter?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public clientCredentials?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public introspection?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public revocation?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public userinfo?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public jwtUserinfo?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public encryption?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public registration?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public registrationManagement?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public deviceFlow?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public requestObjects?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public dPoP?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public backchannelLogout?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public fapi?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public ciba?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public webMessageResponseMode?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public jwtIntrospection?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public jwtResponseModes?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public pushedAuthorizationRequests?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public rpInitiatedLogout?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public mTLS?: FeaturePartDto

  @IsOptional()
  @ValidateNested()
  public resourceIndicators?: FeaturePartDto
}
