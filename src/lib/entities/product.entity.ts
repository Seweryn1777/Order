import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'Product' })
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    productUUID: string

    @Column()
    name: string

    @Column()
    price: number

    @CreateDateColumn({ select: false })
    createdAt: Date

    @UpdateDateColumn({ select: false })
    updatedAt: Date
}
