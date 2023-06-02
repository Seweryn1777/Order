import { Role } from 'lib/common'

export enum UserMicroserviceCommand {
    GetUser = 'get-user',
    GetStudentTotalQuantity = 'get-student-total-quantity',
    GetTeacher = 'get-teacher'
}

export type GetUser = {
    userUUID: string
    role: Role
}

export type User = {
    userUUID: string
    firstName: string
    lastName: string
    email: string
    role: Role
}

export type StudentOrdersQuantity = {
    totalQuantity: number
}
