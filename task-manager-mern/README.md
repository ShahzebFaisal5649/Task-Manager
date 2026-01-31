# TaskFlow

A modern, minimal task management application built with the MERN stack.

![TaskFlow](https://img.shields.io/badge/TaskFlow-Task%20Manager-171717?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)

## Features

- **User Authentication** - Secure JWT-based authentication with registration and login
- **Project Management** - Create, edit, and delete projects with custom colors
- **Task Management** - Full CRUD operations for tasks with status tracking
- **Kanban Board** - Drag-and-drop task management within projects
- **Dashboard Analytics** - Real-time statistics and progress tracking
- **Quick Actions** - Rapidly create tasks from the dashboard
- **Search & Filter** - Find projects and tasks quickly
- **Grid/List Views** - Switch between different project views
- **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **js-cookie** - Cookie management

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taskflow.git
   cd taskflow
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   Backend (`backend/.env`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskflow
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

   Frontend (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Run the backend**
   ```bash
   cd backend
   npm run dev
   ```

7. **Run the frontend** (new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

8. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
taskflow/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── server.js       # Express app
│
└── frontend/
    ├── app/
    │   ├── login/      # Login page
    │   ├── register/   # Registration page
    │   ├── dashboard/  # Main dashboard
    │   └── project/    # Project details & Kanban
    ├── context/        # React Context (Auth)
    └── lib/            # API client & types
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/:id/tasks` | Get project tasks |
| POST | `/api/projects/:id/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Deployment

### Backend (Railway/Render)

1. Push code to GitHub
2. Connect to Railway or Render
3. Set environment variables
4. Deploy

### Frontend (Vercel)

1. Import project from GitHub
2. Set `NEXT_PUBLIC_API_URL` to your backend URL
3. Deploy

## Screenshots

### Dashboard
Clean, minimal dashboard with project overview and quick actions.

### Login
Simple, focused authentication interface.

### Project Board
Kanban-style task management with drag-and-drop.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

Built with care by Shahzeb Faisal
