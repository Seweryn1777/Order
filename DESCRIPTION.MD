## Order microservice
Order microservice is a key component of the language platform application based on microservice architecture
and NestJS framework. It consists of three modules: Order, Payment and Product. Below is a brief description
of the functions of this microservice:

Order module: this module deals with order management in the application. It allows you to create new orders,
view their details, update their status and other order-related operations. It works in close cooperation with
Payment and Product modules to handle payment and product management.

Payment module: this module was created using Stripe library, which is a popular online payment processing tool.
The Payment module handles the payment process of orders, connecting to the Stripe API to process transactions.
It allows you to accept payments from customers for ordered products and manage payment-related aspects.


## Code example

Creating an order:

```javascript
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
```

Creating payment:

```javascript
    async createPayment(orderUUID: string, totalPrice: number, userUUID: string) {
        const paymentUUID = uuid()

        const metadata: PaymentIntentMetadata = {
            paymentUUID,
            orderUUID
        }

        const succeededPayment = await this.getSucceededPayment(userUUID, orderUUID)

        if (succeededPayment) {
            const error: ErrorResponse = {
                code: HttpStatus.BAD_REQUEST,
                message: T.payment.paymentAlreadySucceeded
            }

            throw new BadRequestException(error)
        }

        const intent = (await this.client.paymentIntents.create({
            amount: totalPrice,
            currency: DEFAULT_CURRENCY,
            automatic_payment_methods: {
                enabled: true
            },
            metadata
        })) as Stripe.Response<PaymentIntent>

        await this.paymentRepository.save({
            paymentUUID,
            userUUID,
            paymentIntentId: intent.id,
            amount: intent.amount,
            orderUUID
        })

        return {
            paymentIntentId: intent.id,
            clientSecret: intent.client_secret,
            orderUUID
        }
    }
```

Payment webhook:

```javascript
    @Public()
    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    async handleWebhook(@Req() request: Request) {
        const { secretKey, webhookSecret } = getConfig().stripeConfig
        const client = new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION })
        const signature = request.headers[STRIPE_SIGNATURE]
        const body = request.body

        if (!signature) {
            throw new BadRequestException()
        }

        const event = await client.webhooks.constructEventAsync(body, signature, webhookSecret).catch(error => {
            throw new BadRequestException(error.message)
        })

        return this.paymentService.updatePaymentIntentStatus(event.data.object as PaymentIntent)
    }
```
