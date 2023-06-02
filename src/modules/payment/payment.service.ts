import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Connection, EntityManager, Repository } from 'typeorm'
import { getUnixTime } from 'date-fns'
import { v4 as uuid } from 'uuid'
import { Stripe } from 'stripe'
import { OrderEntity, PaymentEntity } from 'lib/entities'
import { en_US } from 'lib/locale'
import { getConfig } from 'lib/config'
import { ErrorResponse, OrderStatus, PaymentStatus } from 'lib/types'
import { PaymentIntent, PaymentIntentMetadata } from './types'
import { getPaymentStatus } from './utils'
import { DEFAULT_CURRENCY, STRIPE_API_VERSION } from './constants'
import { GetPaymentIntentDao } from './dao'

const T = en_US

@Injectable()
export class PaymentService {
    private readonly client: Stripe

    constructor(
        @InjectRepository(PaymentEntity)
        private readonly paymentRepository: Repository<PaymentEntity>,
        private readonly db: Connection
    ) {
        this.client = new Stripe(getConfig().stripeConfig.secretKey, {
            apiVersion: STRIPE_API_VERSION
        })
    }

    async createPayment(orderUUID: string, totalPrice: number, userUUID: string) {
        const paymentUUID = uuid()

        const metadata: PaymentIntentMetadata = {
            paymentUUID,
            orderUUID
        }

        const succeededPayment = await this.getSucceededPayment(userUUID, orderUUID)

        if (succeededPayment) {
            const error: ErrorResponse = {
                code: HttpStatus.BAD_REQUEST,
                message: T.payment.paymentAlreadySucceeded
            }

            throw new BadRequestException(error)
        }

        const intent = (await this.client.paymentIntents.create({
            /* eslint-disable camelcase */
            amount: totalPrice,
            currency: DEFAULT_CURRENCY,
            automatic_payment_methods: {
                enabled: true
            },
            metadata
        })) as Stripe.Response<PaymentIntent>

        await this.paymentRepository.save({
            paymentUUID,
            userUUID,
            paymentIntentId: intent.id,
            amount: intent.amount,
            orderUUID
        })

        return {
            paymentIntentId: intent.id,
            clientSecret: intent.client_secret,
            orderUUID
        }
    }

    updatePaymentIntentStatus(intent: PaymentIntent, status: PaymentStatus = getPaymentStatus(intent.status)) {
        return this.db.transaction(async manager => {
            const payment = await this.getPayment(intent.metadata.paymentUUID, manager)

            if (!payment) {
                const error: ErrorResponse = {
                    code: HttpStatus.BAD_REQUEST,
                    message: T.payment.paymentNotFound
                }

                throw new BadRequestException(error)
            }

            const order = await this.findOrder(intent.metadata.reference, manager)

            if (!order) {
                const error: ErrorResponse = {
                    code: HttpStatus.BAD_REQUEST,
                    message: T.order.orderNotFound
                }

                throw new BadRequestException(error)
            }

            if (status === PaymentStatus.Succeeded) {
                return this.completePaymentOrder(payment.paymentUUID, order.orderUUID, manager)
            }

            return this.cancelPaymentOrder(payment.paymentUUID, order.orderUUID, manager)
        })
    }

    private getPayment(paymentUUID: string, manager: EntityManager) {
        const payments = manager.getRepository(PaymentEntity)

        return payments.findOne({
            where: {
                paymentUUID
            }
        })
    }

    private findOrder(reference: string, manager: EntityManager, userUUID?: string) {
        const orders = manager.getRepository(OrderEntity)

        if (userUUID) {
            return orders.findOne({
                where: {
                    reference,
                    status: OrderStatus.Processing,
                    userUUID
                }
            })
        }

        return orders.findOne({
            where: {
                reference,
                status: OrderStatus.Processing
            }
        })
    }

    private completePaymentOrder(paymentUUID: string, orderUUID: string, manager: EntityManager) {
        return Promise.all([
            manager.getRepository(PaymentEntity).save({
                paymentUUID,
                paymentDate: getUnixTime(new Date()),
                status: PaymentStatus.Succeeded
            }),
            manager.getRepository(OrderEntity).save({
                orderUUID,
                status: OrderStatus.Completed
            })
        ])
    }

    private cancelPaymentOrder(paymentUUID: string, orderUUID: string, manager: EntityManager) {
        return Promise.all([
            manager.getRepository(PaymentEntity).save({
                paymentUUID,
                paymentDate: getUnixTime(new Date()),
                status: PaymentStatus.Failed
            }),
            manager.getRepository(OrderEntity).save({
                orderUUID,
                status: OrderStatus.Cancelled
            })
        ])
    }

    private getSucceededPayment(userUUID: string, orderUUID: string) {
        return this.paymentRepository
            .createQueryBuilder('P')
            .select('P.paymentIntentId')
            .innerJoin(OrderEntity, 'O', 'O.orderUUID = P.orderUUID')
            .where('P.userUUID = :userUUID', { userUUID })
            .andWhere('O.orderUUID = :orderUUID', { orderUUID })
            .andWhere('P.paymentStatus = :paymentStatus', {
                paymentStatus: PaymentStatus.Succeeded
            })
            .getRawOne<GetPaymentIntentDao>()
    }
}
