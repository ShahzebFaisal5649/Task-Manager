const express = require('express');
const router = express.Router();
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Task routes by project
router.route('/projects/:projectId/tasks').get(getTasks).post(createTask);

// Individual task routes
router.route('/tasks/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;