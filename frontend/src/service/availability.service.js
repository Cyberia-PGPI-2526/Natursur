import { api } from "./api"

export const getAvailableHours = async (date) => {
  try {
    const formattedDate = date.split("T")[0]
    const response = await api.get(`availability/${formattedDate}`)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error("Error al obtener horas disponibles:", error)
    return { availableHours: [], error: "No se pudieron cargar las horas disponibles" }
  }
}

export const createBlock = async (data) => {
  try {
    const response = await api.post("/availability/block", data)
    return response.data
  } catch (error) {
    console.error("Error al crear bloqueo:", error)

    if (error.response) {
      const status = error.response.status
      const msg = error.response.data?.error || "Error inesperado"
      return { error: msg, status }
    }

    return { error: "Error de conexión con el servidor" }
  }
}

export const deleteBlock = async (id) => {
  try {
    const response = await api.delete(`/availability/block/${id}`)
    return response.data
  } catch (error) {
    console.error("Error al eliminar bloqueo:", error)

    if (error.response) {
      const status = error.response.status
      const msg = error.response.data?.error || "Error inesperado"
      return { error: msg, status }
    }

    return { error: "Error de conexión con el servidor" }
  }
}
