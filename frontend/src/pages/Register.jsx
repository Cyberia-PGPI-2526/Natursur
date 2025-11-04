import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser } from "../service/auth.service"

export default function Register() {
  const [userData, setUserData] = useState({ email: "", name: "", phone_number:"", password: "", repeatPassword: "" })
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value })
    setError("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!checkPhoneNumber(userData.phone_number)) {
      setError("Número de teléfono inválido")
      return
    }
    if (!checkPasswordMatch()) {
      setError("Las contraseñas no coinciden")
      return
    }
    await registerUser(userData)
    navigate("/login")
  }

  const showPassword = () => {
    const password = document.getElementById('password')
    const repeatPassword = document.getElementById('repeatPassword')
    password.type == 'text' ? password.type = 'password' : password.type = 'text'
    repeatPassword.type == 'text' ? repeatPassword.type = 'password' : repeatPassword.type = 'text'
  }

  const checkPhoneNumber = (phone) => {
    const phoneRegex = /^\+?\d[\d\s]{7,14}$/
    return phoneRegex.test(phone)
  }

  const checkPasswordMatch = () => {
    return userData.password === userData.repeatPassword
  }

  return (
    <div className="flex items-center justify-center mt-4 p-4">
      <form className="flex flex-col w-full max-w-md md:max-w-lg lg:max-w-xl space-y-4 bg-white p-6 rounded shadow" onSubmit={handleSubmit}>

        <h2 className="text-xl font-bold text-gray-800 text-center">Registro</h2>

        {error && (
          <div className="flex items-center gap-2 p-4 text-red-800 bg-red-50 border-l-4 border-red-500 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="flex flex-col w-full">
          <label htmlFor="name" className="mb-2 font-medium text-gray-700" >Nombre</label>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            id="name"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="email" className="mb-2 font-medium text-gray-700" >Email</label>
          <input
            onChange={handleChange}
            type="text"
            name="email"
            placeholder="jhondoe@gmail.com"
            id="email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="phone" className="mb-2 font-medium text-gray-700" >Número de telefono</label>
          <input
            onChange={handleChange}
            type="text"
            name="phone_number"
            placeholder="+34 600 000 000 / 600000000"
            id="phone_number"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="password" className="mb-2 font-medium text-gray-700" >Contraseña</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            id="password"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="repeatPassword" className="mb-2 font-medium text-gray-700" >Repite la contraseña</label>
          <input
            onChange={handleChange}
            type="password"
            name="repeatPassword"
            id="repeatPassword"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button type="button" onClick={showPassword}>Ver contraseña</button>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
          type="submit">
          Registro
        </button>

      </form>
    </div>
  )
}