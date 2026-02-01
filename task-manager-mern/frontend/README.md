# TaskFlow Frontend

A modern task management application built with Next.js 16, featuring serverless API routes and MongoDB integration.

## Live Demo

**[https://frontend-bay-tau-52.vercel.app](https://frontend-bay-tau-52.vercel.app)**

## Features

- User Authentication (JWT-based)
- Project Management with custom colors
- Kanban Task Board with drag & drop
- Real-time Statistics Dashboard
- Priority & Status Management
- Mobile Responsive Design
- Dark Theme with Glassmorphism UI

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Project Structure

```
frontend/
├── app/
│   ├── api/                    # Serverless API routes
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   └── me/route.ts
│   │   ├── projects/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── tasks/route.ts
│   │   └── tasks/
│   │       └── [id]/route.ts
│   ├── dashboard/page.tsx      # Main dashboard
│   ├── login/page.tsx          # Login page
│   ├── register/page.tsx       # Registration page
│   └── project/[id]/page.tsx   # Project detail & Kanban
├── context/
│   └── AuthContext.tsx         # Authentication context
├── lib/
│   ├── api.ts                  # Axios API client
│   ├── auth.ts                 # JWT utilities
│   ├── db.ts                   # MongoDB connection
│   ├── models/                 # Mongoose models
│   │   ├── User.ts
│   │   ├── Project.ts
│   │   └── Task.ts
│   └── types.ts                # TypeScript types
└── public/
    └── logo.png                # App logo
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your values
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=/api
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_secret_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your secret key
4. Deploy

### Database Setup

**Railway:**
1. Create MongoDB database at [railway.app](https://railway.app)
2. Copy `MONGO_PUBLIC_URL`
3. Add to Vercel environment variables

**MongoDB Atlas:**
1. Create cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Get connection string
3. Add to Vercel environment variables

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/projects/:id/tasks` | Get tasks |
| POST | `/api/projects/:id/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Author

**Shahzeb Faisal**
- GitHub: [@ShahzebFaisal5649](https://github.com/ShahzebFaisal5649)
- Email: shahzebfaisal5649@gmail.com

## License

MIT License
