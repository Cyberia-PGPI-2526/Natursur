import "dotenv/config"
import { app } from "./app.js"
import { PORT } from "./config/env.js"
import { prisma } from "./config/db.js"

const port = PORT || 3000

async function start() {
    try {
        await prisma.$connect()
        console.log('Database connected')
        app.listen(port, () => {
            console.log(`App listening on PORT ${PORT}`)
        })
    } catch (error) {
        console.error('Error initializing app: ', error)
        process.exit(1)
    }
}

start()