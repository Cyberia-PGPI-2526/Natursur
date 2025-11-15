import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { startOfDay, isBefore } from 'date-fns'
import { getBlockedSlots } from '../../service/availability.service'

export default function CalendarioDisponibilidad() {
  const navigate = useNavigate()
  const hoy = startOfDay(new Date())
  const [calendarEvents, setCalendarEvents] = useState([])
  const [blockedDates, setBlockedDates] = useState(new Set())
  const [partialBlockedDates, setPartialBlockedDates] = useState(new Set())

  useEffect(() => {
    loadBlocks()
  }, [])

  const loadBlocks = async () => {
    const data = await getBlockedSlots()
    
    const events = []
    const blockedDatesSet = new Set()
    const partialBlockedDatesSet = new Set()
    
    if (data.blockedSlots) {
      data.blockedSlots.forEach(block => {
        const date = new Date(block.date)
        const dateStr = date.toISOString().split('T')[0]
        
        if (block.full_day) blockedDatesSet.add(dateStr)
        else partialBlockedDatesSet.add(dateStr)
        
        let title = ''
        if (block.full_day) title = '🚫 Día bloqueado'
        else {
          const start = new Date(block.start_time)
          const end = new Date(block.end_time)
          title = `🚫 ${start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
        }

        events.push({
          id: `block-${block.id}`,
          title,
          start: dateStr,
          backgroundColor: '#dc2626',
          borderColor: '#dc2626',
          textColor: 'white',
          classNames: block.full_day ? ['cursor-not-allowed'] : ['cursor-pointer'],
          extendedProps: {
            type: 'block',
            full_day: block.full_day
          }
        })
      })
    }

    setCalendarEvents(events)
    setBlockedDates(blockedDatesSet)
    setPartialBlockedDates(partialBlockedDatesSet)
  }

  const handleDateClick = (arg) => {
    const fecha = new Date(arg.dateStr)

    if (fecha.getDay() === 0 || fecha.getDay() === 6 || isBefore(fecha, hoy)) {
      alert('No se puede seleccionar sábados, domingos o días pasados.')
      return
    }

    if (blockedDates.has(arg.dateStr)) {
      alert('Este día está completamente bloqueado y no está disponible para reservas.')
      return
    }

    // SOLO enviamos YYYY-MM-DD
    const dateParam = fecha.toISOString().split("T")[0]
    navigate(`/availability/${dateParam}`)
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-[#009BA6] mb-4 text-center">
        Calendario de Disponibilidad
      </h2>
      <p className="text-gray-600 text-sm text-center mb-4">
        Selecciona un día para ver las horas disponibles. Los días en rojo están bloqueados.
      </p>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={false}
        events={calendarEvents}
        dateClick={handleDateClick}
        headerToolbar={{ left: 'prev', center: 'title', right: 'next' }}
        locale={esLocale}
        height="auto"
      />
    </div>
  )
}
