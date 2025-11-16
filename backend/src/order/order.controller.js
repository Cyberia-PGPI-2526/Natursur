import { processMessage } from "./order.service.js"

export async function receiveMessage(req, res) {
  try {
    const userId = req.user.userId
    const message = req.body

    const reply = await processMessage(userId, message)
    res.json({ reply })
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message })
  }
}

