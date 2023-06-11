import { ShutdownSignal, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import helmet from 'helmet'
import { json } from 'body-parser'
import { getConfig } from 'lib/config'
import { HttpMethodGuard } from 'lib/guards'
import { ContentTypeInterceptor } from 'lib/interceptors'
import { AppModule } from 'modules/app'

const bootstrap = async () => {
    const { expressConfig, validationPipeConfig, bodyParserConfig, corsConfig, redisConfig, microserviceConfig } = getConfig()
    const { port, host } = expressConfig

    const app = await NestFactory.create(AppModule)
    app.connectMicroservice({
        transport: Transport.REDIS,
        options: {
            host: redisConfig.host,
            port: redisConfig.port,
            prefix: microserviceConfig.orderMicroservicePrefix
        }
    })

    app.use(
        helmet({
            noSniff: true,
            hidePoweredBy: true
        })
    )
    app.enableCors(corsConfig)
    app.useGlobalGuards(new HttpMethodGuard())
    app.useGlobalInterceptors(new ContentTypeInterceptor())
    app.use(json(bodyParserConfig))
    app.useGlobalPipes(new ValidationPipe(validationPipeConfig))
    app.enableShutdownHooks([ShutdownSignal.SIGINT, ShutdownSignal.SIGTERM])
    await app.startAllMicroservices()

    await app.listen(port, host)
}

bootstrap()
