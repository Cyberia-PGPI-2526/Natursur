import { prisma } from "../config/db.js"
import { addMinutes, isBefore, format, startOfDay, endOfDay } from "date-fns"

export async function getAvailableHours(req, res) {
  try {
    const { date } = req.params
    const selectedDate = new Date(date + "T00:00:00")

    const workRanges = [
      { start: 10, end: 14 },
      { start: 17, end: 22 }
    ]

    const sessionMinutes = 60

    const appointments = await prisma.appointment.findMany({
      where: {
        appointment_date: {
          gte: startOfDay(selectedDate),
          lte: endOfDay(selectedDate)
        },
        state: { notIn: ["CANCELED", "NOT_ASSISTED"] }
      },
      select: { start_time: true, end_time: true }
    })

    const blockedSlots = await prisma.blockedSlot.findMany({
      where: {
        date: {
          gte: startOfDay(selectedDate),
          lte: endOfDay(selectedDate)
        }
      }
    })

    if (blockedSlots.some(b => b.full_day)) {
      return res.json({ date, availableHours: [] })
    }

    const allHours = []
    for (const range of workRanges) {
      let time = new Date(selectedDate)
      time.setHours(range.start, 0, 0, 0)

      while (time.getHours() < range.end) {
        const end = addMinutes(time, sessionMinutes)
        allHours.push({ start: new Date(time), end })
        time = end
      }
    }

    let available = allHours.filter(slot =>
      !appointments.some(a =>
        slot.start < a.end_time && slot.end > a.start_time
      )
    )

    available = available.filter(slot =>
      !blockedSlots.some(b =>
        b.start_time && b.end_time &&
        slot.start < b.end_time && slot.end > b.start_time
      )
    )

    const availableHours = available.map(slot =>
      format(slot.start, "HH:mm")
    )

    return res.json({ date, availableHours })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Error al obtener disponibilidad" })
  }
}


export async function createBlock(req, res) {
  const { date, start_time, end_time, full_day, reason } = req.body
  try {
    const selectedDate = new Date(date + "T00:00:00Z")

    const existingFullDayBlock = await prisma.blockedSlot.findFirst({
      where: { date: selectedDate, full_day: true }
    })
    if (existingFullDayBlock) {
      return res.status(400).json({ error: "Este día ya está completamente bloqueado" })
    }

    if (full_day) {
      await prisma.blockedSlot.deleteMany({ where: { date: selectedDate } })
      const block = await prisma.blockedSlot.create({
        data: {
          date: selectedDate,
          start_time: null,
          end_time: null,
          full_day: true,
          reason
        }
      })
      return res.json(block)
    }

    const overlappingBlock = await prisma.blockedSlot.findFirst({
      where: {
        date: selectedDate,
        full_day: false,
        OR: [
          {
            AND: [
              { start_time: { lte: new Date(end_time) } },
              { end_time: { gte: new Date(start_time) } }
            ]
          }
        ]
      }
    })

    if (overlappingBlock) {
      return res.status(400).json({ error: "Ya existe un bloqueo en este rango horario" })
    }

    const block = await prisma.blockedSlot.create({
      data: {
        date: selectedDate,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        full_day: false,
        reason
      }
    })

    res.json(block)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Error al crear bloqueo" })
  }
}

export async function deleteBlock(req, res) {
  try {
    const { id } = req.params
    await prisma.blockedSlot.delete({
      where: { id: parseInt(id) }
    })
    res.json({ message: "Bloqueo eliminado correctamente" })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Error al eliminar bloqueo" })
  }
}