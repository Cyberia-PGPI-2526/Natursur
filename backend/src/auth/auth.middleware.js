import jwt from 'jsonwebtoken'
import { SECRET_KEY } from "../config/env.js"
import handleJwtError from './auth.error.js'

export function requiresAuth(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' })
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY)
        req.user = decoded
        next()
    } catch (error) {
        return handleJwtError(error, res)
    }
}

export function checkRole(role) {
    return (req, res, next) => {
        const userRole = req.user.role
        if (role !== userRole) {
            return res.status(403).json({ message: 'Forbidden: insufficient permissions' })
        }
        console.log("pasa check role")
        next()
    }
}

