import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedAdminPassword = await bcrypt.hash('admin123', 10)
  const hashedCustomerPassword = await bcrypt.hash('customer123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedAdminPassword,
      role: Role.ADMIN,
    },
  })

  console.log("Admin created")

  for (let i = 0; i <= 25; i++) {
    await prisma.user.upsert({
      where: { email: `customer${i}@example.com` },
      update: {},
      create: {
        email: `customer${i}@example.com`,
        name: `Customer ${i}`,
        password: hashedCustomerPassword,
        role: Role.CUSTOMER,
      },
    })
  }

  
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
  
  console.log('Services created')
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
