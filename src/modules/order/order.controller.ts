import { Controller, Post, Body, HttpCode, HttpStatus, Req } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Roles, UserDecorator } from 'lib/decorators'
import { Role, OrderMicroserviceCommand } from 'lib/common'
import { User } from 'lib/types'
import { OrderService } from './order.service'
import { CreateOrderDto } from './dto'
import { ORDER } from './constants'

@Controller(ORDER)
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @MessagePattern({ cmd: OrderMicroserviceCommand.GetStudentTotalQuantity })
    getStudentTotalQuantity(@Payload() studentUUID: string) {
        return this.orderService.getStudentTotalQuantity(studentUUID)
    }

    @Post()
    @Roles(Role.Student)
    createOrder(@Body() dto: CreateOrderDto, @UserDecorator() user: User) {
        return this.orderService.createOrder(dto, user.userUUID)
    }
}
