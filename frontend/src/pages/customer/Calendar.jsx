import React from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { startOfDay, isBefore } from 'date-fns';

export default function CalendarioDisponibilidad() {
  const navigate = useNavigate();
  const hoy = startOfDay(new Date());

  const handleDateClick = (arg) => {
    const fecha = new Date(arg.dateStr);

    // Bloquear fines de semana y días pasados
    if (fecha.getDay() === 0 || fecha.getDay() === 6 || isBefore(fecha, hoy)) {
      alert('No se puede seleccionar sábados, domingos o días pasados.');
      return;
    }

    // Redirige a página de disponibilidad
    navigate(`/availability/${fecha.toISOString()}`)
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-[#009BA6] mb-4 text-center">
        Calendario de Disponibilidad
      </h2>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={false} // quita sábados y domingos
        dateClick={handleDateClick}
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next',
        }}
        locale={esLocale} // días y meses en español
        buttonText={{
          prev: 'Anterior',
          next: 'Siguiente',
          today: 'Hoy',
          month: 'Mes',
        }}
        height="auto"
        dayCellClassNames={(arg) => {
          const fecha = new Date(arg.date);
          const isPast = isBefore(fecha, hoy);
          return isPast
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'hover:bg-gray-200 hover:text-white cursor-pointer transition';
        }}
        dayCellContent={(arg) => (
          <div className="flex justify-center items-center h-full">{arg.dayNumberText}</div>
        )}
      />
    </div>
  );
}
