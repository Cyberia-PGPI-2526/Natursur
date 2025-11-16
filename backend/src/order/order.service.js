import openaiClient from "../config/openai.js";
import { prisma } from "../config/db.js";



export async function processMessage(userId, message) {
    const order = await extractOrder(message)
    const parsedOrder = order ? parseExtractedOrder(order) : null;
    await saveExtractedOrder(userId, parsedOrder);
    
    const reponse = await openaiClient.responses.create({
        model: "gpt-5-nano",
        instructions: "You are a helpful assistant for a natural products store called Natursur. Your task is to assist customers in placing their orders based on the provided order details. Be concise in your responses and response in Spanish. Dont ask for payment or shipping, just talk about ptoducts and quantities. If no order details were provided, ask the customer to repeat their order.",
        input: `You are an assistant for a natural products store called Natursur. A customer is trying to place an order with the following details:
        ${order ? `Order details: ${order}` : "No order details were provided."}. The order details are just products and its quantities, if no details, say i didnt understand please repeat.`,
    });

    return reponse.output_text.trim();
}

async function extractOrder(message) {

    const instructions = `Extract the order details from the following message. Have in mind that the products can be, if they the products you receive have similar names, choose the closest one:
    - Crema de Ojos Nutritiva de HL
    - Gel Limpiador Renovador de HL
    - Herbalife Gels CoQ10Vita
    - Herbalife Gels ViewVita
    - Rebuild Strength de Herbalife24
    - Loción Nutritiva para Manos y Cuerpo de HL/Skin
    - Serúm con 10% de Niacinamida de HL/Skin
    - Herbalife24 Prologn Gel Energético
    - Herbalife Gels MindVita Kids
    - Herbalife Gels NutrientVita Kids
    - Herbalife24 Creatine+
    - Bebida con Proteínas en Polvo
    - Collagen Skin Booster
    - Phyto Complete
    - Formula 1 Alimento Equilibrado
    - Avena, Manzana y Fibra
    - Bebida Instantánea de Extracto de Té con Plantas Aromáticas
    - Concentrado Herbal Aloe
    - Formula 3 Polvo de Proteínas
    - Herbalifeline Max
    - Desayuno Saludable
    - Gel de Baño para Manos y Cuerpo de Herbal Aloe
    - Protein Chips
    - AloeMax
    - Paquete de prueba
    - Champú Fortalecedor de Herbal Aloe
    - Barritas con Proteínas
    - Niteworks
    - Bebida Vegana con Proteínas en Polvo
    - Immune Booster
    - Hydrate de Herbalife24
    - Restore de Herbalife24
    - Formula 2 Complejo de vitaminas y minerales para mujer
    - Barrita de Proteínas Achieve de Herbalife24
    - Barritas Formula 1 Express
    - LiftOff
    - Crema Hidratante con FPS30
    - Loción de Manos y Cuerpo de Herbal Aloe
    - Crema Revitalizante de Noche de Herbalife SKIN
    - Mascarilla Purificante de Arcilla con Menta de Herbalife SKIN
    - Xtra-Cal
    - Night Mode
    - Formula 2 Complejo de vitaminas y minerales para hombre
    - Tri Blend Select
    - Active Mind Complex
    - Acondicionador Fortalecedor de Herbal Aloe
    - CR7 Drive de Herbalife24
    - High Protein Iced Coffe
    - Crema Tensora Ultimate

    Extract the products and their quantities in the following format:
    <Product Name>: <Quantity>, 
    <Product Name>: <Quantity>,
    If no products are found, respond with "No order details found".
`
    console.log(message)
    const extractionResponse = await openaiClient.responses.create({
        model: "gpt-5-nano",
        instructions: instructions,
        input: message.message,
    });

    console.log("Extraction response:", extractionResponse);

    const extractedText = extractionResponse.output_text.trim();
    return extractedText === "No order details found" ? null : extractedText;
}

function parseExtractedOrder(text) {
  if (text.trim() === "No order details found") return {};

  const lines = text.split(",").map(l => l.trim()).filter(Boolean);

  const result = {};

  for (const line of lines) {
    const [product, quantity] = line.split(":").map(s => s.trim());
    if (product && quantity && !isNaN(quantity)) {
      result[product] = parseInt(quantity);
    }
  }

  return result;
}

export async function saveExtractedOrder(userId, parsedOrder) {
  if (!parsedOrder || Object.keys(parsedOrder).length === 0) {
    return { message: "No order details found — nothing saved." };
  }

  const order = await prisma.order.create({
    data: {
      userId
    }
  });

  for (const [name, quantity] of Object.entries(parsedOrder)) {
    const product = await prisma.product.findUnique({
      where: { name }
    });

    if (!product) {
      console.warn(`Product not found: ${name}, skipping...`);
      continue;
    }

    await prisma.orderProduct.create({
      data: {
        orderId: order.id,
        productId: product.id,
        quantity
      }
    });
  }

  return prisma.order.findUnique({
    where: { id: order.id },
    include: {
      orderProducts: { include: { product: true } },
      user: true
    }
  });
}