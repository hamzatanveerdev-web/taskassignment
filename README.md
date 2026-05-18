# TaskPro - Employee Task Management SaaS Frontend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

Update the following:
- `REACT_APP_API_URL`: Your backend API URL (http://localhost:5000/api/v1 for development)
- `REACT_APP_SOCKET_URL`: Your Socket.io server URL (http://localhost:5000 for development)

### 3. Run the Application
```bash
npm start
```

The application will start at `http://localhost:3000`

### 4. Login Credentials (Development)

**Admin Account:**
- Email: admin@test.com
- Password: password123

**Employee Account:**
- Invite your employee to create account via the "Add Employee" feature in admin panel
- They'll receive an email with setup link

## Features

### Admin Dashboard
- View all task statistics and analytics
- Charts and graphs for task progress
- Employee management
- Task assignment
- Task history and completion tracking
- Real-time notifications
- Dark/Light mode

### Employee Dashboard
- View assigned tasks
- Update task status (Pending → Started → Completed)
- View completed tasks with timestamps
- Real-time notifications
- Profile management
- Dark/Light mode

### Real-time Features
- Live task assignments
- Live status updates
- Live notifications
- Online/offline status tracking

### Responsive Design
- Mobile-friendly
- Tablet-friendly
- Desktop-friendly
- Dark mode support

## Technology Stack

- **React 18**: UI library
- **React Router**: Navigation
- **Axios**: HTTP client
- **Socket.io Client**: Real-time communication
- **Framer Motion**: Animations
- **Tailwind CSS**: Styling
- **React Icons**: Icons
- **React Hot Toast**: Notifications
- **Recharts**: Charts and graphs

## Project Structure

```
src/
├── components/        # Reusable components
├── context/          # React context for state management
├── pages/            # Page components
├── services/         # API services
├── assets/           # Static assets
├── App.jsx           # Main app component
├── index.jsx         # Entry point
└── index.css         # Global styles
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` directory.

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel
4. Deploy

```bash
# Or deploy directly using Vercel CLI
npm i -g vercel
vercel
```
