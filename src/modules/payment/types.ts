import Stripe from 'stripe'

export interface PaymentIntentMetadata extends Stripe.Metadata {
    paymentUUID: string
    orderUUID: string
}

export interface PaymentIntent extends Stripe.PaymentIntent {
    metadata: PaymentIntentMetadata
}
