import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AdapterFactory } from 'oidc-provider'
import { OidcConfiguration, OidcModuleOptions, OidcModuleOptionsFactory } from 'nest-oidc-provider'
import { StorageAdapter } from '~/storage/storage.adapter'
import { IORedisService } from '~/storage/_services/io-redis.service'
// import { KEYSTORE_FILE_PATH } from '~/setup/jose'

@Injectable()
export class OidcConfigService implements OidcModuleOptionsFactory, OnModuleInit {
  private readonly logger = new Logger(OidcConfigService.name)

  public constructor(
    private readonly dbService: IORedisService,
    private readonly configService: ConfigService,
  ) { }

  public async onModuleInit() {
    //TODO: parse and validate the configuration yml file
    this.logger.debug('onModuleInit')
  }

  public createModuleOptions(): OidcModuleOptions | Promise<OidcModuleOptions> {
    return {
      issuer: this.configService.get('oidc.issuer'),
      oidc: this.getConfiguration(),
      path: '/oidc',
      // proxy: true,
    }
  }

  public createAdapterFactory(): AdapterFactory | Promise<AdapterFactory> {
    return (modelName: string) => new StorageAdapter(modelName, this.dbService)
  }

  /**
   * @see https://github.com/panva/node-oidc-provider/blob/main/docs/README.md#configuration-options
   * @returns OidcConfiguration
   */
  public getConfiguration(): OidcConfiguration {
    // const jwks = JSON.parse(readFileSync(KEYSTORE_FILE_PATH, 'utf8'))

    return {
      clients: [
        {
          client_id: 'test',
          client_secret: 'test',
          grant_types: [
            'implicit',
            // 'client_credentials',
            'authorization_code',
            'refresh_token',
            'urn:ietf:params:oauth:grant-type:device_code',
          ],
          token_endpoint_auth_method: 'none',
          // application_type: 'web',
          response_types: ['code'],
          redirect_uris: [
            'https://oidcdebugger.com/debug',
            'https://127.0.0.1:3000/login',
            'https://127.0.0.1:3000/',
            'https://psteniusubi.github.io/oidc-tester/authorization-code-flow.html',
          ],
        },
      ],
      features: {
        devInteractions: { enabled: false },
        userinfo: { enabled: true },
        jwtUserinfo: { enabled: true },
        deviceFlow: { enabled: true },
        // clientCredentials: { enabled: true },
        revocation: { enabled: true },
        introspection: {
          enabled: true,
          allowedPolicy: (ctx, client, token) => {
            this.logger.debug('introspection allowedPolicy', {
              ctx,
              client,
              token,
            })
            if (
              client.introspectionEndpointAuthMethod === 'none' &&
              token.clientId !== ctx.oidc.client?.clientId
            ) {
              return false
            }
            return true
          },
        },
        resourceIndicators: {
          enabled: true,
          /**
           * Enable JWT access tokens if resource match with issuer
           * @param ctx Koa request context
           * @returns string | undefined
           */
          defaultResource: (ctx) => {
            //TODO: check if this is correct or enabled
            return ctx.oidc.issuer
          },
          /**
           * Depending on the request's grant_type this can be either an  model instance
           * @param ctx Koa request context
           * @param model AuthorizationCode, BackchannelAuthenticationRequest, RefreshToken or DeviceCode
           * @returns boolean
           */
          useGrantedResource: () => {
            //TODO: check if this is correct or enabled
            return true
          },
          getResourceServerInfo: (ctx, resourceIndicator, client) => {
            this.logger.debug(
              'getResourceServerInfo',
              ctx,
              resourceIndicator,
              client,
            )
            return {
              scope: 'openid',
              audience: 'solid',
              accessTokenTTL: 2 * 60 * 60, // 2 hours
              accessTokenFormat: 'jwt',
              jwt: {
                sign: { alg: 'RS256' },
              },
            }
          },
        },
        encryption: { enabled: true },
      },
      claims: {
        openid: ['sub'],
        profile: ['name'],
      },
      pkce: {
        methods: ['S256'],
        required: () => true,
      },
      issueRefreshToken: (ctx, client, code) => {
        return (
          client.grantTypeAllowed('refresh_token') &&
          (code.scopes.has('offline_access') ||
            code.scopes.has('openid') ||
            code.scopes.has('token'))
        )
      },
      interactions: {
        url(_, interaction) {
          return `/interaction/${interaction.uid}`
        },
      },
      /**
       * @see https://github.com/panva/node-oidc-provider-example/blob/main/01-oidc-configured/generate-keys.js
       */
      // jwks,
      findAccount: async (ctx, id, token) => {
        console.log('findAccount', id, token)
        // const account = {} as any
        return {
          emailVerified: true,
          email: 'ebrahimmfadae@gmail.com',
          accountId: id,
          aaa: 'bbb',
          async claims(_, scope) {
            console.log('claims', scope)
            return {
              sub: id,
              email: id,
              family_name: '1',
              name: '1',
              // email: account.email,
              // email_verified: account.email_verified,
              // name: account.name,
              // given_name: account.given_name,
              // family_name: account.family_name,
              // picture: account.picture,
              // locale: account.locale,
              // updated_at: account.updated_at,
            }
          },
        }
      },
      ...this.configService.get<OidcConfiguration>('oidc'),
    }
  }
}
