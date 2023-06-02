import { Transport } from '@nestjs/microservices'
import { EnvironmentVariables } from './environment.variables'
import { redisConfig } from './redis.config'

export const microserviceConfig = (configEnvs: EnvironmentVariables) => ({
    orderMicroservicePrefix: configEnvs.ORDER_MICROSERVICE_PREFIX,
    userMicroservicePrefix: configEnvs.USER_MICROSERVICE_PREFIX
})
