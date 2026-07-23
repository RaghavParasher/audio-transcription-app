require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key found in .env!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  try {
    console.log(`Testing model: ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Say hello!");
    console.log(`✅ SUCCESS for ${modelName}: "${result.response.text().trim()}"\n`);
    return true;
  } catch (error) {
    console.log(`❌ FAILED for ${modelName}: ${error.message}\n`);
    return false;
  }
}

async function run() {
  const models = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-flash-latest",
    "gemini-2.5-flash",
    "gemini-3.5-flash-lite"
  ];
  
  for (const m of models) {
    await testModel(m);
  }
}

run();
