import { Column, CreateDateColumn, Entity, Generated, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { DBTypes, Nullable, PaymentStatus } from 'lib/types'
import { OrderEntity } from './order.entity'

@Entity({ name: 'payment' })
export class PaymentEntity {
    @PrimaryGeneratedColumn('uuid')
    paymentUUID: string

    @Index()
    @Column({
        nullable: true,
        type: DBTypes.VarChar
    })
    paymentIntentId: Nullable<string>

    @Index()
    @Column()
    userUUID: string

    @Index()
    @Column()
    orderUUID: string

    @Column({
        type: DBTypes.Enum,
        enum: PaymentStatus
    })
    paymentStatus: PaymentStatus

    @Column({
        type: DBTypes.Decimal,
        precision: 8,
        scale: 2
    })
    amount: number

    @Column({
        type: DBTypes.Int,
        nullable: true
    })
    paymentDate: Nullable<number>

    @CreateDateColumn({ select: false })
    createdAt: Date

    @UpdateDateColumn({ select: false })
    updatedAt: Date

    @ManyToOne(() => OrderEntity, order => order.payments)
    @JoinColumn({ name: 'orderId' })
    order: OrderEntity
}
