import { body } from "express-validator"
import { processMessage, saveExtractedOrder } from "./order.service.js"

export async function receiveMessage(req, res) {
  try {
    const message = req.body

    const reply = await processMessage(message)
    res.status(200).json(reply)
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message })
  }
}

export async function receiveOrder(req, res) {
  try {
    const userId = req.user.userId
    const products = req.body.products

    const result = await saveExtractedOrder(userId, products)
    res.status(201).json(result)
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message })
  }
}

