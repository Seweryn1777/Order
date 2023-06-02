import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { ConfigModule } from '@nestjs/config'
import { getConfig, envValidation } from 'lib/config'
import { HealthCheckModule } from 'modules/health-check'
import { AuthModule } from 'modules/auth'
import { OrderModule } from 'modules/order'
import { ProductModule } from 'modules/product'
import { UserModule } from 'modules/user'
import { PaymentModule } from 'modules/payment'
import { AppService } from './app.service'

@Module({
    imports: [
        AuthModule,
        OrderModule,
        ProductModule,
        PaymentModule,
        UserModule,
        HealthCheckModule,
        TypeOrmModule.forRootAsync({
            useFactory: async () => ({
                ...getConfig().typeORMConfig
            })
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            validate: envValidation,
            validationOptions: {
                allowUnknown: true,
                abortEarly: true
            }
        }),
        ThrottlerModule.forRoot(getConfig().throttlerConfig)
    ],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class AppModule {}
