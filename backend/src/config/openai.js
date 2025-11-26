import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment");
}
const options = {
  apiKey: process.env.OPENAI_API_KEY,
}
const openaiClient = new OpenAI(options);

export default openaiClient;