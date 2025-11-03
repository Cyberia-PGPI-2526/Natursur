import { Router } from "express"
import { checkRole, requiresAuth } from "../auth/auth.middleware.js"
import { createAppointment, deleteAppointment, getAppointment, getAppointments, getMyAppointments, updateAppointment } from "./appointment.controller.js"
import { checkAppointmentConflict } from "./appointment.middleware.js"
import { createAppointmentValidation, updateAppointmentValidation } from "./appointment.validation.js"
import { handleValidation } from "../utils/handleValidation.js"

export const appointmentRoutes = Router()

appointmentRoutes.get('/me',
    requiresAuth,
    getMyAppointments
)

appointmentRoutes.get('/',
    requiresAuth,
    checkRole("ADMIN"),
    getAppointments
)

appointmentRoutes.get('/:id',
    requiresAuth,
    getAppointment
)

appointmentRoutes.post('/',
    requiresAuth,
    checkRole("CUSTOMER"),
    createAppointmentValidation,
    handleValidation,
    checkAppointmentConflict,
    createAppointment,
)

appointmentRoutes.put('/:id', 
    requiresAuth,
    checkAppointmentConflict,
    updateAppointmentValidation,
    updateAppointmentValidation,
    updateAppointment
)

appointmentRoutes.delete('/',
    requiresAuth,
    deleteAppointment
)