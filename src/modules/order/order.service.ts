import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import currency from 'currency.js'
import { OrderEntity } from 'lib/entities'
import { en_US } from 'lib/locale'
import { ErrorResponse, OrderStatus } from 'lib/types'
import { Role } from 'lib/common'
import { UserService } from 'modules/user'
import { ProductService } from 'modules/product'
import { PaymentService } from 'modules/payment'
import { CreateOrderDto } from './dto'
import { GetStudentOrdersQuantityDao } from './dao'

const T = en_US

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
        private readonly productService: ProductService,
        private readonly userService: UserService,
        private readonly paymentService: PaymentService
    ) {}

    async createOrder(dto: CreateOrderDto, studentUUID: string) {
        const product = await this.productService.getProduct(dto.productUUID)
        const student = await this.userService.getUser({ userUUID: studentUUID, role: Role.Student })

        if (!student) {
            const error: ErrorResponse = {
                code: HttpStatus.BAD_REQUEST,
                message: T.user.studentNotFound
            }

            throw new BadRequestException(error)
        }

        const orderUUID = await this.orderRepository
            .save({
                quantity: dto.quantity,
                productUUID: product.productUUID,
                studentUUID,
                status: OrderStatus.Processing
            })
            .then(res => res.orderUUID)

        const totalPrice = currency(product.price).multiply(dto.quantity).value

        return this.paymentService.createPayment(orderUUID, totalPrice, studentUUID)
    }

    async getStudentTotalQuantity(studentUUID: string) {
        return this.orderRepository
            .createQueryBuilder('O')
            .select('SUM(O.quantity) AS totalQuantity')
            .where('O.studentUUID = :studentUUID', { studentUUID })
            .andWhere('O.status = :status', { status: OrderStatus.Completed })
            .getRawOne<GetStudentOrdersQuantityDao>()
    }
}
