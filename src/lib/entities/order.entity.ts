import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { OrderStatus } from 'lib/types'
import { PaymentEntity } from './payment.entity'

@Entity({ name: 'Order' })
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid')
    orderUUID: string

    @Index()
    @Column()
    studentUUID: string

    @Index()
    @Column()
    productUUID: string

    @Column()
    quantity: number

    @Column()
    status: OrderStatus

    @CreateDateColumn({ select: false })
    createdAt: Date

    @UpdateDateColumn({ select: false })
    updatedAt: Date

    @OneToMany(() => PaymentEntity, payment => payment.order)
    payments: Array<PaymentEntity>
}
