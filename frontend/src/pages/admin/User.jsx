import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getUser, updateUser } from "../../service/users.service"

const schema = z.object({
    name: z.string().min(2, "Name must have at least two characters"),
    email: z.email("Invalid email"),
    role: z.enum(["ADMIN", "CUSTOMER"], { errorMap: () => ({ message: "Invalid role" }) }),
    password: z.string().optional().or(z.literal("")).refine(
        (val) => val === "" || val.length >= 4,
        { message: "Password must have at leats 4 characters" }
    )
})

export default function User() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

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

        console.log(res)

        if (res.error) {
            setError(res.error)
            return
        }

        navigate("/users")
    }

    if (isLoading) {
        return <p className="text-center mt-10">Cargando usuario...</p>
    }

    return (
        <div className="flex items-center justify-center mt-4 p-4">
            <form
                className="flex flex-col w-full max-w-md md:max-w-lg lg:max-w-xl space-y-4 bg-white p-6 rounded shadow"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="text-xl font-bold text-gray-800 text-center">Edit User</h2>

                <div className="flex flex-col w-full">
                    <label htmlFor="name" className="mb-2 font-medium text-gray-700">Name</label>
                    <input
                        {...register("name")}
                        type="text"
                        id="name"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    {errors.name && <p className="text-red-500 text-center">{errors.name.message}</p>}
                </div>

                <div className="flex flex-col w-full">
                    <label htmlFor="email" className="mb-2 font-medium text-gray-700">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        id="email"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    {errors.email && <p className="text-red-500 text-center">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col w-full">
                    <label htmlFor="role" className="mb-2 font-medium text-gray-700">Rol</label>
                    <select
                        {...register("role")}
                        id="role"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-center">{errors.role.message}</p>}
                </div>

                <div className="flex flex-col w-full">
                    <label htmlFor="email" className="mb-2 font-medium text-gray-700">Password</label>
                    <input
                        {...register("password")}
                        type="password"
                        id="password"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.email && <p className="text-red-500 text-center">{errors.password.message}</p>}
                </div>

                {error && (
                    <p className="text-red-500 text-center">{error}</p>
                )}

                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={() => navigate("/users")}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        Cancel
                    </button>

                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                        type="submit"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}
