import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getUser, updateUser } from "../../service/users.service"
import Toast from "../../components/Toast"

const schema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    role: z.enum(["ADMIN", "CUSTOMER"], { errorMap: () => ({ message: "Rol inválido" }) }),
    password: z.string().optional().or(z.literal("")).refine(
        (val) => val === "" || val.length >= 4,
        { message: "La contraseña debe tener al menos 4 caracteres" }
    )
})

export default function User() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [toast, setToast] = useState(null)

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(schema),
    })

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUser(id)

                reset({
                    name: res.name,
                    email: res.email,
                    role: res.role,
                    password: ""
                })
            } catch {
                setError("Error al cargar el usuario")
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [id, reset])

    const onSubmit = async (data) => {
        const res = await updateUser(id, data)

        if (res.error) {
            setError(res.error)
            setToast({ message: res.error, type: "error" })
            return
        }

        setToast({ message: "Usuario actualizado exitosamente", type: "success" })
        setTimeout(() => navigate("/users"), 1500)
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-xl text-[#009BA6]">Cargando usuario...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[#009BA6]">Editar Usuario</h1>
                <p className="text-gray-600 mt-2">Modifica la información del usuario</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <form
                    className="space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre
                        </label>
                        <input
                            {...register("name")}
                            type="text"
                            id="name"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#009BA6] focus:border-transparent"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            id="email"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#009BA6] focus:border-transparent"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                            Rol
                        </label>
                        <select
                            {...register("role")}
                            id="role"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#009BA6] focus:border-transparent"
                            required
                        >
                            <option value="CUSTOMER">Cliente</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <input
                            {...register("password")}
                            type="password"
                            id="password"
                            placeholder="Dejar en blanco para mantener la actual"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#009BA6] focus:border-transparent"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        <p className="text-gray-500 text-xs mt-1">Solo completa si deseas cambiar la contraseña</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/users")}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition"
                        >
                            Cancelar
                        </button>

                        <button
                            className="flex-1 bg-[#009BA6] hover:bg-[#007a82] text-white font-semibold py-3 px-4 rounded-lg transition"
                            type="submit"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    )
}
