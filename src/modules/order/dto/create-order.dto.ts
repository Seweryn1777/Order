import { IsInt, IsNumber, IsPositive, IsUUID } from 'class-validator'

export class CreateOrderDto {
    @IsUUID(4)
    readonly productUUID: string

    @IsInt()
    @IsPositive()
    readonly quantity: number
}
