'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { projectAPI, taskAPI } from '@/lib/api';
import { Project, Task } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showQuickTask, setShowQuickTask] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [newProject, setNewProject] = useState({ name: '', description: '', color: '#171717' });
    const [quickTask, setQuickTask] = useState({ title: '', projectId: '' });
    const router = useRouter();

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const response = await projectAPI.getAll();
            const projectsData = response.data.data;
            setProjects(projectsData);

            const tasksPromises = projectsData.map((p: Project) =>
                taskAPI.getAll(p._id).catch(() => ({ data: { data: [] } }))
            );
            const tasksResponses = await Promise.all(tasksPromises);
            const allTasksData = tasksResponses.flatMap(r => r.data.data);
            setAllTasks(allTasksData);
        } catch (error) {
            console.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await projectAPI.create(newProject);
            setShowModal(false);
            setNewProject({ name: '', description: '', color: '#171717' });
            fetchData();
        } catch (error) {
            console.error('Failed to create project');
        }
    };

    const handleQuickTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickTask.projectId || !quickTask.title) return;
        try {
            await taskAPI.create(quickTask.projectId, { title: quickTask.title, status: 'todo', priority: 'medium' });
            setQuickTask({ title: '', projectId: '' });
            setShowQuickTask(false);
            fetchData();
        } catch (error) {
            console.error('Failed to create task');
        }
    };

    const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this project?')) {
            try {
                await projectAPI.delete(id);
                fetchData();
            } catch (error) {
                console.error('Failed to delete');
            }
        }
    };

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = allTasks.filter(t => t.status === 'in-progress').length;
    const todoTasks = allTasks.filter(t => t.status === 'todo').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Recent tasks
    const recentTasks = [...allTasks]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    // Upcoming due tasks
    const upcomingTasks = allTasks
        .filter(t => t.dueDate && t.status !== 'completed')
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
        .slice(0, 3);

    const colors = ['#171717', '#404040', '#525252', '#737373', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-14">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                                    <rect x="9" y="3" width="6" height="4" rx="1" />
                                    <path d="M9 14l2 2 4-4" />
                                </svg>
                            </div>
                            <span className="font-semibold text-neutral-900">TaskFlow</span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="hidden sm:flex items-center space-x-2 text-sm">
                                <div className="w-7 h-7 bg-neutral-200 rounded-full flex items-center justify-center">
                                    <span className="text-neutral-700 font-medium text-xs">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-neutral-600">{user.name}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-neutral-900">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user.name.split(' ')[0]}</h1>
                    <p className="text-neutral-500 text-sm mt-1">Here's what's happening with your projects</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    <div className="bg-white border border-neutral-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Total Tasks</p>
                                <p className="text-2xl font-semibold text-neutral-900 mt-1">{totalTasks}</p>
                            </div>
                            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">In Progress</p>
                                <p className="text-2xl font-semibold text-neutral-900 mt-1">{inProgressTasks}</p>
                            </div>
                            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Completed</p>
                                <p className="text-2xl font-semibold text-neutral-900 mt-1">{completedTasks}</p>
                            </div>
                            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Progress</p>
                                <p className="text-2xl font-semibold text-neutral-900 mt-1">{completionRate}%</p>
                            </div>
                            <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-3 bg-neutral-200 rounded-full h-1.5">
                            <div className="bg-neutral-900 h-1.5 rounded-full transition-all" style={{ width: `${completionRate}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Recent */}
                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                    {/* Quick Actions */}
                    <div className="bg-white border border-neutral-200 rounded-xl p-5">
                        <h3 className="font-medium text-neutral-900 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                            >
                                <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="text-sm text-neutral-700">New Project</span>
                            </button>
                            <button
                                onClick={() => setShowQuickTask(true)}
                                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                                disabled={projects.length === 0}
                            >
                                <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <span className="text-sm text-neutral-700">Quick Task</span>
                            </button>
                        </div>
                    </div>

                    {/* Recent Tasks */}
                    <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl p-5">
                        <h3 className="font-medium text-neutral-900 mb-4">Recent Tasks</h3>
                        {recentTasks.length === 0 ? (
                            <p className="text-sm text-neutral-500">No tasks yet</p>
                        ) : (
                            <div className="space-y-2">
                                {recentTasks.map(task => {
                                    const project = projects.find(p => p._id === task.project);
                                    return (
                                        <div key={task._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                            <div className="flex items-center space-x-3 min-w-0">
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                                    task.status === 'completed' ? 'bg-emerald-500' :
                                                    task.status === 'in-progress' ? 'bg-amber-500' : 'bg-neutral-300'
                                                }`}></div>
                                                <span className="text-sm text-neutral-700 truncate">{task.title}</span>
                                            </div>
                                            <span className="text-xs text-neutral-400 flex-shrink-0 ml-2">{project?.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Projects Section */}
                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                        <div>
                            <h3 className="font-medium text-neutral-900">Projects</h3>
                            <p className="text-sm text-neutral-500">{projects.length} projects</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="relative flex-1 sm:flex-initial">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 w-full sm:w-48 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                />
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center bg-neutral-100 rounded-lg p-1">
                                <button
                                    onClick={() => setView('grid')}
                                    className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-white shadow-sm' : 'text-neutral-500'}`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white shadow-sm' : 'text-neutral-500'}`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>

                            {/* New Project Button */}
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-3 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors flex items-center space-x-1"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="hidden sm:inline">New</span>
                            </button>
                        </div>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <p className="text-neutral-600 font-medium">No projects yet</p>
                            <p className="text-neutral-500 text-sm mt-1">Create your first project to get started</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="mt-4 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800"
                            >
                                Create Project
                            </button>
                        </div>
                    ) : view === 'grid' ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredProjects.map(project => {
                                const projectTasks = allTasks.filter(t => t.project === project._id);
                                const completed = projectTasks.filter(t => t.status === 'completed').length;
                                const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;

                                return (
                                    <div
                                        key={project._id}
                                        onClick={() => router.push(`/project/${project._id}`)}
                                        className="group border border-neutral-200 rounded-xl p-4 hover:border-neutral-300 hover:shadow-sm cursor-pointer transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: project.color + '15' }}
                                            >
                                                <svg className="w-5 h-5" style={{ color: project.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                                </svg>
                                            </div>
                                            <button
                                                onClick={(e) => handleDeleteProject(project._id, e)}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500 transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <h4 className="font-medium text-neutral-900 mb-1">{project.name}</h4>
                                        <p className="text-sm text-neutral-500 line-clamp-2 mb-3 min-h-[40px]">
                                            {project.description || 'No description'}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                                            <span>{completed}/{projectTasks.length} tasks</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="bg-neutral-100 rounded-full h-1.5">
                                            <div
                                                className="h-1.5 rounded-full transition-all"
                                                style={{ width: `${progress}%`, backgroundColor: project.color }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredProjects.map(project => {
                                const projectTasks = allTasks.filter(t => t.project === project._id);
                                const completed = projectTasks.filter(t => t.status === 'completed').length;
                                const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;

                                return (
                                    <div
                                        key={project._id}
                                        onClick={() => router.push(`/project/${project._id}`)}
                                        className="group flex items-center justify-between p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 cursor-pointer transition-all"
                                    >
                                        <div className="flex items-center space-x-4 min-w-0">
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: project.color }}
                                            ></div>
                                            <div className="min-w-0">
                                                <h4 className="font-medium text-neutral-900 truncate">{project.name}</h4>
                                                <p className="text-sm text-neutral-500 truncate">{project.description || 'No description'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm text-neutral-500">{completed}/{projectTasks.length}</span>
                                            <div className="w-24 bg-neutral-100 rounded-full h-1.5 hidden sm:block">
                                                <div className="h-1.5 rounded-full" style={{ width: `${progress}%`, backgroundColor: project.color }}></div>
                                            </div>
                                            <button
                                                onClick={(e) => handleDeleteProject(project._id, e)}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-500"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Project Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-semibold text-neutral-900">New Project</h2>
                            <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Name</label>
                                <input
                                    type="text"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                    placeholder="Project name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
                                <textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                    placeholder="What's this project about?"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewProject({ ...newProject, color })}
                                            className={`w-8 h-8 rounded-lg transition-transform ${newProject.color === color ? 'ring-2 ring-offset-2 ring-neutral-900 scale-110' : 'hover:scale-110'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Quick Task Modal */}
            {showQuickTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-semibold text-neutral-900">Quick Task</h2>
                            <button onClick={() => setShowQuickTask(false)} className="text-neutral-400 hover:text-neutral-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleQuickTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Project</label>
                                <select
                                    value={quickTask.projectId}
                                    onChange={(e) => setQuickTask({ ...quickTask, projectId: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent bg-white"
                                    required
                                >
                                    <option value="">Select project</option>
                                    {projects.map(p => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Task</label>
                                <input
                                    type="text"
                                    value={quickTask.title}
                                    onChange={(e) => setQuickTask({ ...quickTask, title: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                                    placeholder="What needs to be done?"
                                    required
                                />
                            </div>
                            <div className="flex space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowQuickTask(false)}
                                    className="flex-1 px-4 py-2.5 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800"
                                >
                                    Add Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
