import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import Task from '@/lib/models/Task';
import { getAuthUser, createErrorResponse, createSuccessResponse } from '@/lib/auth';

// GET all tasks in a project
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser(request);
        if (!user) {
            return createErrorResponse('Not authorized', 401);
        }

        const { id: projectId } = await params;
        await connectDB();

        // Verify project belongs to user
        const project = await Project.findOne({ _id: projectId, owner: user._id });
        if (!project) {
            return createErrorResponse('Project not found', 404);
        }

        const tasks = await Task.find({ project: projectId }).sort({ order: 1, createdAt: -1 });

        return createSuccessResponse(tasks);
    } catch (error: any) {
        console.error('Get tasks error:', error);
        return createErrorResponse(error.message || 'Server error', 500);
    }
}

// POST create task
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthUser(request);
        if (!user) {
            return createErrorResponse('Not authorized', 401);
        }

        const { id: projectId } = await params;
        await connectDB();

        // Verify project belongs to user
        const project = await Project.findOne({ _id: projectId, owner: user._id });
        if (!project) {
            return createErrorResponse('Project not found', 404);
        }

        const body = await request.json();
        const { title, description, status, priority, dueDate } = body;

        if (!title) {
            return createErrorResponse('Please provide a task title', 400);
        }

        // Get max order for the status column
        const maxOrderTask = await Task.findOne({ project: projectId, status: status || 'todo' })
            .sort({ order: -1 });
        const order = maxOrderTask ? maxOrderTask.order + 1 : 0;

        const task = await Task.create({
            title,
            description: description || '',
            status: status || 'todo',
            priority: priority || 'medium',
            dueDate: dueDate || null,
            project: projectId,
            owner: user._id,
            order,
        });

        return createSuccessResponse(task, 201);
    } catch (error: any) {
        console.error('Create task error:', error);
        return createErrorResponse(error.message || 'Server error', 500);
    }
}
