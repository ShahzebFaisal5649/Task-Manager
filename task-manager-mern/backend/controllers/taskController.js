const Task = require('../models/Task');
const Project = require('../models/Project');
const prisma = require('../lib/prisma');

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Verify project exists and user is a member
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        if (!project.members.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this project',
            });
        }

        // Get tasks with optional filters
        const { status, priority, assignedTo } = req.query;

        let query = { project: projectId };

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (assignedTo) query.assignedTo = assignedTo;

        const tasks = await Task.find(query)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .populate('project', 'name');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        // Verify user is project member
        const project = await Project.findById(task.project);
        if (!project.members.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this task',
            });
        }

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
const createTask = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, description, assignedTo, status, priority, dueDate, tags } = req.body;

        // Verify project exists and user is a member
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        if (!project.members.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to create tasks in this project',
            });
        }

        // If assignedTo is provided, verify they are a project member
        if (assignedTo && !project.members.includes(assignedTo)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot assign task to non-member',
            });
        }

        const task = await Task.create({
            title,
            description,
            project: projectId,
            assignedTo: assignedTo || req.user.id, // Assign to creator if not specified
            createdBy: req.user.id,
            status,
            priority,
            dueDate,
            tags,
        });

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            data: populatedTask,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        // Verify user is project member
        const project = await Project.findById(task.project);
        if (!project.members.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this task',
            });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        // Verify user is project member
        const project = await Project.findById(task.project);
        if (!project.members.includes(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this task',
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Task deleted',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
};