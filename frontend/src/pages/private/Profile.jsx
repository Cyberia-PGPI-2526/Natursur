import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getUserProfile } from "../../service/users.service"

export default function Profile() {
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const profile = async () => {
            try {
                const res = await getUserProfile()
                setUserData(res)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        profile()
    }, [])

    if (isLoading) return <p className="text-center mt-10 text-gray-500">Cargando...</p>

    if (!userData) return <p className="text-center mt-10 text-red-500">Error al cargar el perfil</p>

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f4f4f4] p-4">
            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg flex flex-col items-center text-center border-t-4 border-[#009BA6]">
                
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#009BA6] to-[#007a82] flex items-center justify-center text-white text-4xl font-semibold mb-6">
                    {userData.name ? userData.name[0].toUpperCase() : "?"}
                </div>

                <h1 className="text-4xl font-semibold text-[#009BA6]">{userData.name}</h1>
                <p className="text-lg text-gray-600 mt-2">{userData.email}</p>


                <div className="flex flex-col gap-6 mt-6 w-full">
                    <Link
                        to="/edit-profile"
                        className="bg-[#009BA6] text-white py-3 px-6 rounded-xl hover:bg-[#007a82] transition duration-300 transform hover:scale-105"
                    >
                        Editar Perfil
                    </Link>
                    <Link
                        to="/"
                        className="text-[#009BA6] hover:underline text-sm hover:text-[#007a82] transition duration-300"
                    >
                        ← Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}
