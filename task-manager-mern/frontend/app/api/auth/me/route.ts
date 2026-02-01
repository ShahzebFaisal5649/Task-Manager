import { NextRequest } from 'next/server';
import { getAuthUser, createErrorResponse, createSuccessResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const user = await getAuthUser(request);

        if (!user) {
            return createErrorResponse('Not authorized', 401);
        }

        return createSuccessResponse({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error: any) {
        console.error('Get me error:', error);
        return createErrorResponse(error.message || 'Server error', 500);
    }
}
