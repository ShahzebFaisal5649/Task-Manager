export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export interface Project {
    _id: string;
    name: string;
    description?: string;
    color: string;
    status: 'active' | 'completed' | 'archived';
    owner: User;
    members: User[];
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags: string[];
    project: string | Project;
    assignedTo?: User;
    createdBy: User;
    subtasks?: { title: string; completed: boolean; _id?: string }[];
    createdAt: string;
    updatedAt: string;
}