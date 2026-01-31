'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { projectAPI, taskAPI } from '@/lib/api';
import { Project, Task } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showQuickTask, setShowQuickTask] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newProject, setNewProject] = useState({ name: '', description: '', color: '#06b6d4' });
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
            setNewProject({ name: '', description: '', color: '#06b6d4' });
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

    const colors = ['#06b6d4', '#0ea5e9', '#22c55e', '#10b981', '#14b8a6', '#f59e0b', '#f97316', '#ec4899', '#8b5cf6', '#6366f1'];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0f] relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]"></div>
            </div>

            {/* Grid Pattern */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>

            {/* Navbar */}
            <nav className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                                <Image
                                    src="/logo.png"
                                    alt="TaskFlow Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold text-white">TaskFlow</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center space-x-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-gray-300 text-sm font-medium">{user.name}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 hover:bg-white/5 rounded-lg"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user.name.split(' ')[0]}
                    </h1>
                    <p className="text-gray-400">Here's what's happening with your projects</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Total Tasks */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{totalTasks}</p>
                        <p className="text-sm text-gray-400">Total Tasks</p>
                    </div>

                    {/* In Progress */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{inProgressTasks}</p>
                        <p className="text-sm text-gray-400">In Progress</p>
                    </div>

                    {/* Completed */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{completedTasks}</p>
                        <p className="text-sm text-gray-400">Completed</p>
                    </div>

                    {/* Progress */}
                    <div className="bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-5 hover:from-cyan-500/30 hover:to-emerald-500/30 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{completionRate}%</p>
                        <p className="text-sm text-gray-300">Progress</p>
                        <div className="mt-3 bg-white/10 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-2 rounded-full transition-all"
                                style={{ width: `${completionRate}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Quick Actions */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowModal(true)}
                                className="w-full flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all text-left group"
                            >
                                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                                    <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">New Project</p>
                                    <p className="text-gray-500 text-xs">Create a new project</p>
                                </div>
                            </button>
                            <button
                                onClick={() => setShowQuickTask(true)}
                                disabled={projects.length === 0}
                                className="w-full flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all text-left group disabled:opacity-50"
                            >
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">Quick Task</p>
                                    <p className="text-gray-500 text-xs">Add task to project</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Recent Tasks */}
                    <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Recent Tasks
                        </h3>
                        {recentTasks.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <p className="text-gray-400">No tasks yet</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {recentTasks.map(task => {
                                    const project = projects.find(p => p._id === task.project);
                                    return (
                                        <div key={task._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center space-x-3 min-w-0">
                                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                                    task.status === 'completed' ? 'bg-emerald-500' :
                                                    task.status === 'in-progress' ? 'bg-amber-500' : 'bg-gray-500'
                                                }`}></div>
                                                <span className="text-gray-200 text-sm truncate">{task.title}</span>
                                            </div>
                                            <span className="text-xs text-gray-500 flex-shrink-0 ml-3 px-2 py-1 bg-white/5 rounded-md">{project?.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Projects Section */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white flex items-center">
                                <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                Projects
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">{projects.length} projects</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full sm:w-48 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 caret-white"
                                    style={{ color: '#ffffff' }}
                                />
                            </div>

                            {/* New Project Button */}
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium rounded-xl hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-lg shadow-cyan-500/25 flex items-center space-x-2"
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
                        <div className="flex justify-center py-16">
                            <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <p className="text-white font-medium mb-1">No projects yet</p>
                            <p className="text-gray-500 text-sm mb-4">Create your first project to get started</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium rounded-xl hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-lg shadow-cyan-500/25"
                            >
                                Create Project
                            </button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredProjects.map(project => {
                                const projectTasks = allTasks.filter(t => t.project === project._id);
                                const completed = projectTasks.filter(t => t.status === 'completed').length;
                                const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;

                                return (
                                    <div
                                        key={project._id}
                                        onClick={() => router.push(`/project/${project._id}`)}
                                        className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] hover:border-white/20 cursor-pointer transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                style={{ backgroundColor: `${project.color}20` }}
                                            >
                                                <svg className="w-6 h-6" style={{ color: project.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                                </svg>
                                            </div>
                                            <button
                                                onClick={(e) => handleDeleteProject(project._id, e)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <h4 className="font-semibold text-white mb-1">{project.name}</h4>
                                        <p className="text-sm text-gray-400 line-clamp-2 mb-4 min-h-[40px]">
                                            {project.description || 'No description'}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                            <span>{completed}/{projectTasks.length} tasks</span>
                                            <span style={{ color: project.color }}>{progress}%</span>
                                        </div>
                                        <div className="bg-white/10 rounded-full h-1.5">
                                            <div
                                                className="h-1.5 rounded-full transition-all"
                                                style={{ width: `${progress}%`, backgroundColor: project.color }}
                                            ></div>
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
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">New Project</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-500 caret-white"
                                    placeholder="Project name"
                                    style={{ color: '#ffffff' }}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-500 caret-white"
                                    placeholder="What's this project about?"
                                    style={{ color: '#ffffff' }}
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewProject({ ...newProject, color })}
                                            className={`w-9 h-9 rounded-xl transition-all ${newProject.color === color ? 'ring-2 ring-offset-2 ring-offset-[#12121a] ring-white scale-110' : 'hover:scale-110'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium rounded-xl hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-lg shadow-cyan-500/25"
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
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">Quick Task</h2>
                            <button onClick={() => setShowQuickTask(false)} className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleQuickTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Project</label>
                                <select
                                    value={quickTask.projectId}
                                    onChange={(e) => setQuickTask({ ...quickTask, projectId: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white"
                                    required
                                    style={{ color: '#ffffff' }}
                                >
                                    <option value="" className="bg-[#12121a]">Select project</option>
                                    {projects.map(p => (
                                        <option key={p._id} value={p._id} className="bg-[#12121a]">{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Task</label>
                                <input
                                    type="text"
                                    value={quickTask.title}
                                    onChange={(e) => setQuickTask({ ...quickTask, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-500 caret-white"
                                    placeholder="What needs to be done?"
                                    style={{ color: '#ffffff' }}
                                    required
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowQuickTask(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium rounded-xl hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-lg shadow-cyan-500/25"
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
