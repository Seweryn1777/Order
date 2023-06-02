import { PaymentStatus } from 'lib/types'
import { Stripe } from 'stripe'

type Status = Stripe.PaymentIntent.Status

export const getPaymentStatus = (status: Status) => {
    switch (status) {
        case 'succeeded': {
            return PaymentStatus.Succeeded
        }
        case 'canceled': {
            return PaymentStatus.Cancelled
        }
        case 'processing': {
            return PaymentStatus.Pending
        }
        case 'requires_payment_method': {
            return PaymentStatus.Failed
        }
        case 'requires_action': {
            return PaymentStatus.Pending
        }
        case 'requires_confirmation': {
            return PaymentStatus.Pending
        }
        default: {
            return PaymentStatus.Failed
        }
    }
}
