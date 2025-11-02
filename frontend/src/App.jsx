import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Profile from './pages/private/Profile'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import { useAuthStore } from './store/authStore'
import Users from './pages/admin/Users'
import User from './pages/admin/User'
import { useEffect } from 'react'
import { refreshToken } from './service/auth.service'
import AppCalendar from './pages/customer/Calendar'
import Availability from './pages/customer/Availability'

function App() {
  const { token, role } = useAuthStore()

  useEffect(() => {
    refreshToken()
  }, [])

  let publicRoutes = <></>
  let privateRoutes = <></>
  let customerRoutes = <></>
  let adminRoutes = <></>

  switch (role) {
    case "ADMIN":
      adminRoutes = (
        <>
          <Route path='/users' element={<PrivateRoute><Users /></PrivateRoute>} />
          <Route path='/users/:id' element={<PrivateRoute><User /></PrivateRoute>} />
        </>
      )
      break
    case "CUSTOMER":
      customerRoutes = (
        <>
          <Route path='/reservations' element={<PrivateRoute><Login /></PrivateRoute>} />
        </>
      )
      break
    default:
      break
  }

  if (!token) {
    publicRoutes = (
      <>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Login />} />
      </>
    )
  } else {
    privateRoutes = (
      <>
        <Route path='/calendar' element={<PrivateRoute><AppCalendar /></PrivateRoute>} />
        <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/availability/:date" element={<PrivateRoute><Availability /></PrivateRoute>} />
      </>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className='flex-1 mx-auto w-full max-w-7xl px-4 py-6 md:px-8 lg:px-16'>
        <Routes>
          <Route path='/' element={<Home />} />
          {adminRoutes}
          {customerRoutes}
          {privateRoutes}
          {publicRoutes}
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
