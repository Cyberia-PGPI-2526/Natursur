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

    if (isLoading) return <p className="text-center mt-10 text-gray-500">Loading...</p>

    if (!userData) return <p className="text-center mt-10 text-red-500">Error loading profile</p>

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-4xl font-bold mb-4">
                    {userData.name ? userData.name[0].toUpperCase() : "?"}
                </div>
                <h1 className="text-2xl font-semibold text-gray-800">{userData.name}</h1>
                <p className="text-gray-500 mb-4">{userData.email}</p>

                <div className="flex flex-col gap-2 mt-4 w-full">
                    <Link
                        to="/edit-profile"
                        className="bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
                    >
                        Edit Profile
                    </Link>
                    <Link
                        to="/"
                        className="text-blue-500 hover:underline text-sm"
                    >
                        ← Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}