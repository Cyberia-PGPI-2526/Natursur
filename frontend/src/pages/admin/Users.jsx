import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getUsers, deleteUser } from "../../service/users.service"

export default function Users() {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [page, setPage] = useState(null)
  const [totalPages, setTotalPages] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let currentPage = page
        if (!currentPage) {
          currentPage = 1
        }
        const res = await getUsers(currentPage)
        setUsers(res.users || [])
        setPage(res.page)
        setTotalPages(res.totalPages)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [page])

  const prevPage = () => {
    if (page === 1) return
    setPage(page - 1)
  }

  const nextPage = () => {
    if (page === totalPages) return
    setPage(page + 1)
  }

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("¿Are you sure you want delete this user?")
    if (!confirmed) return

    const res = await deleteUser(userId)

    if (res.error) {
      alert("User couldnt be deleted")
    } else {
      setUsers(users.filter((user) => user.id !== userId))
      alert("User deleted succesfully")
    }
  }

  if (isLoading) return <p className="text-center mt-10 text-gray-500">Cargando usuarios...</p>
  if (!users.length) return <p className="text-center mt-10 text-red-500">No se encontraron usuarios.</p>

  return (
    <div className="p-6 min-h-[70vh]">
      <h1 className="text-3xl font-semibold text-blue-600 mb-6">Usuarios</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Nombre</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Rol</th>
              <th className="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-6">{index + 1}</td>
                <td className="py-3 px-6">{user.name}</td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${user.role === "ADMIN"
                      ? "bg-blue-500 text-white"
                      : "bg-green-100 text-green-700"
                      }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-6 text-center flex justify-center gap-2">
                  <button
                    onClick={() => navigate(`/users/${user.id}`)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row justify-center mt-4 gap-4 p-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 rounded px-4 py-3 font-semibold text-xl disabled:bg-gray-500"
          onClick={prevPage}
          disabled={page <= 1}
        >
          prev
        </button>
        <p className="text-2xl font-semibold px-4 py-4">{page}/{totalPages}</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 rounded px-4 py-3 font-semibold text-xl disabled:bg-gray-500"
          onClick={nextPage}
          disabled={page === totalPages}
        >
          next
        </button>
      </div>
    </div>
  )
}
