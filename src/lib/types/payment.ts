export enum PaymentStatus {
    Created = 'Created',
    Pending = 'Pending',
    Cancelled = 'Cancelled',
    Succeeded = 'Succeeded',
    Failed = 'Failed'
}

export enum PaymentEventType {
    Processing = 'payment_intent.processing',
    Succeeded = 'payment_intent.succeeded',
    Failed = 'payment_intent.payment_failed',
    Cancelled = 'payment_intent.cancelled'
}
