import { Router } from "express"
import { registerUser, loginUser, refreshToken, logoutUser } from "./auth.controller.js"
import { requiresAuth } from "./auth.middleware.js"
import { loginValidation, registerValidation } from "./auth.validation.js"
import { handleValidation } from "../utils/handleValidation.js"

export const authRoutes = Router()

authRoutes.post("/register",
    registerValidation,
    handleValidation,
    registerUser)

authRoutes.post("/login",
    loginValidation,
    handleValidation,
    loginUser)

authRoutes.post("/refresh", refreshToken)
authRoutes.post("/logout", logoutUser)

authRoutes.get("/validate",
    requiresAuth,
    async (req, res) => {
        return res.send({ authenticated: true })
    }
)