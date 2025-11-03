import express from "express"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import cors from 'cors'
import { userRoutes } from "./user/user.routes.js"
import { authRoutes } from "./auth/auth.routes.js"
import { appointmentRoutes } from "./appointment/appointment.route.js"

export const app = express()

app.use(helmet())
app.use(express.json())
app.use(cookieParser()) 

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))


app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)

app.use('/api/v1/appointment', appointmentRoutes)