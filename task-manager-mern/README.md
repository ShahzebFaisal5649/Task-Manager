<p align="center">
  <img src="screenshots/logo.png" alt="TaskFlow Logo" width="80" height="80">
</p>

<h1 align="center">TaskFlow</h1>

<p align="center">
  A modern task management application with a stunning dark UI, built with the MERN stack.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind">
</p>

<p align="center">
  <a href="#screenshots">View Screenshots</a> •
  <a href="#features">Features</a> •
  <a href="#design">Design</a> •
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
  <img src="screenshots/dashboard.png" alt="Dashboard" width="100%">
</p>

**Key Features:**
- Personalized greeting based on time of day
- Task statistics with animated colored icons (Total, In Progress, Completed, Progress %)
- Quick Actions panel with gradient buttons
- Recent Tasks list with priority indicators
- Project cards with progress bars and hover effects
- Grid/List view toggle
- Search functionality

---

### Login Page
Beautiful dark-themed authentication with animated gradient background effects and glassmorphism form design.

<p align="center">
  <img src="screenshots/login.png" alt="Login Page" width="400">
</p>

**Design Highlights:**
- Deep dark background (#0a0a0f)
- Animated purple/indigo gradient blur orbs
- Subtle grid pattern overlay
- Glassmorphism card with backdrop blur
- Gradient submit button with glow effect
- Show/hide password toggle

---

### Register Page
Matching registration interface with real-time password validation and confirmation feedback.

<p align="center">
  <img src="screenshots/register.png" alt="Register Page" width="400">
</p>

---

### Project Board (Kanban)
Organize tasks with a stunning Kanban board featuring color-coded columns and smooth interactions.

<p align="center">
  <img src="screenshots/kanban.png" alt="Project Kanban Board" width="100%">
</p>

**Features:**
- Three columns with gradient headers: To Do, In Progress, Done
- Column-specific icons and colors
- Glassmorphism task cards with hover effects
- Priority badges (High, Medium, Low) with color indicators
- Quick action buttons (Start, Back, Done, Reopen)
- Tag support for better organization
- Board/List view toggle
- Dark-themed task creation modal

---

### Create Project Modal
Create new projects with custom accent colors in a sleek dark modal.

<p align="center">
  <img src="screenshots/create-project.png" alt="Create Project Modal" width="400">
</p>

---

### Quick Task Modal
Rapidly add tasks to any project with priority and status options.

<p align="center">
  <img src="screenshots/quick-task.png" alt="Quick Task Modal" width="400">
</p>

---

### Mobile Responsive
Fully responsive dark design that looks stunning on all devices.

<p align="center">
  <img src="screenshots/mobile-dashboard.png" alt="Mobile Dashboard" width="300">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="screenshots/mobile-login.png" alt="Mobile Login" width="300">
</p>

---

## Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure JWT-based login & registration |
| 📁 **Projects** | Create, edit, delete projects with custom colors |
| ✅ **Tasks** | Full CRUD with status & priority tracking |
| 📊 **Dashboard** | Real-time statistics and progress tracking |
| 🎯 **Kanban Board** | Visual task management with status columns |
| ⚡ **Quick Actions** | Rapidly create tasks from dashboard |
| 🔍 **Search** | Find projects and tasks quickly |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |
| 🌙 **Dark Theme** | Modern dark UI with gradient accents |
| ✨ **Glassmorphism** | Beautiful frosted glass card effects |

---

## Design

TaskFlow features a modern dark theme with carefully crafted visual elements:

### Color Palette
| Element | Color |
|---------|-------|
| Background | `#0a0a0f` (Deep Dark) |
| Cards | `rgba(255,255,255,0.03)` with backdrop blur |
| Primary Accent | Indigo-Purple Gradient |
| Success | Emerald `#10b981` |
| Warning | Amber `#f59e0b` |
| Error | Red `#ef4444` |

### Visual Effects
- **Gradient Blur Orbs** - Animated background effects
- **Grid Pattern** - Subtle overlay texture
- **Glassmorphism** - Frosted glass cards with `backdrop-blur`
- **Glow Shadows** - Colored shadows on interactive elements
- **Smooth Transitions** - 200ms ease transitions throughout

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
      <img src="https://skillicons.dev/icons?i=express" width="48" height="48" alt="Express" />
      <br>Express
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=mongodb" width="48" height="48" alt="MongoDB" />
      <br>MongoDB
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=nodejs" width="48" height="48" alt="Node.js" />
      <br>Node.js
    </td>
  </tr>
</table>

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom dark theme
- **Axios** - HTTP client
- **js-cookie** - Cookie management
- **react-hot-toast** - Beautiful toast notifications

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShahzebFaisal5649/Task-Manager.git
   cd Task-Manager/task-manager-mern
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

---

## Project Structure

```
task-manager-mern/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── server.js       # Express app
│
├── frontend/
│   ├── app/
│   │   ├── login/      # Login page (dark theme)
│   │   ├── register/   # Registration page (dark theme)
│   │   ├── dashboard/  # Main dashboard (dark theme)
│   │   └── project/    # Project details & Kanban (dark theme)
│   ├── context/        # React Context (Auth)
│   └── lib/            # API client & types
│
└── screenshots/        # App screenshots
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

---

## Deployment

### Backend (Railway/Render)

1. Push code to GitHub
2. Connect to [Railway](https://railway.app) or [Render](https://render.com)
3. Set environment variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Your secret key
   - `NODE_ENV` - `production`
4. Deploy

### Frontend (Vercel)

1. Import project from GitHub
2. Set root directory to `task-manager-mern/frontend`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` - Your deployed backend URL
4. Deploy

**Live Demo:** [https://frontend-bay-tau-52.vercel.app](https://frontend-bay-tau-52.vercel.app)

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
