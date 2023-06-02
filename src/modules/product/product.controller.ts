import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { Roles } from 'lib/decorators'
import { Role } from 'lib/common'
import { ProductService } from './product.service'
import { PRODUCT } from './constants'

@Controller(PRODUCT)
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    @Roles(Role.Student)
    getProducts() {
        return this.productService.getProducts()
    }
}
