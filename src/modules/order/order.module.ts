import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderEntity } from 'lib/entities'
import { ProductModule } from 'modules/product'
import { UserModule } from 'modules/user'
import { PaymentModule } from 'modules/payment'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'

@Module({
    imports: [ProductModule, UserModule, PaymentModule, TypeOrmModule.forFeature([OrderEntity])],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule {}
