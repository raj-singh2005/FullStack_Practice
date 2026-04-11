const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// initialize once (better performance)
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite" // lighter = fewer rate limits
});

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const prompt = `
You are a helpful civic assistant for Jamshedpur.

Rules:
- Give short, clear, and helpful answers.
- Only suggest using the "Report Issue" button IF the user is clearly reporting a civic problem (like garbage, potholes, water issues, etc).
- If the user is asking general questions, just answer normally.
- Do NOT mention reporting unless necessary.

User: ${message}
`;

        const result = await model.generateContent(prompt);
        const reply = result.response.text();

        res.status(200).json({ reply });

    } catch (err) {
        console.error(err.message);

        // simple fallback (important for hackathon demo)
        res.status(200).json({
            reply: "Server is busy right now. Please try again in a few seconds."
        });
    }
};

module.exports = { chatWithAI };