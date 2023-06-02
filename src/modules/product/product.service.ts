import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProductEntity } from 'lib/entities'
import { en_US } from 'lib/locale'
import { ErrorResponse } from 'lib/types'

const T = en_US

@Injectable()
export class ProductService {
    constructor(@InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>) {}

    getProducts() {
        return this.productRepository.find()
    }

    getProduct(productUUID: string) {
        return this.productRepository.findOneOrFail({ where: { productUUID } }).catch(() => {
            const error: ErrorResponse = {
                code: HttpStatus.BAD_REQUEST,
                message: T.product.productNotFound
            }

            throw new BadRequestException(error)
        })
    }
}
