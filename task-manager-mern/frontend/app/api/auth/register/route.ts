import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { generateToken, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { name, email, password } = body;

        // Validate input
        if (!name || !email || !password) {
            return createErrorResponse('Please provide name, email and password', 400);
        }

        if (password.length < 6) {
            return createErrorResponse('Password must be at least 6 characters', 400);
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return createErrorResponse('User already exists', 400);
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        // Generate token
        const token = generateToken(user._id.toString());

        return createSuccessResponse({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        }, 201);
    } catch (error: any) {
        console.error('Register error:', error);
        return createErrorResponse(error.message || 'Server error', 500);
    }
}
