import { useState } from "react"
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold text-white">Enterprise</h2>
          <p className="text-sm white mt-1">© {new Date().getFullYear()} Todos los derechos reservados.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <NavLink to="/terms" className="hover:text-white transition-colors duration-200">
            Termns and coditions
          </NavLink>
          <NavLink to="/contact" className="hover:text-white transition-colors duration-200">
            Contact
          </NavLink>
          <NavLink to="/about" className="hover:text-white transition-colors duration-200">
            About us
          </NavLink>
        </div>

      </div>
    </footer>
  )
}