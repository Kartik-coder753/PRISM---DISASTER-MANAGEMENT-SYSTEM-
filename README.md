# PRISM---DISASTER-MANAGEMENT-SYSTEM-

🚀 Tech Stack
Frontend
React 18 with TypeScript

Vite for build tooling

Tailwind CSS with custom theming

Shadcn/UI components (Radix UI based)

TanStack Query for data fetching

Zod for schema validation

React Hook Form for form handling

Framer Motion for animations

Backend
Express.js server

TypeScript throughout

Drizzle ORM for PostgreSQL

Passport.js for authentication

Express Session with PostgreSQL session store

WebSocket support (ws)

Database
PostgreSQL via Drizzle ORM

Neon serverless driver

Drizzle Kit for migrations

📁 Project Structure
text
├── client/           # React frontend application
│   └── src/         # Frontend source code
├── server/          # Express backend server
├── shared/          # Shared code between client/server
│   └── schema.ts    # Database schema definitions
├── migrations/      # Database migrations (generated)
└── dist/           # Build output
🛠️ Prerequisites
Node.js (v18+ recommended)

PostgreSQL database

Replit environment (optional)

🔧 Setup & Installation
Clone the repository

bash
git clone <repository-url>
cd rest-express
Install dependencies

bash
npm install
Environment Setup

Set up a PostgreSQL database

Set the DATABASE_URL environment variable:

text
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
Database Setup

bash
# Push schema to database
npm run db:push
📦 Available Scripts
npm run dev - Start development server

npm run build - Build for production

npm run start - Start production server

npm run check - TypeScript type checking

npm run db:push - Push database schema changes

🔌 Key Features
Frontend
Modern React with TypeScript

Component library with Shadcn/UI

Dark/light theme support

Responsive design

Form validation with React Hook Form + Zod

State management with Zustand

Real-time updates with WebSockets

Backend
Express.js REST API

Session-based authentication

PostgreSQL database with Drizzle ORM

Type-safe database operations

File structure optimized for full-stack TypeScript

Development
Hot reload for both client and server

TypeScript across entire stack

Vite for fast development builds

Tailwind CSS with JIT compilation

Replit integration support

🎨 Styling & UI
Tailwind CSS with custom configuration

CSS Variables for theming

Tailwind Merge for class combination

Tailwind Animate for animations

Radix UI primitive components

Lucide React for icons

📊 Database
Drizzle ORM for type-safe queries

PostgreSQL as primary database

Drizzle Kit for migrations

Drizzle Zod for schema validation

Connect-pg-simple for session storage

🔒 Security
Passport.js authentication

Express Session with secure settings

PostgreSQL session store

Environment variable configuration

Type-safe input validation

🚀 Deployment
The project is configured for deployment on various platforms:

Build the application:

bash
npm run build
Start production server:

bash
npm start
📄 Configuration Files
drizzle.config.ts - Database migration configuration

tailwind.config.ts - Tailwind CSS customization

vite.config.ts - Vite build configuration

tsconfig.json - TypeScript configuration

theme.json - Shadcn/UI theme configuration

🔗 Dependencies Highlights
UI Components: Comprehensive Radix UI component suite

Data Visualization: Recharts for charts

Maps: Leaflet for map integration

Date Handling: date-fns for date manipulation

Communication: Twilio for SMS/voice integration

Real-time: WebSocket support for live updates

🤝 Development Notes
The project uses ES modules (type: "module" in package.json)

Shared TypeScript types between client and server

Path aliases configured for cleaner imports

Hot reload works in Replit environment

Database schema defined in shared/schema.ts

📈 Next Steps
Set up your PostgreSQL database

Configure environment variables

Run npm run db:push to initialize database

Start development with npm run dev

Customize theme in theme.json
