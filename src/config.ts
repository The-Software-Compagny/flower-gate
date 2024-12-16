import { RedisOptions } from 'ioredis'
import { HelmetOptions } from 'helmet'
import { OidcConfiguration } from 'nest-oidc-provider'

export interface MongoosePlugin {
  package: string
  enabled?: boolean
  options?: Record<string, any>
}
export interface ConfigInstance {
  helmet: HelmetOptions
  oidc: OidcConfiguration & {
    issuer: string
  }
  ioredis: {
    uri: string;
    options: RedisOptions
  }
}

export default async (): Promise<ConfigInstance> => {
  return {
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          objectSrc: ["'self'"],
          frameSrc: ["'self'"],
          styleSrc: ["'self'"],
          fontSrc: ["'self'"],
          imgSrc: ["'self'"],
          scriptSrc: ["'self'"],
        },
      },
    },
    oidc: {
      issuer: process.env.OIDC_ISSUER,
      // clients: [],
      ttl: {
        AccessToken: 3600,
        AuthorizationCode: 600,
        ClientCredentials: 600,
        IdToken: 3600,
        RefreshToken: 1209600,
      },
      cookies: {
        keys: [
          'gQMQym96H64-QInq7mvVX0nZEw0qUmcTA3bCpfnuR1h3YXNhgGJ0XLd17obmV8Gm',
        ],
      },
    },
    ioredis: {
      uri: process.env.OIDC_IOREDIS_URI,
      options: {
        showFriendlyErrorStack: true,
        maxRetriesPerRequest: null,
      },
    },
  }
}
