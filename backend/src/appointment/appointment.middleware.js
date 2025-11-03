import { prisma } from "../config/db.js"

export async function checkAppointmentConflict(req, res, next) {
    try {
        const { start_time, end_time } = req.body;

        const appointmentId = req.params.id; 

        const newStartTime = new Date(start_time);
        const newEndTime = new Date(end_time);

        if (newEndTime <= newStartTime) {
            return res.status(400).json({ message: "La hora de finalización debe ser posterior a la hora de inicio." });
        }

        const conflictQuery = {
            end_time: { gt: newStartTime }, 
            start_time: { lt: newEndTime }, 
        }

        if (appointmentId) {
            conflictQuery.id = { not: parseInt(appointmentId) };
        }

        const existingConflict = await prisma.appointment.findFirst({
            where: conflictQuery
        });

        if (existingConflict) {
            return res.status(409).json({ message: "The dates cannot overlap."});
        }

        next()
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Server error" })
    }
}