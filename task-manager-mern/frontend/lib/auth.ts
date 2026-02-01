import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import connectDB from './db';
import User, { IUser } from './models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: '30d',
    });
}

export function verifyToken(token: string): { id: string } | null {
    try {
        return jwt.verify(token, JWT_SECRET) as { id: string };
    } catch {
        return null;
    }
}

export async function getAuthUser(request: NextRequest): Promise<IUser | null> {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return null;
    }

    await connectDB();
    const user = await User.findById(decoded.id);

    return user;
}

export function createErrorResponse(message: string, status: number) {
    return Response.json({ success: false, message }, { status });
}

export function createSuccessResponse(data: any, status: number = 200) {
    return Response.json({ success: true, data }, { status });
}
