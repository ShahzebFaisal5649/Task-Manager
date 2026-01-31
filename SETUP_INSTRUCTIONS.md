# TaskFlow - Setup & Troubleshooting Guide

## Problem Fixed! ✅

Your registration was failing because the frontend was pointing to a non-existent deployment URL instead of your local backend server.

### What Was Changed:
1. **Frontend API URL Fixed**: Updated [frontend/.env.local](task-manager-mern/frontend/.env.local:1) to point to `http://localhost:5000/api`
2. **Enhanced UI/UX**: Completely redesigned login and registration pages with modern, industry-level design

---

## Quick Start

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if installed as service)
# MongoDB should auto-start

# Or start manually
mongod --dbpath <your-db-path>
```

### 2. Start Backend Server
```bash
cd task-manager-mern/backend
npm install  # If not already installed
npm run dev  # or npm start
```

Backend will run on: `http://localhost:5000`

### 3. Start Frontend (NEW TERMINAL)
```bash
cd task-manager-mern/frontend
npm install  # If not already installed
npm run dev
```

Frontend will run on: `http://localhost:3000`

### 4. Register & Login
- Go to `http://localhost:3000`
- Click "Create account" and register with your details
- Login and start using TaskFlow!

---

## What's New? 🎉

### Enhanced Registration Page
- ✨ **Modern gradient design** with split-screen layout
- 🔒 **Real-time password strength indicator** with visual progress bar
- 👁️ **Password visibility toggles** for both fields
- ✅ **Live password match validation**
- 🎨 **Beautiful feature showcase** on the right side
- 📱 **Fully responsive** for mobile and desktop
- 🎯 **Improved error messages** with animations

### Enhanced Login Page
- 🎨 **Matching design** with registration page
- 🔑 **Remember me** checkbox
- 🔗 **Social login buttons** (Google & Facebook UI - ready for integration)
- 📊 **Feature highlights** with icons
- ⭐ **Customer testimonial** section
- 🎯 **Forgot password** link
- 🌈 **Gradient backgrounds** and smooth animations

### Dashboard Features (Already Excellent!)
- 📊 **Real-time statistics** - Total tasks, in progress, completed, completion rate
- 🎯 **Project filtering** - All, Active, Completed
- 🔍 **Search functionality** for projects
- 📈 **Progress tracking** for each project
- 🎨 **Color-coded projects** for easy identification
- 📱 **Mobile responsive design**
- ⚡ **Fast performance** with optimized data fetching

---

## Features Overview

### Authentication
- JWT-based secure authentication
- 30-day token expiration
- Password hashing with bcrypt
- Protected routes

### Project Management
- Create unlimited projects
- Custom colors for projects
- Track project progress
- Delete projects
- Filter and search projects

### Task Management
- Create tasks within projects
- Set task priorities (low, medium, high)
- Track task status (todo, in-progress, completed)
- Assign tasks to team members
- Add descriptions and tags
- Set due dates

### Dashboard Analytics
- View all statistics at a glance
- Completion rate tracking
- Task distribution visualization
- Project progress monitoring

---

## Folder Structure

```
task-manager-mern/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB schemas (User, Project, Task)
│   ├── routes/          # API routes
│   └── server.js        # Express server
│
├── frontend/
│   ├── app/
│   │   ├── register/    # ✨ Enhanced registration page
│   │   ├── login/       # ✨ Enhanced login page
│   │   ├── dashboard/   # Main dashboard
│   │   └── project/[id]/ # Project detail with Kanban board
│   ├── context/         # React Context (Auth)
│   ├── lib/             # API client & types
│   └── .env.local       # 🔧 FIXED - API URL configuration
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Projects
- `GET /api/projects` - Get all projects (Protected)
- `POST /api/projects` - Create project (Protected)
- `GET /api/projects/:id` - Get single project (Protected)
- `PUT /api/projects/:id` - Update project (Protected)
- `DELETE /api/projects/:id` - Delete project (Protected)

### Tasks
- `GET /api/projects/:projectId/tasks` - Get project tasks (Protected)
- `POST /api/projects/:projectId/tasks` - Create task (Protected)
- `GET /api/tasks/:id` - Get single task (Protected)
- `PUT /api/tasks/:id` - Update task (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)

---

## Troubleshooting

### Registration Still Failing?

1. **Check if backend is running:**
   ```bash
   curl http://localhost:5000/
   # Should return: {"message":"API is running..."}
   ```

2. **Verify MongoDB is connected:**
   - Check backend console for "MongoDB Connected" message
   - If not, ensure MongoDB is running

3. **Restart frontend dev server:**
   ```bash
   # Environment variables require restart to take effect
   cd task-manager-mern/frontend
   # Kill the server (Ctrl+C)
   npm run dev
   ```

4. **Check browser console for errors:**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for any red error messages

5. **Clear browser cache:**
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### Login Issues?

- Make sure you're using the same email/password you registered with
- Check if the account was created successfully (check MongoDB)
- Try registering with a different email

### CORS Errors?

Backend already has CORS enabled. If you still see CORS errors:
- Ensure backend is running on port 5000
- Frontend should be on port 3000
- Check `.env.local` in frontend

---

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=shahzeb_faisal_mern_task_manager_secret_key_2026
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

⚠️ **Important**: Frontend requires server restart after changing `.env.local`

---

## Future Enhancements (Suggestions)

### Authentication
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social login integration (Google, Facebook)
- [ ] Two-factor authentication

### Features
- [ ] Real-time collaboration with Socket.io
- [ ] File attachments for tasks
- [ ] Comments and activity feed
- [ ] Task dependencies
- [ ] Calendar view
- [ ] Time tracking
- [ ] Notifications system
- [ ] Team management
- [ ] Role-based permissions

### UI/UX
- [ ] Dark mode
- [ ] Drag-and-drop task reordering on dashboard
- [ ] Keyboard shortcuts
- [ ] Export projects to PDF
- [ ] Custom themes
- [ ] Emoji reactions

### Analytics
- [ ] Charts with Recharts library
- [ ] Productivity reports
- [ ] Time spent analytics
- [ ] Export data to CSV

---

## Tech Stack

**Frontend:**
- Next.js 16.1.6
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- Axios 1.13.4
- js-cookie 3.0.5
- react-hot-toast

**Backend:**
- Express.js 5.2.1
- MongoDB 9.1.5
- Mongoose 9.1.5
- JWT 9.0.3
- bcryptjs 3.0.3
- CORS 2.8.6

---

## Need Help?

If you encounter any issues:

1. Check this guide first
2. Read error messages carefully
3. Check browser console (F12)
4. Check backend terminal for errors
5. Ensure all services are running (MongoDB, Backend, Frontend)

---

## Summary of Changes Made

### Fixed Issues:
1. ✅ Frontend API URL configuration
2. ✅ Registration failure issue resolved

### Enhanced Pages:
1. ✅ Registration page - Modern, industry-level design
2. ✅ Login page - Professional UI with social login options
3. ✅ Dashboard - Already excellent (no changes needed)

### Files Modified:
- `task-manager-mern/frontend/.env.local` - Fixed API URL
- `task-manager-mern/frontend/app/register/page.tsx` - Complete redesign
- `task-manager-mern/frontend/app/login/page.tsx` - Complete redesign

---

**Happy Task Managing! 🚀**

*TaskFlow - Your productivity companion*
