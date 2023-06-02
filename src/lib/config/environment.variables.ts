import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'
import { NodeEnv } from './constants'

export class EnvironmentVariables {
    @IsOptional()
    @IsEnum(NodeEnv)
    readonly NODE_ENV: NodeEnv = NodeEnv.Development

    @IsOptional()
    @IsNumber()
    readonly API_PORT: number = 3000

    @IsOptional()
    @IsString()
    readonly API_HOST: string = '0.0.0.0'

    @IsOptional()
    @IsInt()
    readonly THROTTLER_TTL_S: number = 60

    @IsOptional()
    @IsInt()
    readonly THROTTLER_LIMIT: number = 100

    @IsOptional()
    @IsString()
    readonly CORS_ALLOWED_ORIGINS: string = '*'

    // default 20 MB
    @IsOptional()
    @IsInt()
    readonly MAX_FILE_SIZE_KB: number = 20 * 1024 * 1024

    @IsOptional()
    @IsString()
    readonly SERVICE_VERSION: string = 'unknown'

    @IsString()
    readonly TYPEORM_CONNECTION: 'mysql' | 'mariadb'

    @IsString()
    readonly TYPEORM_HOST: string

    @IsString()
    readonly TYPEORM_USERNAME: string

    @IsString()
    readonly TYPEORM_PASSWORD: string

    @IsString()
    readonly TYPEORM_DATABASE: string

    @IsInt()
    @IsPositive()
    readonly TYPEORM_PORT: number

    @Type(() => String)
    @IsString()
    readonly TYPEORM_SYNCHRONIZE: string = 'false'

    @Type(() => String)
    @IsString()
    readonly TYPEORM_LOGGING: string = 'false'

    @Type(() => String)
    @IsString()
    readonly TYPEORM_DEBUG: string = 'false'

    @IsOptional()
    @IsString()
    readonly TYPEORM_MIGRATIONS?: string

    @IsOptional()
    @IsString()
    readonly TYPEORM_MIGRATIONS_DIR?: string

    @IsOptional()
    @IsString()
    readonly TYPEORM_ENTITIES?: string

    @IsOptional()
    @IsString()
    readonly REDIS_HOST: string = 'localhost'

    @IsOptional()
    @IsInt()
    readonly REDIS_PORT: number = 6379

    @IsOptional()
    @IsString()
    readonly REDIS_PREFIX: string = 'order-api'

    @IsString()
    readonly ORDER_MICROSERVICE_PREFIX: string

    @IsString()
    readonly USER_MICROSERVICE_PREFIX: string

    @IsString()
    readonly JWT_TOKEN_PUBLIC_KEY: string

    @IsString()
    readonly AUTH_COOKIE_NAME: string = 'auth-token'

    @IsString()
    readonly STRIPE_SECRET_KEY: string

    @IsString()
    readonly STRIPE_PUBLISHABLE_KEY: string

    @IsString()
    readonly STRIPE_RETURN_URL: string

    @IsString()
    readonly STRIPE_WEBHOOK_SECRET: string

    @IsOptional()
    @IsString()
    readonly STRIPE_WEBHOOK_ENDPOINT: string = '/payment/webhook'
}
