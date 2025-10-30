import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../service/auth.service"

export default function Register() {
  const [userData, setUserData] = useState({ email: "", password: "" })

  const navigate = useNavigate()

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const res = await loginUser(userData)
    navigate("/login")
  }

  const showPassword = () => {
    const input = document.getElementById('password')
    input.type == 'text' ? input.type = 'password' : input.type = 'text'
  }

  return (
    <div className="flex items-center justify-center mt-4 p-4">
      <form className="flex flex-col w-full max-w-md md:max-w-lg lg:max-w-xl space-y-4 bg-white p-6 rounded shadow" onSubmit={handleSubmit}>

        <h2 className="text-xl font-bold text-gray-800 text-center">Login</h2>

        <div className="flex flex-col w-full">
          <label htmlFor="email" className="mb-2 font-medium text-gray-700" >Email</label>
          <input
            onChange={handleChange}
            type="text"
            name="email"
            id="email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="password" className="mb-2 font-medium text-gray-700" >Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            id="password"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button type="button" onClick={showPassword}>Ver contraseña</button>

        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200" type="submit">Login</button>

      </form>
    </div>
  )
}