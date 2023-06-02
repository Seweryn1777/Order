import { BadRequestException, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import Stripe from 'stripe'
import { Request } from 'express'
import { Public } from 'lib/decorators'
import { getConfig } from 'lib/config'
import { PaymentService } from './payment.service'
import { PAYMENT, STRIPE_API_VERSION, STRIPE_SIGNATURE } from './constants'
import { PaymentIntent } from './types'

@Controller(PAYMENT)
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Public()
    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    async handleWebhook(@Req() request: Request) {
        const { secretKey, webhookSecret } = getConfig().stripeConfig
        const client = new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION })
        const signature = request.headers[STRIPE_SIGNATURE]
        const body = request.body

        if (!signature) {
            throw new BadRequestException()
        }

        const event = await client.webhooks.constructEventAsync(body, signature, webhookSecret).catch(error => {
            throw new BadRequestException(error.message)
        })

        return this.paymentService.updatePaymentIntentStatus(event.data.object as PaymentIntent)
    }
}
