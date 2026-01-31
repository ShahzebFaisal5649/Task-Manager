const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a project name'],
            trim: true,
            maxlength: [100, 'Project name cannot be more than 100 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot be more than 500 characters'],
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        status: {
            type: String,
            enum: ['active', 'completed', 'archived'],
            default: 'active',
        },
        color: {
            type: String,
            default: '#3B82F6', // Default blue color
        },
    },
    {
        timestamps: true,
    }
);

// Add owner to members array automatically
projectSchema.pre('save', function () {
    if (!this.members.includes(this.owner)) {
        this.members.push(this.owner);
    }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;