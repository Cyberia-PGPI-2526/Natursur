import { check } from 'express-validator'
import { AppointmentState } from "@prisma/client"

const timeCheck = (field) =>
    check(field)
        .exists()
        .isISO8601()
        .toDate()


export const createAppointmentValidation = [
    timeCheck('appointment_date'),
    timeCheck('start_time'),
    timeCheck('end_time'),
    check('serviceId').exists().isInt({ gt: 0 }).toInt()
]


export const updateAppointmentValidation = [
    check('appointment_date').optional().isISO8601().toDate(),
    check('start_time').optional().isISO8601().toDate(),
    check('end_time').optional().isISO8601().toDate(),
    check('serviceId').optional().isInt({ gt: 0 }).toInt(),
    check('state').optional().toUpperCase().isIn([
        AppointmentState.PENDING,
        AppointmentState.CONFIRMED,
        AppointmentState.CANCELED,
        AppointmentState.COMPLETED,
        AppointmentState.NOT_ASSISTED
    ]),
]