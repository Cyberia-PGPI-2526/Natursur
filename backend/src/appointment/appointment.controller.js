import { prisma } from "../config/db.js"

export async function getMyAppointments(req, res) {
    try {
        console.log("corre my appointments")
        const userId = req.user.userId
        let { page = 1, limit = 10 } = req.query
        page = parseInt(page)
        limit = parseInt(limit)
        const skip = (page - 1) * limit

        const [appointments, total] = await Promise.all([
            prisma.appointment.findMany({
                where: { clientId: userId },
                skip,
                take: limit,
                include: {
                    client: {
                        select: { id: true, name: true, email: true }
                    },
                    service: {
                        select: { id: true, name: true }
                    }
                },
                orderBy: {
                    appointment_date: 'desc'
                }
            }),
            prisma.appointment.count({ where: { clientId: userId } })
        ])

        return res.json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            appointments
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Server error" })
    }
}

export async function getAppointments(req, res) {
    try {
        let { page = 1, limit = 10, clientId, state } = req.query
        page = parseInt(page)
        limit = parseInt(limit)
        const skip = (page - 1) * limit

        const where = {}
        if (clientId) {
            where.clientId = parseInt(clientId)
        }
        if (state) {
            where.state = state.toUpperCase()
        }
        
        const [appointments, total] = await Promise.all([
            prisma.appointment.findMany({
                where,
                skip,
                take: limit,
                include: {
                    client: {
                        select: { id: true, name: true, email: true }
                    },
                    service: {
                        select: { id: true, name: true, duration_minutes: true, price_cents: true }
                    }
                },
                orderBy: {
                    appointment_date: 'desc'
                }
            }),
            prisma.appointment.count({ where })
        ])

        return res.json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            appointments
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Server error" })
    }
}

export async function getAppointment(req, res) {
    try {
        const appointmentId = parseInt(req.params.id)
        const loggedInUserId = req.user.userId
        const loggedInUserRole = req.user.role

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                client: {
                    select: { id: true, name: true, email: true, phone_number: true }
                },
                service: true
            }
        })

        if (!appointment) return res.status(404).json({ message: "Appointment not found" })

        if (loggedInUserRole !== 'ADMIN' && appointment.clientId !== loggedInUserId) {
            return res.status(403).json({ message: "Access denied. You can only view your own appointments." })
        }

        return res.json(appointment)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Server error getting appointment" })
    }
}

export async function createAppointment(req, res) {
    try {
        const userId = req.user.userId
        const { appointment_date, start_time, end_time, serviceId, session_type } = req.body

        const newAppointment = await prisma.appointment.create({
            data: {
                appointment_date: new Date(appointment_date),
                start_time: new Date(start_time),
                end_time: new Date(end_time),
                clientId: userId,
                serviceId: parseInt(serviceId),
                session_type: session_type.toUpperCase()
            }
        })

        return res.status(201).json(newAppointment)
    } catch (error) {
        if (error.code === 'P2003') {
           return res.status(400).json({ message: "Client or Service not found (Invalid clientId or serviceId)" })
        }
        if (error.code === 'P2002') {
           return res.status(400).json({ message: "A client already has an appointment at this date and time" })
        }
        console.error(error)
        return res.status(500).json({ message: "Server error creating appointment" })
    }
}

export async function updateAppointment(req, res) {
    try {
        const appointmentId = parseInt(req.params.id)
        const loggedInUserId = req.user.userId
        const loggedInUserRole = req.user.role
        const { appointment_date, start_time, end_time, serviceId, state, session_type } = req.body

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        })

        if (!appointment) return res.status(404).json({ message: "Appointment not found" })

        if (loggedInUserRole !== 'ADMIN' && appointment.clientId !== loggedInUserId) {
            return res.status(403).json({ message: "Access denied. You can only update your own appointments." })
        }

        const dataToUpdate = {}

        if (appointment_date) dataToUpdate.appointment_date = new Date(appointment_date)
        if (start_time) dataToUpdate.start_time = new Date(start_time)
        if (end_time) dataToUpdate.end_time = new Date(end_time)
        if (serviceId) dataToUpdate.serviceId = parseInt(serviceId)
        if (session_type) dataToUpdate.session_type = session_type.toUpperCase()

        // Restricción: Solo el ADMIN puede cambiar el estado de la cita
        if (state) {
            if (loggedInUserRole === 'ADMIN') {
                dataToUpdate.state = state.toUpperCase()
            } else {
                return res.status(403).json({ message: "Access denied. Only administrators can change the appointment state." })
            }
        }
        
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" })
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id: appointmentId },
            data: dataToUpdate
        })

        return res.json({ message: "Appointment updated successfully", appointment: updatedAppointment })
    } catch (error) {
        if (error.code === 'P2003') {
           return res.status(400).json({ message: "Service not found (Invalid serviceId)" })
        }
        if (error.code === 'P2002') {
           return res.status(400).json({ message: "Another appointment already exists at this date and time for this client" })
        }
        console.error(error)
        return res.status(500).json({ message: "Server error" })
    }
}

export async function deleteAppointment(req, res) {
    try {
        const appointmentId = parseInt(req.params.id)
        const loggedInUserRole = req.user.role

        if (loggedInUserRole !== 'ADMIN') {
            return res.status(403).json({ message: "Access denied. Only administrators can delete appointments." })
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        })

        if (!appointment) return res.status(404).json({ message: "Appointment not found" })

        await prisma.appointment.delete({
            where: { id: appointmentId }
        })

        return res.json({ message: "Appointment deleted successfully" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Server error deleting appointment" })
    }
}