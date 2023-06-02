import { SetMetadata } from '@nestjs/common'
import { Role, DecoratorName } from 'lib/common'

export const Roles = (...roles: Array<Role>) => SetMetadata(DecoratorName.Roles, roles)
