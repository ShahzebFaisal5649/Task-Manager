import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import Task from '@/lib/models/Task';
import { getAuthUser, createErrorResponse, createSuccessResponse } from '@/lib/auth';

// GET single project
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
        const project = await Project.findOne({ _id: id, owner: user._id });

        if (!project) {
            return createErrorResponse('Project not found', 404);
        }

        return createSuccessResponse(project);
    } catch (error: any) {
        console.error('Get project error:', error);
        return createErrorResponse(error.message || 'Server error', 500);
    }
}

// PUT update project
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

        const project = await Project.findOneAndUpdate(
            { _id: id, owner: user._id },
            body,
            { new: true, runValidators: true }
        );

        if (!project) {
            return createErrorResponse('Project not found', 404);
        }

        return createSuccessResponse(project);
    } catch (error: any) {
        console.error('Update project error:', error);
        return createErrorResponse(error.message || 'Server error', 500);
    }
}

// DELETE project
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

        const project = await Project.findOneAndDelete({ _id: id, owner: user._id });

        if (!project) {
            return createErrorResponse('Project not found', 404);
        }

        // Delete all tasks in the project
        await Task.deleteMany({ project: id });

        return createSuccessResponse({ message: 'Project deleted' });
    } catch (error: any) {
        console.error('Delete project error:', error);
        return createErrorResponse(error.message || 'Server error', 500);
    }
}
