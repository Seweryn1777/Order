import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaymentEntity } from 'lib/entities'
import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'

@Module({
    imports: [TypeOrmModule.forFeature([PaymentEntity])],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService]
})
export class PaymentModule {}
