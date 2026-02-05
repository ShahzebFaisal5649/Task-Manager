import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAuthUser, createErrorResponse, createSuccessResponse } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const user = await getAuthUser(request);
        if (!user) {
            return createErrorResponse('Not authorized', 401);
        }

        const { title, description } = await request.json();

        if (!title) {
            return createErrorResponse('Task title is required', 400);
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Break down the following task into 3-5 logical, actionable subtasks.
        Return ONLY a JSON array of strings.
        Task Title: ${title}
        Task Description: ${description || 'No description provided'}
        Example output: ["Subtask 1", "Subtask 2", "Subtask 3"]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the response in case Gemini adds markdown formatting
        const cleanedText = text.replace(/```json|```/g, '').trim();
        const subtasks = JSON.parse(cleanedText);

        return createSuccessResponse(subtasks);
    } catch (error: any) {
        console.error('AI Breakdown Error:', error);
        return createErrorResponse(error.message || 'Failed to generate subtasks', 500);
    }
}
