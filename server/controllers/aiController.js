import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

// @desc    Ask AI (Mr. Golumolu) a question
// @route   POST /api/ai/ask
// @access  Private
export const askAI = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: 'AI API Key is not configured on the server. Please check your .env file.' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        if (!prompt) {
            return res.status(400).json({ message: 'Please provide a prompt' });
        }

        const systemPrompt = `You are Mr. Golumolu, a professional, efficient, and friendly Kitchen AI Assistant.
        
        Bilingual Support:
        - Detect the user's language (English or Nepali) and respond in the SAME language fluently.
        - If the user speaks in English, reply in English. If they speak in Nepali, reply in Nepali.
        
        Voice-First & Concise Mode:
        - Be EXTREMELY CONCISE. Use short greetings like "Hi", "Hello", "Got it", "Here we go".
        - NEVER introduce yourself as "Mr. Golumolu" or say "I am your kitchen helper" after the first turn.
        - Avoid fluff, long introductions, or "Happy cooking!" fillers unless it adds real value.
        - Give DIRECT answers to questions.
        
        Recipe & Chat Formatting:
        - When providing a recipe, use this specific structure:
          1. ### [Recipe Name in Bold]
          2. **Ingredients:** (Use a bulleted list with clear quantities)
          3. **Steps:** (Use a numbered list for instructions)
          4. **Pro-Tip:** (One short closing sentence - optional)
        - Use simple Markdown. Avoid complex tables or nested structures.
        - Ensure headings and lists are clear for easy reading.`;

        const fullPrompt = `${systemPrompt}\n\nUser Question: ${prompt}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ message: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        
        if (error.status === 429) {
            return res.status(429).json({ message: 'Mr. Golumolu is currently overwhelmed with orders in the kitchen (Rate Limit). Please wait a moment and ask again!' });
        }
        
        res.status(500).json({ message: 'Mr. Golumolu is currently busy in the kitchen. Please try again later.' });
    }
};
