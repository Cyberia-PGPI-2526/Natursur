import { check } from 'express-validator'
import { AppointmentState } from "@prisma/client"

export const createAppointmentValidation = [
  check('appointment_date')
    .exists()
    .withMessage('appointment_date es requerido.'),

  check('start_hour')
    .exists()
    .withMessage('start_hour es requerido.')
    .isInt({ min: 0, max: 23 })
    .withMessage('start_hour debe ser un número entre 0 y 23'),

  check('serviceId')
    .exists()
    .withMessage('serviceId es requerido.')
    .isInt({ gt: 0 })
    .withMessage('serviceId debe ser un número entero positivo')
    .toInt()
]


export const updateAppointmentValidation = [
  check('appointment_date')
    .optional()
    .isISO8601()
    .withMessage('appointment_date debe tener formato ISO.')
    .toDate(),

  check('start_time')
    .optional()
    .isISO8601()
    .withMessage('start_time debe tener formato ISO.')
    .toDate(),

  check('serviceId')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('serviceId debe ser un número entero positivo.')
    .toInt(),

  check('state')
    .optional()
    .toUpperCase()
    .isIn(Object.values(AppointmentState))
    .withMessage(`state debe ser uno de: ${Object.values(AppointmentState).join(', ')}`)
]
