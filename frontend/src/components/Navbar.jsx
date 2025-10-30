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

  let publicRoutes = <></>
  let privateRoutes = <></>
  let customerRoutes = <></>
  let adminRoutes = <></>

  switch (role) {
    case "ADMIN":
      adminRoutes = (
        <>
          <NavLink className="p-2" to="/users">Users</NavLink>
        </>
      )
      break
    case "CUSTOMER":
      customerRoutes = (
        <>
          <NavLink className="p-2" to="/reservations">Reservations</NavLink>
        </>
      )
      break
    default:
      break
  }

  if (!token) {
    publicRoutes = (
      <>
        <NavLink className="p-2" to="/login">Login</NavLink>
        <NavLink className="p-2" to="/register">Register</NavLink>
      </>
    )
  } else {
    privateRoutes = (
      <>
        <NavLink className="p-2" to="/profile">Profile</NavLink>
        <button onClick={handleLogout} className="p-2 text-white">
          Logout
        </button>
      </>
    )
  }



  return (
    <nav className="flex flex-row justify-center items-center top-0 sticky z-50 bg-blue-500 rounded text-white p-2 text-2xl">
      <NavLink className="p-2" to="/">Home</NavLink>
      {adminRoutes}
      {customerRoutes}
      {privateRoutes}
      {publicRoutes}
    </nav>
  )
}
