const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API Key found in environment!");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log("Testing Gemini API with model: gemini-1.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, are you there?");
    console.log("SUCCESS! Gemini responded:");
    console.log(result.response.text());
  } catch (error) {
    console.error("FAILED! Error details:");
    console.error(error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
    }
  }
}

test();
