import { IsNumber, IsOptional } from "class-validator"

export class TtlPartDto {
  [key: string]: unknown

  @IsOptional()
  @IsNumber()
  public AccessToken?: number

  @IsOptional()
  @IsNumber()
  public AuthorizationCode?: number

  @IsOptional()
  @IsNumber()
  public ClientCredentials?: number

  @IsOptional()
  @IsNumber()
  public DeviceCode?: number

  @IsOptional()
  @IsNumber()
  public BackchannelAuthenticationRequest?: number

  @IsOptional()
  @IsNumber()
  public IdToken?: number

  @IsOptional()
  @IsNumber()
  public RefreshToken?: number

  @IsOptional()
  @IsNumber()
  public Interaction?: number

  @IsOptional()
  @IsNumber()
  public Session?: number

  @IsOptional()
  @IsNumber()
  public Grant?: number
}
