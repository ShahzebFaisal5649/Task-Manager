<p align="center">
  <img src="task-manager-mern/screenshots/logo.png" alt="TaskFlow Logo" width="80" height="80">
</p>

<h1 align="center">TaskFlow</h1>

<p align="center">
  A modern task management application with a stunning dark UI, built with Next.js and MongoDB.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
</p>

<p align="center">
  <a href="#screenshots">View Screenshots</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a>
</p>

<p align="center">
  <strong>Live Demo:</strong> <a href="https://frontend-bay-tau-52.vercel.app">https://frontend-bay-tau-52.vercel.app</a>
</p>

---

## Screenshots

### Dashboard
The main dashboard features a sleek dark interface with gradient background effects, glassmorphism cards, and real-time statistics.

<p align="center">
  <img src="task-manager-mern/screenshots/Dashboard.jpg" alt="Dashboard" width="100%">
</p>

---

### Login Page
Beautiful dark-themed authentication with animated gradient background effects and glassmorphism form design.

<p align="center">
  <img src="task-manager-mern/screenshots/Login_Page.jpg" alt="Login Page" width="100%">
</p>

---

### Register Page
Matching registration interface with real-time password validation and confirmation feedback.

<p align="center">
  <img src="task-manager-mern/screenshots/Register_Page.jpg" alt="Register Page" width="100%">
</p>

---

### Create Project
Create new projects with custom accent colors in a sleek dark modal.

<p align="center">
  <img src="task-manager-mern/screenshots/Create Project.jpg" alt="Create Project" width="100%">
</p>

---

### Task Creation
Rapidly add tasks to any project with priority and status options.

<p align="center">
  <img src="task-manager-mern/screenshots/Task Creation.jpg" alt="Task Creation" width="100%">
</p>

---

### Progress Tracking
Track your task progress with visual indicators and statistics.

<p align="center">
  <img src="task-manager-mern/screenshots/Progress.jpg" alt="Progress Tracking" width="100%">
</p>

---

## Features

| Feature | Description |
|---------|-------------|
| **Authentication** | Secure JWT-based login & registration |
| **Projects** | Create, edit, delete projects with custom colors |
| **Tasks** | Full CRUD with status & priority tracking |
| **AI Breakdown** | Automatically break down tasks into subtasks using Google Gemini AI |
| **Dashboard** | Real-time statistics and progress tracking |
| **Kanban Board** | Visual task management with status columns |
| **Quick Actions** | Rapidly create tasks from dashboard |
| **Search** | Find projects and tasks quickly |
| **Responsive** | Works on desktop, tablet, and mobile |
| **Dark Theme** | Modern dark UI with gradient accents |
| **Glassmorphism** | Beautiful frosted glass card effects |
| **Serverless** | Deployed on Vercel with serverless API routes |

---

## Tech Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
      <br>Next.js 16
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
      <br>Tailwind
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=mongodb" width="48" height="48" alt="MongoDB" />
      <br>MongoDB
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=vercel" width="48" height="48" alt="Vercel" />
      <br>Vercel
    </td>
  </tr>
</table>

### Frontend & API
- **Next.js 16** - React framework with App Router & API Routes
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling with custom dark theme
- **Mongoose** - MongoDB ODM for serverless functions
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Axios** - HTTP client
- **js-cookie** - Cookie management

### AI Integration
- **Google Gemini AI** - Gemini 2.5 Flash model for intelligent task breakdown

### Database
- **MongoDB** - NoSQL database (hosted on Railway)

### Deployment
- **Vercel** - Frontend & serverless API hosting
- **Railway** - MongoDB database hosting

---

## Architecture

This project uses a **serverless architecture** with Next.js API routes:

```
┌─────────────────────────────────────────────────────────┐
│                      Vercel                              │
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │   Next.js App   │    │   Serverless API Routes     │ │
│  │   (Frontend)    │───▶│   /api/auth/*               │ │
│  │                 │    │   /api/projects/*           │ │
│  │                 │    │   /api/tasks/*              │ │
│  └─────────────────┘    └──────────────┬──────────────┘ │
└────────────────────────────────────────┼────────────────┘
                                         │
                                         ▼
                            ┌─────────────────────────┐
                            │   Railway MongoDB       │
                            │   (Database)            │
                            └─────────────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Railway/Atlas)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShahzebFaisal5649/Task-Manager.git
   cd Task-Manager/task-manager-mern/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=/api
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_secret_key_here
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
task-manager-mern/
├── frontend/
│   ├── app/
│   │   ├── api/              # Serverless API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── projects/     # Project CRUD endpoints
│   │   │   └── tasks/        # Task CRUD endpoints
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   ├── dashboard/        # Main dashboard
│   │   └── project/          # Project details & Kanban
│   ├── context/              # React Context (Auth)
│   └── lib/
│       ├── api.ts            # API client
│       ├── auth.ts           # JWT utilities
│       ├── db.ts             # MongoDB connection
│       ├── models/           # Mongoose models
│       └── types.ts          # TypeScript types
│
├── backend/                  # Legacy Express backend (optional)
│
└── screenshots/              # App screenshots
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/auth/me` | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | Get all projects |
| `POST` | `/api/projects` | Create project |
| `GET` | `/api/projects/:id` | Get project |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects/:id/tasks` | Get project tasks |
| `POST` | `/api/projects/:id/tasks` | Create task |
| `PUT` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Delete task |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/breakdown` | Generate subtasks from task title using AI |

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `task-manager-mern/frontend`

3. **Set environment variables in Vercel**
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
   JWT_SECRET=your_secret_key_here
   ```

4. **Deploy!**

### Database Options

**Railway (Recommended)**
1. Create account at [railway.app](https://railway.app)
2. Add MongoDB database
3. Copy the `MONGO_PUBLIC_URL`
4. Add to Vercel environment variables

**MongoDB Atlas**
1. Create account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create free M0 cluster
3. Get connection string
4. Add to Vercel environment variables

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |
| `NEXT_PUBLIC_API_URL` | API base URL (use `/api` for production) | No |

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ShahzebFaisal5649">Shahzeb Faisal</a>
</p>
