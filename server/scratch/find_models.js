import dotenv from 'dotenv';
dotenv.config();

async function findModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        if (data.models) {
            const modelNames = data.models.map(m => m.name);
            console.log("Available Gemini models:");
            modelNames.filter(name => name.includes('gemini')).forEach(name => console.log(name));
        } else {
            console.log("No models found:", data);
        }
    } catch (error) {
        console.error("Error finding models:", error);
    }
}

findModels();
