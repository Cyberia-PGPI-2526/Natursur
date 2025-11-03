import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Availability() {
  const { date } = useParams();
  const navigate = useNavigate();
  const selectedDate = new Date(date);

  // Ejemplo: horas disponibles
  const [hours] = useState(['09:00', '10:00', '11:00', '14:00', '15:00']);
  const [treatment, setTreatment] = useState('');

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg">
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-[#009BA6] font-medium hover:text-[#00777F] transition"
      >
        ← Volver al calendario
      </button>

      <h2 className="text-2xl font-bold text-[#009BA6] mb-4 text-center">
        Horas disponibles para {selectedDate.toLocaleDateString()}
      </h2>

      {/* Select de tratamiento */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Tipo de tratamiento</label>
        <select
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009BA6]"
        >
          <option value="">Selecciona un tratamiento</option>
          <option value="Fisioterapia">Fisioterapia</option>
          <option value="Magnetoterapia">Magnetoterapia</option>
          <option value="Osteopatía">Osteopatía</option>
        </select>
      </div>

      {/* Horas disponibles en columna */}
      <div className="flex flex-col gap-3">
        {hours.map((hour) => (
          <button
            key={hour}
            className="w-full px-4 py-2 bg-[#009BA6] text-white rounded hover:bg-[#00777F] transition text-center"
          >
            {hour}
          </button>
        ))}
      </div>
    </div>
  );
}
