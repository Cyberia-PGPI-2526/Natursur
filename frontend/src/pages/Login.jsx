import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginUser } from "../service/auth.service"
import { useAuthStore } from "../store/authStore"

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string()
})

export default function Login() {
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    const res = await loginUser(data)

    if (res.error) {
      setError(res.error)
      return
    }

    useAuthStore.getState()
      .login({
        token: res.token,
        userId: res.userId,
        role: res.role
      })

    navigate("/")
  }

  const showPassword = () => {
    const input = document.getElementById('password')
    input.type == 'text' ? input.type = 'password' : input.type = 'text'
  }

  return (
    <div className="flex items-center justify-center mt-4 p-4">
      <form
        className="flex flex-col w-full max-w-md md:max-w-lg lg:max-w-xl space-y-4 bg-white p-6 rounded shadow"
        onSubmit={handleSubmit(onSubmit)}
      >

        <h2 className="text-xl font-bold text-gray-800 text-center">Login</h2>

        <div className="flex flex-col w-full">
          <label htmlFor="email" className="mb-2 font-medium text-gray-700" >Email</label>
          <input
            {...register("email")}
            type="text"
            name="email"
            id="email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {errors.email && <p className="text-red-500 text-center">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="password" className="mb-2 font-medium text-gray-700" >Password</label>
          <input
            {...register("password")}
            type="password"
            name="password"
            id="password"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {errors.password && <p className="text-red-500 text-center">{errors.password.message}</p>}
        </div>

        {error && (
          <p className="text-red-500 text-center">
            {error}
          </p>
        )}

        <button type="button" onClick={showPassword}>Ver contraseña</button>

        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200" type="submit">Login</button>

      </form>
    </div>
  )
}
