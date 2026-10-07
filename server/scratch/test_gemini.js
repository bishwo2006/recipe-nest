
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function testGemini() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing!");
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Try different model names
        const models = ["gemini-1.5-flash", "gemini-flash", "gemini-pro", "gemini-flash-latest"];
        
        for (const modelName of models) {
            console.log(`Testing model: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello!");
                const response = await result.response;
                console.log(`Success with ${modelName}:`, response.text());
                return; // Stop if success
            } catch (err) {
                console.error(`Error with ${modelName}:`, err.message);
            }
        }
    } catch (error) {
        console.error("General Error:", error);
    }
}

testGemini();
