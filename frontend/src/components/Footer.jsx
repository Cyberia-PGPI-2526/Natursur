import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 mt-10 border-t border-gray-200">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-[#009BA6]">Natursur</h2>
          <p className="text-sm mt-1 text-gray-500">© {new Date().getFullYear()} Todos los derechos reservados.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <NavLink to="/terms" className="hover:text-[#00777F] transition-colors duration-200">
            Términos y condiciones
          </NavLink>
          <NavLink to="/contact" className="hover:text-[#00777F] transition-colors duration-200">
            Contacto
          </NavLink>
          <NavLink to="/about" className="hover:text-[#00777F] transition-colors duration-200">
            Sobre nosotros
          </NavLink>
        </div>
      </div>
    </footer>
  )
}
