import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/lib/models/Project';
import { getAuthUser, createErrorResponse, createSuccessResponse } from '@/lib/auth';

// GET all projects
export async function GET(request: NextRequest) {
    try {
        const user = await getAuthUser(request);
        if (!user) {
            return createErrorResponse('Not authorized', 401);
        }

        await connectDB();
        const projects = await Project.find({ owner: user._id }).sort({ createdAt: -1 });

        return createSuccessResponse(projects);
    } catch (error: any) {
        console.error('Get projects error:', error);
        return createErrorResponse(error.message || 'Server error', 500);
    }
}

// POST create project
export async function POST(request: NextRequest) {
    try {
        const user = await getAuthUser(request);
        if (!user) {
            return createErrorResponse('Not authorized', 401);
        }

        await connectDB();
        const body = await request.json();
        const { name, description, color } = body;

        if (!name) {
            return createErrorResponse('Please provide a project name', 400);
        }

        const project = await Project.create({
            name,
            description: description || '',
            color: color || '#3B82F6',
            owner: user._id,
        });

        return createSuccessResponse(project, 201);
    } catch (error: any) {
        console.error('Create project error:', error);
        return createErrorResponse(error.message || 'Server error', 500);
    }
}
