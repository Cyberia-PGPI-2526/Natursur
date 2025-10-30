import { Link } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

export default function Home() {

    const { token } = useAuthStore()

    return (
        <div className="flex flex-col items-center justify-center p-4 gap-4 ">

            <h1 className="text-4xl font-bold text-blue-500 m-2">Bienvenido a Enterprise</h1>

            <p className="max-w-2xl m-2">
                Esta es una plataforma interna diseñada para la gestión de usuarios, perfiles
                y administración de tu organización. Inicia sesión o regístrate para comenzar a usar el sistema.
            </p>

            { !token &&
            <div className="flex flex-wrap gap-4 justify-center">
                <Link
                    to="/login"
                    className="bg-blue-500 hover:bg-blue-600 font-semibold text-white px-4 py-3 rounded"
                >
                    Iniciar sesión
                </Link>
                <Link 
                    to="/register"
                    className=" bg-gray-400 hover:bg-gray-500 font-semibold text-white px-4 py-3 rounded"
                >
                    Registrarse
                </Link>
            </div>
}
        </div>
    )
}

