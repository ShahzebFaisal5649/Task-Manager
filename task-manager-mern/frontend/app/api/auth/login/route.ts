import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { generateToken, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return createErrorResponse('Please provide email and password', 400);
        }

        // Check if user exists (include password field)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return createErrorResponse('Invalid credentials', 401);
        }

        // Check password
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return createErrorResponse('Invalid credentials', 401);
        }

        // Generate token
        const token = generateToken(user._id.toString());

        return createSuccessResponse({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        });
    } catch (error: any) {
        console.error('Login error:', error);
        return createErrorResponse(error.message || 'Server error', 500);
    }
}
