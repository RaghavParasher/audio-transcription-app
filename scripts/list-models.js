require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No GEMINI_API_KEY found in environment!");
    process.exit(1);
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log("Fetching available models...");
    // The SDK doesn't have a direct listModels, so we use a fetch
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("Available Models:");
      data.models.forEach(m => console.log(`- ${m.name}`));
    } else {
      console.log("No models found or error in response:");
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}

listModels();
