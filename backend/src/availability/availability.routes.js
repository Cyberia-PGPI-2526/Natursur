import express from "express"
import { checkRole, requiresAuth } from "../auth/auth.middleware.js"
import { getAvailableHours, createBlock, deleteBlock } from "./availability.controller.js"

export const availabilityRouter = express.Router()

availabilityRouter.get("/:date",
    requiresAuth,
    getAvailableHours
)

availabilityRouter.post("/block",
    requiresAuth,
    checkRole("ADMIN"),
    createBlock)


availabilityRouter.delete("/block/:id",
    requiresAuth,
    checkRole("ADMIN"),
    deleteBlock)
