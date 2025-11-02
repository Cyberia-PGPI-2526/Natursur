import { NavLink, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { logout } from "../service/auth.service"

export default function Navbar() {
  const navigate = useNavigate()
  const { token, role } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded transition ${
      isActive
        ? "bg-[#009BA6] text-white"
        : "hover:bg-[#009BA6] hover:text-white text-[#009BA6]"
    }`

  let publicRoutes = <></>
  let privateRoutes = <></>
  let customerRoutes = <></>
  let adminRoutes = <></>

  switch (role) {
    case "ADMIN":
      adminRoutes = <NavLink className={linkClass} to="/users">Users</NavLink>
      break
    case "CUSTOMER":
      customerRoutes = <NavLink className={linkClass} to="/reservations">Reservations</NavLink>
      break
    default:
      break
  }

  if (!token) {
    publicRoutes = (
      <>
        <NavLink className={linkClass} to="/login">Login</NavLink>
        <NavLink className={linkClass} to="/register">Register</NavLink>
      </>
    )
  } else {
    privateRoutes = (
      <>
        <NavLink className={linkClass} to="/profile">Profile</NavLink>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-[#009BA6] text-white rounded hover:bg-[#00777F] transition"
        >
          Logout
        </button>
      </>
    )
  }

  return (
    <nav className="w-full sticky top-0 z-50 bg-white shadow-md flex flex-col md:flex-row justify-between items-center px-6 py-4 md:px-12">
      <NavLink className="text-2xl font-bold text-[#009BA6] mb-2 md:mb-0" to="/">Natursur</NavLink>
      <div className="flex flex-wrap justify-center gap-2 md:gap-4">
        <NavLink className={linkClass} to="/">Inicio</NavLink>
        {adminRoutes}
        {customerRoutes}
        {privateRoutes}
        {publicRoutes}
      </div>
    </nav>
  )
}

