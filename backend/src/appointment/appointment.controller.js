import { prisma } from "../config/db.js"

export async function getMyAppointments(req, res) {
  try {
    const userId = req.user.userId
    let { page = 1, limit = 10 } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    const skip = (page - 1) * limit

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where: { userId },
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
      prisma.appointment.count({ where: { userId } })
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
    let { page = 1, limit = 10 } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    const skip = (page - 1) * limit

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
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
      prisma.appointment.count({ where: { userId } })
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
        const loggedInUserRole = req.user.role // Asumo que el rol está en req.user

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
    const { appointment_date, start_time, end_time, serviceId } = req.body

    const apptDate = new Date(appointment_date)
    const startTime = new Date(start_time)
    const endTime = new Date(end_time)

    const newAppointment = await prisma.appointment.create({
      data: {
        appointment_date: apptDate,
        start_time: startTime,
        end_time: endTime,
        clientId: userId,
        serviceId: parseInt(serviceId),
      }
    })

    return res.status(201).json(newAppointment)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error creating appointment" })
  }
}

export async function updateAppointment(req, res) {
    try {
        const appointmentId = parseInt(req.params.id)
        const loggedInUserId = req.user.userId
        const loggedInUserRole = req.user.role
        const { appointment_date, start_time, end_time, serviceId, state } = req.body

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
        
        if (state) {
            if (loggedInUserRole === 'ADMIN') {
                dataToUpdate.state = state.toUpperCase()
            } else {
                if (state.toUpperCase() !== 'CANCELED') {
                     return res.status(403).json({ message: "Customers can only attempt to cancel their appointments." })
                }
                dataToUpdate.state = 'CANCELED'
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
        console.error(error)
        return res.status(500).json({ message: "Server error" })
    }
}


export async function deleteAppointment(req, res) {
  try {
    const appointmentId = req.params.id

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId) }
    })

    if (!appointment) return res.status(404).json({ message: "Appointment not found" })

    await prisma.appointment.delete({
      where: { id: parseInt(appointmentId) }
    })

    return res.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error deleting appointment" })
  }
}