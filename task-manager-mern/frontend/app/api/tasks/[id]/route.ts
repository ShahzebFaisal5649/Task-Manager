import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Task from '@/lib/models/Task';
import { getAuthUser, createErrorResponse, createSuccessResponse } from '@/lib/auth';

// GET single task
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser(request);
        if (!user) {
            return createErrorResponse('Not authorized', 401);
        }

        const { id } = await params;
        await connectDB();
        const task = await Task.findOne({ _id: id, owner: user._id });

        if (!task) {
            return createErrorResponse('Task not found', 404);
        }

        return createSuccessResponse(task);
    } catch (error: any) {
        console.error('Get task error:', error);
        return createErrorResponse(error.message || 'Server error', 500);
    }
}

// PUT update task
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser(request);
        if (!user) {
            return createErrorResponse('Not authorized', 401);
        }

        const { id } = await params;
        await connectDB();
        const body = await request.json();

        const task = await Task.findOneAndUpdate(
            { _id: id, owner: user._id },
            body,
            { new: true, runValidators: true }
        );

        if (!task) {
            return createErrorResponse('Task not found', 404);
        }

        return createSuccessResponse(task);
    } catch (error: any) {
        console.error('Update task error:', error);
        return createErrorResponse(error.message || 'Server error', 500);
    }
}

// DELETE task
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser(request);
        if (!user) {
            return createErrorResponse('Not authorized', 401);
        }

        const { id } = await params;
        await connectDB();

        const task = await Task.findOneAndDelete({ _id: id, owner: user._id });

        if (!task) {
            return createErrorResponse('Task not found', 404);
        }

        return createSuccessResponse({ message: 'Task deleted' });
    } catch (error: any) {
        console.error('Delete task error:', error);
        return createErrorResponse(error.message || 'Server error', 500);
    }
}
