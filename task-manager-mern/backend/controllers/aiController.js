const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Break down a task into subtasks using AI
// @route   POST /api/ai/breakdown
// @access  Private
const breakdownTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Task title is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Break down the following task into 3-5 logical, actionable subtasks. 
        Return ONLY a JSON array of strings. 
        Task Title: ${title}
        Task Description: ${description || 'No description provided'}
        Example output: ["Subtask 1", "Subtask 2", "Subtask 3"]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Gemini Response:', text);

        // More robust JSON extraction
        let cleanedText = text.replace(/```json|```/g, '').trim();

        // Find the first '[' and last ']' to extract the JSON array
        const start = cleanedText.indexOf('[');
        const end = cleanedText.lastIndexOf(']');

        if (start !== -1 && end !== -1) {
            cleanedText = cleanedText.substring(start, end + 1);
        }

        try {
            const subtasks = JSON.parse(cleanedText);
            res.status(200).json(subtasks);
        } catch (parseError) {
            console.error('Failed to parse AI response:', cleanedText);
            // Fallback: manually parse if it's just a list of lines
            const fallbackTasks = cleanedText
                .split('\n')
                .map(line => line.replace(/^[-*•]\s*|\d+\.\s*/, '').trim())
                .filter(line => line.length > 0 && line.length < 200)
                .slice(0, 5);

            if (fallbackTasks.length > 0) {
                return res.status(200).json(fallbackTasks);
            }
            throw new Error('AI returned invalid format');
        }
    } catch (error) {
        console.error('AI Breakdown Error:', error);

        const is404 = error.message?.includes('404') || error.status === 404;
        const isAuth = error.message?.includes('401') || error.message?.includes('403');

        let suggestion = 'Please check your connection and try again.';
        if (is404) {
            suggestion = 'The model was not found. Please ensure you are using a valid model name like "gemini-2.5-flash".';
        } else if (isAuth) {
            suggestion = 'Authentication failed. Please check if your GEMINI_API_KEY is valid and not restricted.';
        }

        res.status(500).json({
            message: 'Failed to generate subtasks',
            error: error.message,
            suggestion: suggestion
        });
    }
};

module.exports = {
    breakdownTask
};
