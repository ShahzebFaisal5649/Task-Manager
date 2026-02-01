import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProject extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    color: string;
    owner: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        name: {
            type: String,
            required: [true, 'Please provide a project name'],
            maxlength: [100, 'Name cannot be more than 100 characters'],
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot be more than 500 characters'],
            default: '',
        },
        color: {
            type: String,
            default: '#3B82F6',
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
