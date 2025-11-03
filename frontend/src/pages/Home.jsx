import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

export default function Home() {
    const { token, role } = useAuthStore()
    const navigate = useNavigate()

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#009BA6] to-[#007a82] text-white py-20 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Bienvenido a Natursur
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                        Tu centro de bienestar integral. Terapias naturales, nutrición personalizada y productos de calidad para tu salud.
                    </p>
                    {!token && (
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                to="/login"
                                className="bg-white text-[#009BA6] hover:bg-gray-100 font-bold px-8 py-4 rounded-lg transition shadow-lg text-lg"
                            >
                                Iniciar sesión
                            </Link>
                            <Link 
                                to="/register"
                                className="bg-transparent border-2 border-white hover:bg-white hover:text-[#009BA6] font-bold px-8 py-4 rounded-lg transition text-lg"
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}
                    {token && role === 'CUSTOMER' && (
                        <button
                            onClick={() => navigate('/services')}
                            className="bg-white text-[#009BA6] hover:bg-gray-100 font-bold px-8 py-4 rounded-lg transition shadow-lg text-lg"
                        >
                            Explorar Servicios
                        </button>
                    )}
                </div>
            </section>

            {/* Servicios Destacados */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-center text-[#009BA6] mb-4">
                        Nuestros Servicios
                    </h2>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Tratamientos personalizados para tu bienestar físico, emocional y energético
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
                            <div className="text-5xl mb-4 text-center">💆</div>
                            <h3 className="text-2xl font-bold text-[#009BA6] mb-3 text-center">
                                Masaje y Osteopatía
                            </h3>
                            <p className="text-gray-700 text-center">
                                Libera tensiones, mejora tu postura y restaura la armonía de tu cuerpo con técnicas especializadas.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
                            <div className="text-5xl mb-4 text-center">🧲</div>
                            <h3 className="text-2xl font-bold text-[#009BA6] mb-3 text-center">
                                Par Biomagnético
                            </h3>
                            <p className="text-gray-700 text-center">
                                Restaura el balance natural de tu organismo mediante el uso terapéutico de imanes.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
                            <div className="text-5xl mb-4 text-center">🧘</div>
                            <h3 className="text-2xl font-bold text-[#009BA6] mb-3 text-center">
                                Técnicas Emocionales
                            </h3>
                            <p className="text-gray-700 text-center">
                                Libera emociones atrapadas y encuentra equilibrio con Reiki, craneosacral y más.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
                            <div className="text-5xl mb-4 text-center">🥗</div>
                            <h3 className="text-2xl font-bold text-[#009BA6] mb-3 text-center">
                                Nutrición y Estilo de Vida
                            </h3>
                            <p className="text-gray-700 text-center">
                                Asesoramiento nutricional personalizado basado en naturopatía para mejorar tu salud.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
                            <div className="text-5xl mb-4 text-center">🔍</div>
                            <h3 className="text-2xl font-bold text-[#009BA6] mb-3 text-center">
                                VARS
                            </h3>
                            <p className="text-gray-700 text-center">
                                Valoración completa para analizar y reequilibrar tu sistema corporal y energético.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
                            <div className="text-5xl mb-4 text-center">✨</div>
                            <h3 className="text-2xl font-bold text-[#009BA6] mb-3 text-center">
                                Reiki
                            </h3>
                            <p className="text-gray-700 text-center">
                                Equilibra tu energía, reduce el estrés y favorece procesos de autocuración.
                            </p>
                        </div>
                    </div>

                    {token && role === 'CUSTOMER' && (
                        <div className="text-center mt-12">
                            <button
                                onClick={() => navigate('/services')}
                                className="bg-[#009BA6] text-white hover:bg-[#007a82] font-bold px-8 py-3 rounded-lg transition shadow-lg"
                            >
                                Ver Todos los Servicios
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Productos Section */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-[#009BA6] mb-6">
                                Distribuidor Oficial Herbalife
                            </h2>
                            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                                Además de nuestros servicios terapéuticos, somos <strong>distribuidores oficiales de Herbalife Nutrition</strong>, 
                                ofreciendo productos de alta calidad para complementar tu bienestar.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#009BA6] text-xl font-bold">✓</span>
                                    <span className="text-gray-700">Control de peso y nutrición personalizada</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#009BA6] text-xl font-bold">✓</span>
                                    <span className="text-gray-700">Suplementos vitamínicos y proteínas</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#009BA6] text-xl font-bold">✓</span>
                                    <span className="text-gray-700">Productos de energía y rendimiento</span>
                                </li>
                            </ul>
                            {token && role === 'CUSTOMER' && (
                                <button
                                    onClick={() => navigate('/products')}
                                    className="bg-[#009BA6] text-white hover:bg-[#007a82] font-bold px-8 py-3 rounded-lg transition shadow-lg"
                                >
                                    Conocer Productos
                                </button>
                            )}
                        </div>
                        <div className="bg-gradient-to-br from-[#009BA6]/10 to-transparent rounded-2xl p-8">
                            <div className="bg-white rounded-xl shadow-xl p-8">
                                <div className="text-center">
                                    <div className="text-7xl mb-4">🌿</div>
                                    <h3 className="text-3xl font-bold text-[#009BA6] mb-2">Herbalife Nutrition</h3>
                                    <p className="text-gray-600">Más de 40 años respaldando tu salud</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Por Qué Elegirnos */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-bold text-[#009BA6] mb-12">
                        ¿Por Qué Elegirnos?
                    </h2>
                    
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="text-5xl mb-4">👨‍⚕️</div>
                            <h3 className="text-xl font-bold text-[#009BA6] mb-2">Profesionales Certificados</h3>
                            <p className="text-gray-600 text-sm">
                                Equipo especializado con formación en terapias naturales
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="text-5xl mb-4">🎯</div>
                            <h3 className="text-xl font-bold text-[#009BA6] mb-2">Atención Personalizada</h3>
                            <p className="text-gray-600 text-sm">
                                Tratamientos adaptados a tus necesidades específicas
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="text-5xl mb-4">🌱</div>
                            <h3 className="text-xl font-bold text-[#009BA6] mb-2">Enfoque Integral</h3>
                            <p className="text-gray-600 text-sm">
                                Cuidamos de tu bienestar físico, emocional y energético
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="text-5xl mb-4">📅</div>
                            <h3 className="text-xl font-bold text-[#009BA6] mb-2">Reserva Online</h3>
                            <p className="text-gray-600 text-sm">
                                Sistema fácil y cómodo para agendar tus sesiones
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-16 px-4 bg-gradient-to-br from-[#009BA6] to-[#007a82] text-white">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-4">
                        ¿Listo para comenzar tu transformación?
                    </h2>
                    <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                        Reserva tu primera sesión y descubre cómo podemos ayudarte a alcanzar tu bienestar integral
                    </p>
                    {!token ? (
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                to="/register"
                                className="bg-white text-[#009BA6] hover:bg-gray-100 font-bold px-8 py-4 rounded-lg transition shadow-lg text-lg"
                            >
                                Crear Cuenta
                            </Link>
                            <Link
                                to="/login"
                                className="bg-transparent border-2 border-white hover:bg-white hover:text-[#009BA6] font-bold px-8 py-4 rounded-lg transition text-lg"
                            >
                                Iniciar Sesión
                            </Link>
                        </div>
                    ) : role === 'CUSTOMER' ? (
                        <button
                            onClick={() => navigate('/calendar')}
                            className="bg-white text-[#009BA6] hover:bg-gray-100 font-bold px-8 py-4 rounded-lg transition shadow-lg text-lg"
                        >
                            Reservar Ahora
                        </button>
                    ) : null}
                </div>
            </section>
        </div>
    )
}

