import { PrismaClient, Role, AppointmentState, SessionType } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const createAppointmentTime = (days, hours) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    date.setHours(hours, 0, 0, 0)
    return date
}

async function main() {
    console.log('Iniciando script de seed...')

    const hashedAdminPassword = await bcrypt.hash('admin123', 10)
    const hashedCustomerPassword = await bcrypt.hash('customer123', 10)

    const adminUserData = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: hashedAdminPassword,
            role: Role.ADMIN,
        },
    })

    const customerUserData = []
    for (let i = 0; i <= 25; i++) {
        const user = await prisma.user.upsert({
            where: { email: `customer${i}@example.com` },
            update: {},
            create: {
                email: `customer${i}@example.com`,
                name: `Customer ${i}`,
                password: hashedCustomerPassword,
                role: Role.CUSTOMER,
            },
        })
        customerUserData.push(user)
    }

    console.log('Usuarios (Admin + 26 Clientes) creados')

    const servicios = [
        {
            name: 'Masaje y Osteopatía',
            description:
                'El cuerpo es un sistema en constante ajuste. El dolor, la tensión o la falta de movilidad son señales de que algo no está funcionando bien. A través de técnicas de masaje y osteopatía, trabajamos para liberar restricciones, mejorar la postura y restaurar la armonía de tu organismo. Mi objetivo es ayudarte a moverte sin dolor y con mayor libertad, respetando siempre la estructura natural de tu cuerpo. Reserva tu sesión de osteopatía. Equilibra tu energía y fortalece tu bienestar.',

        },
        {
            name: 'Par Biomagnético',
            description:
                'Nuestro organismo está lleno de campos energéticos que, en ocasiones, se ven alterados por virus, bacterias o desequilibrios internos. El Par Biomagnético es una técnica que utiliza imanes para restaurar el balance natural del cuerpo, favoreciendo la capacidad de recuperación del organismo. Si buscas una terapia complementaria para mejorar tu bienestar, esta puede ser una excelente opción. Consulta sobre esta técnica. Libera emociones atrapadas y recupera tu bienestar.',

        },
        {
            name: 'Técnicas Emocionales',
            description:
                'Las emociones no solo afectan nuestra mente, también pueden dejar huella en nuestro cuerpo. Muchas tensiones musculares, bloqueos o molestias físicas tienen un origen emocional. Utilizo diversas técnicas para ayudarte a liberar esas cargas y sentirte más ligero y equilibrado. Referencia: "El Código de la Emoción" (Dr. Bradley Nelson). Basándome en estos principios, aplico técnicas para identificar y liberar esas emociones acumuladas. Método craneosacral, liberación de emociones atrapadas, Reiki y otras técnicas energéticas.',

        },
        {
            name: 'Asesoramiento Nutricional y Estilo de Vida',
            description:
                'La alimentación es la base de nuestra energía y bienestar. No se trata solo de perder peso, sino de aprender a nutrir el cuerpo de forma adecuada. A través de un enfoque basado en la naturopatía, te ayudo a mejorar tu alimentación y a crear hábitos saludables que realmente funcionen para ti. Además ofrezco Valoración Gratuita y retos de transformación de 21 días con incentivos.',

        },
        {
            name: 'VARS (Valoración, Análisis y Reequilibrio del Sistema)',
            description:
                'VARS es una valoración completa para analizar y reequilibrar el sistema corporal y energético. Incluye diagnóstico, plan de acción y seguimiento personalizado. Puede combinarse con otras terapias como Reiki o Par Biomagnético según necesidad.',

        },
        {
            name: 'Reiki',
            description:
                'Reiki: Técnica energética que equilibra. Sesiones destinadas a equilibrar la energía, reducir el estrés y favorecer procesos de autocuración. Reserva tu sesión emocional.',

        },
    ]

    for (const s of servicios) {
        await prisma.service.upsert({
            where: { name: s.name },
            update: s,
            create: s,
        })
    }

    const [masaje, reiki, vars] = await prisma.service.findMany({
        where: { name: { in: ['Masaje y Osteopatía', 'Reiki', 'VARS (Valoración, Análisis y Reequilibrio del Sistema)'] } },
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    })

    console.log('Servicios creados')

    const start1 = createAppointmentTime(1, 9)
    const end1 = createAppointmentTime(1, 10)
    const date1 = new Date(start1)
    date1.setHours(0, 0, 0, 0)

    const start2 = createAppointmentTime(2, 11)
    const end2 = createAppointmentTime(2, 13)
    const date2 = new Date(start2)
    date2.setHours(0, 0, 0, 0)

    const start3 = createAppointmentTime(-7, 15)
    const end3 = createAppointmentTime(-7, 16)
    const date3 = new Date(start3)
    date3.setHours(0, 0, 0, 0)

    const appointmentsData = [
        {
            appointment_date: date1,
            start_time: start1,
            end_time: end1,
            clientId: customerUserData[1].id,
            serviceId: masaje.id,
            state: AppointmentState.CONFIRMED,
            session_type: SessionType.MIN_60,
        },
        {
            appointment_date: date2,
            start_time: start2,
            end_time: end2,
            clientId: customerUserData[2].id,
            serviceId: vars.id,
            state: AppointmentState.PENDING,
            session_type: SessionType.MIN_90,
        },
        {
            appointment_date: date3,
            start_time: start3,
            end_time: end3,
            clientId: customerUserData[1].id,
            serviceId: reiki.id,
            state: AppointmentState.COMPLETED,
            session_type: SessionType.MIN_60,
        },
    ]

    for (const data of appointmentsData) {
        await prisma.appointment.create({
            data: data,
        })
    }

    console.log('3 Citas de ejemplo creadas')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })