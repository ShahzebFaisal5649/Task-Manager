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
                return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'medium':
                return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'low':
                return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            default:
                return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
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

    const getColumnColor = (columnId: string) => {
        switch (columnId) {
            case 'todo':
                return 'from-gray-500/20 to-gray-600/20';
            case 'in-progress':
                return 'from-cyan-500/20 to-blue-500/20';
            case 'completed':
                return 'from-emerald-500/20 to-green-500/20';
            default:
                return 'from-gray-500/20 to-gray-600/20';
        }
    };

    const getColumnIcon = (columnId: string) => {
        switch (columnId) {
            case 'todo':
                return (
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                );
            case 'in-progress':
                return (
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                );
            case 'completed':
                return (
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="w-12 h-12 border-2 border-cyan-500/20 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-12 h-12 border-2 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-gray-400 text-sm">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-400 mb-4">Project not found</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-cyan-400 hover:text-cyan-300 transition font-medium"
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
        <div className="min-h-screen bg-[#0a0a0f] relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[150px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[120px]"></div>
            </div>

            {/* Grid Pattern */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>

            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: 'rgba(17, 17, 27, 0.95)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(12px)',
                    },
                }}
            />

            {/* Header */}
            <div className="relative z-10 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: project.color + '20' }}
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            style={{ color: project.color }}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-semibold text-white">{project.name}</h1>
                                        {project.description && (
                                            <p className="text-sm text-gray-400 mt-0.5">{project.description}</p>
                                        )}
                                    </div>
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${project.status === 'active'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* View Toggle */}
                            <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/5">
                                <button
                                    onClick={() => setViewMode('board')}
                                    className={`p-2 rounded-lg transition ${viewMode === 'board'
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition ${viewMode === 'list'
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-500 hover:text-gray-300'
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
                                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium rounded-xl hover:from-cyan-400 hover:to-emerald-400 transition shadow-lg shadow-cyan-500/25 flex items-center space-x-2"
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
                <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {columns.map((column) => {
                            const columnTasks = getTasksByStatus(column.id as any);

                            return (
                                <div key={column.id} className="flex flex-col">
                                    {/* Column Header */}
                                    <div className={`flex items-center justify-between mb-4 p-3 rounded-xl bg-gradient-to-r ${getColumnColor(column.id)} border border-white/5`}>
                                        <div className="flex items-center space-x-2">
                                            {getColumnIcon(column.id)}
                                            <h3 className="text-sm font-semibold text-white">{column.title}</h3>
                                        </div>
                                        <span className="px-2.5 py-1 bg-white/10 text-gray-300 text-xs font-medium rounded-lg">
                                            {column.count}
                                        </span>
                                    </div>

                                    {/* Tasks */}
                                    <div className="space-y-3 flex-1">
                                        {columnTasks.length === 0 ? (
                                            <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-xl p-8 text-center">
                                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm text-gray-500">No tasks yet</p>
                                            </div>
                                        ) : (
                                            columnTasks.map((task) => (
                                                <div
                                                    key={task._id}
                                                    className="group bg-white/[0.03] backdrop-blur-sm border border-white/5 rounded-xl p-4 hover:bg-white/[0.05] hover:border-white/10 transition cursor-pointer"
                                                    onClick={() => handleEditTask(task)}
                                                >
                                                    {/* Task Header */}
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h4 className="text-sm font-medium text-white flex-1 pr-2">
                                                            {task.title}
                                                        </h4>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteTask(task._id);
                                                            }}
                                                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition p-1 rounded-lg hover:bg-red-500/10"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    {/* Task Description */}
                                                    {task.description && (
                                                        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                                                            {task.description}
                                                        </p>
                                                    )}

                                                    {/* Tags */}
                                                    {task.tags && task.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                                            {task.tags.map((tag, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-md border border-white/5"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Task Footer */}
                                                    <div className="flex items-center justify-between">
                                                        <div className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-lg border ${getPriorityColor(task.priority)}`}>
                                                            {getPriorityIcon(task.priority)}
                                                            <span className="capitalize">{task.priority}</span>
                                                        </div>

                                                        {/* Quick Actions */}
                                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                                                            {column.id === 'todo' && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleUpdateTaskStatus(task._id, 'in-progress');
                                                                    }}
                                                                    className="px-2 py-1 text-xs text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition"
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
                                                                        className="px-2 py-1 text-xs text-gray-400 hover:bg-white/5 rounded-lg transition"
                                                                    >
                                                                        Back
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleUpdateTaskStatus(task._id, 'completed');
                                                                        }}
                                                                        className="px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
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
                                                                    className="px-2 py-1 text-xs text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition"
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
                <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-white/[0.02] border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Task
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Priority
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Tags
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {tasks.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-400">No tasks yet. Create your first task!</p>
                                        </td>
                                    </tr>
                                ) : (
                                    tasks.map((task) => (
                                        <tr key={task._id} className="hover:bg-white/[0.02] transition">
                                            <td className="px-6 py-4">
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => handleEditTask(task)}
                                                >
                                                    <p className="text-sm font-medium text-white">{task.title}</p>
                                                    {task.description && (
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${task.status === 'completed'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : task.status === 'in-progress'
                                                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                                    }`}>
                                                    {task.status === 'in-progress' ? 'In Progress' : task.status === 'todo' ? 'To Do' : 'Done'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-lg border ${getPriorityColor(task.priority)}`}>
                                                    {getPriorityIcon(task.priority)}
                                                    <span className="capitalize">{task.priority}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {task.tags?.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-md border border-white/5"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteTask(task._id)}
                                                    className="text-gray-500 hover:text-red-400 transition p-2 rounded-lg hover:bg-red-500/10"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Task Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-white">
                                    {editingTask ? 'Edit Task' : 'Create Task'}
                                </h2>
                            </div>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingTask(null);
                                }}
                                className="text-gray-500 hover:text-gray-300 p-2 rounded-xl hover:bg-white/5 transition"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-gray-500 transition caret-white"
                                    placeholder="Enter task title"
                                    style={{ color: '#ffffff' }}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-gray-500 transition resize-none caret-white"
                                    placeholder="Add task description..."
                                    style={{ color: '#ffffff' }}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={newTask.status}
                                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white transition appearance-none cursor-pointer"
                                        style={{ color: '#ffffff' }}
                                    >
                                        <option value="todo" className="bg-[#12121a]">To Do</option>
                                        <option value="in-progress" className="bg-[#12121a]">In Progress</option>
                                        <option value="completed" className="bg-[#12121a]">Done</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Priority
                                    </label>
                                    <select
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white transition appearance-none cursor-pointer"
                                        style={{ color: '#ffffff' }}
                                    >
                                        <option value="low" className="bg-[#12121a]">Low</option>
                                        <option value="medium" className="bg-[#12121a]">Medium</option>
                                        <option value="high" className="bg-[#12121a]">High</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Tags
                                    <span className="text-xs text-gray-500 ml-2">(comma separated)</span>
                                </label>
                                <input
                                    type="text"
                                    value={newTask.tags}
                                    onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-gray-500 transition caret-white"
                                    placeholder="frontend, bug, urgent"
                                    style={{ color: '#ffffff' }}
                                />
                            </div>

                            <div className="flex space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingTask(null);
                                    }}
                                    className="flex-1 px-4 py-3 border border-white/10 text-gray-300 text-sm font-medium rounded-xl hover:bg-white/5 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium rounded-xl hover:from-cyan-400 hover:to-emerald-400 transition shadow-lg shadow-cyan-500/25"
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
