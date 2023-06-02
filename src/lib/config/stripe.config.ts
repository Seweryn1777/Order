import { EnvironmentVariables } from './environment.variables'

export const stripeConfig = (configEnvs: EnvironmentVariables) => ({
    secretKey: configEnvs.STRIPE_SECRET_KEY,
    publishableKey: configEnvs.STRIPE_PUBLISHABLE_KEY,
    returnUrl: configEnvs.STRIPE_RETURN_URL,
    webhookSecret: configEnvs.STRIPE_WEBHOOK_SECRET,
    webhookEndpoint: configEnvs.STRIPE_WEBHOOK_ENDPOINT
})
