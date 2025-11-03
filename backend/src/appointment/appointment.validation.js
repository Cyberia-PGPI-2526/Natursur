import { check } from 'express-validator'
import { AppointmentState, SessionType } from "@prisma/client"

const timeCheck = (field) =>
    check(field)
        .exists()
        .withMessage(`${field} es requerido.`)
        .isISO8601()
        .toDate()

export const createAppointmentValidation = [
    timeCheck('appointment_date'),
    timeCheck('start_time'),
    timeCheck('end_time'),
    check('serviceId')
        .exists()
        .withMessage('serviceId es requerido.')
        .isInt({ gt: 0 })
        .toInt(),
    check('session_type')
        .exists()
        .withMessage('session_type es requerido.')
        .toUpperCase()
        .isIn(Object.values(SessionType)),
]

export const updateAppointmentValidation = [
    check('appointment_date')
        .optional()
        .isISO8601()
        .toDate(),
    check('start_time')
        .optional()
        .isISO8601()
        .toDate(),
    check('end_time')
        .optional()
        .isISO8601()
        .toDate(),
    check('serviceId')
        .optional()
        .isInt({ gt: 0 })
        .toInt(),
    check('state')
        .optional()
        .toUpperCase()
        .isIn(Object.values(AppointmentState)),
    check('session_type')
        .optional()
        .toUpperCase()
        .isIn(Object.values(SessionType))
]