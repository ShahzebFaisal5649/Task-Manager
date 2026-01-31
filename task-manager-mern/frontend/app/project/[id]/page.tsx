'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { projectAPI, taskAPI } from '@/lib/api';
import { Project, Task } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export default function ProjectPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium' as 'low' | 'medium' | 'high',
        status: 'todo' as 'todo' | 'in-progress' | 'completed',
        tags: '',
    });

    useEffect(() => {
        if (params.id) {
            fetchProject();
            fetchTasks();
        }
    }, [params.id]);

    const fetchProject = async () => {
        try {
            const response = await projectAPI.getOne(params.id as string);
            setProject(response.data.data);
        } catch (error) {
            toast.error('Failed to load project');
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await taskAPI.getAll(params.id as string);
            setTasks(response.data.data);
        } catch (error) {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const taskData = {
                ...newTask,
                tags: newTask.tags ? newTask.tags.split(',').map(t => t.trim()) : [],
            };
            await taskAPI.create(params.id as string, taskData);
            setShowModal(false);
            setNewTask({
                title: '',
                description: '',
                priority: 'medium',
                status: 'todo',
                tags: '',
            });
            fetchTasks();
            toast.success('Task created successfully');
        } catch (error) {
            toast.error('Failed to create task');
        }
    };

    const handleUpdateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTask) return;

        try {
            const taskData = {
                ...newTask,
                tags: newTask.tags ? newTask.tags.split(',').map(t => t.trim()) : [],
            };
            await taskAPI.update(editingTask._id, taskData);
            setShowModal(false);
            setEditingTask(null);
            setNewTask({
                title: '',
                description: '',
                priority: 'medium',
                status: 'todo',
                tags: '',
            });
            fetchTasks();
            toast.success('Task updated successfully');
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const handleUpdateTaskStatus = async (taskId: string, status: 'todo' | 'in-progress' | 'completed') => {
        try {
            await taskAPI.update(taskId, { status });
            fetchTasks();
            toast.success('Task status updated');
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (confirm('Delete this task?')) {
            try {
                await taskAPI.delete(taskId);
                fetchTasks();
                toast.success('Task deleted');
            } catch (error) {
                toast.error('Failed to delete task');
            }
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setNewTask({
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            status: task.status,
            tags: task.tags?.join(', ') || '',
        });
        setShowModal(true);
    };

    const getTasksByStatus = (status: 'todo' | 'in-progress' | 'completed') => {
        return tasks.filter((task) => task.status === status);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-700 bg-red-50 border-red-200';
            case 'medium':
                return 'text-amber-700 bg-amber-50 border-amber-200';
            case 'low':
                return 'text-emerald-700 bg-emerald-50 border-emerald-200';
            default:
                return 'text-gray-700 bg-gray-50 border-gray-200';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                );
            case 'medium':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                );
            case 'low':
                return (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="text-center">
                    <p className="text-gray-600">Project not found</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="mt-4 text-indigo-600 hover:text-indigo-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const columns = [
        { id: 'todo', title: 'To Do', count: getTasksByStatus('todo').length },
        { id: 'in-progress', title: 'In Progress', count: getTasksByStatus('in-progress').length },
        { id: 'completed', title: 'Done', count: getTasksByStatus('completed').length },
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] pattern-bg">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#fff',
                        color: '#111827',
                        border: '1px solid #e5e7eb',
                    },
                }}
            />

            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="text-gray-600 hover:text-gray-900 transition"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: project.color + '15' }}
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            style={{ color: project.color }}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
                                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-md ${project.status === 'active'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                                {project.description && (
                                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* View Toggle */}
                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('board')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${viewMode === 'board'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${viewMode === 'list'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    setEditingTask(null);
                                    setNewTask({
                                        title: '',
                                        description: '',
                                        priority: 'medium',
                                        status: 'todo',
                                        tags: '',
                                    });
                                    setShowModal(true);
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>New Task</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Board View */}
            {viewMode === 'board' ? (
                <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {columns.map((column) => {
                            const columnTasks = getTasksByStatus(column.id as any);

                            return (
                                <div key={column.id} className="flex flex-col">
                                    {/* Column Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-sm font-semibold text-gray-900">{column.title}</h3>
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                {column.count}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tasks */}
                                    <div className="space-y-3">
                                        {columnTasks.length === 0 ? (
                                            <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                                                <p className="text-sm text-gray-500">No tasks yet</p>
                                            </div>
                                        ) : (
                                            columnTasks.map((task) => (
                                                <div
                                                    key={task._id}
                                                    className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                                                    onClick={() => handleEditTask(task)}
                                                >
                                                    {/* Task Header */}
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h4 className="text-sm font-medium text-gray-900 flex-1 pr-2">
                                                            {task.title}
                                                        </h4>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteTask(task._id);
                                                            }}
                                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    {/* Task Description */}
                                                    {task.description && (
                                                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                                            {task.description}
                                                        </p>
                                                    )}

                                                    {/* Tags */}
                                                    {task.tags && task.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                                            {task.tags.map((tag, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Task Footer */}
                                                    <div className="flex items-center justify-between">
                                                        <div className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-md border ${getPriorityColor(task.priority)}`}>
                                                            {getPriorityIcon(task.priority)}
                                                            <span className="capitalize">{task.priority}</span>
                                                        </div>

                                                        {/* Quick Actions */}
                                                        <div className="flex items-center space-x-1">
                                                            {column.id === 'todo' && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleUpdateTaskStatus(task._id, 'in-progress');
                                                                    }}
                                                                    className="px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded transition"
                                                                >
                                                                    Start
                                                                </button>
                                                            )}
                                                            {column.id === 'in-progress' && (
                                                                <>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleUpdateTaskStatus(task._id, 'todo');
                                                                        }}
                                                                        className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded transition"
                                                                    >
                                                                        Back
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleUpdateTaskStatus(task._id, 'completed');
                                                                        }}
                                                                        className="px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded transition"
                                                                    >
                                                                        Done
                                                                    </button>
                                                                </>
                                                            )}
                                                            {column.id === 'completed' && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleUpdateTaskStatus(task._id, 'in-progress');
                                                                    }}
                                                                    className="px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded transition"
                                                                >
                                                                    Reopen
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* List View */
                <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Task
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Priority
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tags
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {tasks.map((task) => (
                                    <tr key={task._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div
                                                className="cursor-pointer"
                                                onClick={() => handleEditTask(task)}
                                            >
                                                <p className="text-sm font-medium text-gray-900">{task.title}</p>
                                                {task.description && (
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${task.status === 'completed'
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : task.status === 'in-progress'
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                }`}>
                                                {task.status === 'in-progress' ? 'In Progress' : task.status === 'todo' ? 'To Do' : 'Done'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-md border ${getPriorityColor(task.priority)}`}>
                                                {getPriorityIcon(task.priority)}
                                                <span className="capitalize">{task.priority}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {task.tags?.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDeleteTask(task._id)}
                                                className="text-gray-400 hover:text-red-600 transition"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Task Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {editingTask ? 'Edit Task' : 'Create Task'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingTask(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                                    placeholder="Enter task title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                                    placeholder="Add task description..."
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Status
                                    </label>
                                    <select
                                        value={newTask.status}
                                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Done</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Priority
                                    </label>
                                    <select
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Tags
                                    <span className="text-xs text-gray-500 ml-2">(comma separated)</span>
                                </label>
                                <input
                                    type="text"
                                    value={newTask.tags}
                                    onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 bg-white"
                                    placeholder="frontend, bug, urgent"
                                />
                            </div>

                            <div className="flex space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingTask(null);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                                >
                                    {editingTask ? 'Update Task' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}