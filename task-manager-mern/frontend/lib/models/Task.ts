import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITask extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate: Date | null;
    project: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: [true, 'Please provide a task title'],
            maxlength: [200, 'Title cannot be more than 200 characters'],
        },
        description: {
            type: String,
            maxlength: [1000, 'Description cannot be more than 1000 characters'],
            default: '',
        },
        status: {
            type: String,
            enum: ['todo', 'in-progress', 'done'],
            default: 'todo',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        dueDate: {
            type: Date,
            default: null,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
