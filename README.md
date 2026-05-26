# Task and Time Tracking App

A full-stack productivity and task management application where users can manage tasks, track work sessions in real time, and view productivity summaries.

---

## Features

### Authentication
- Signup
- Login
- Logout
- JWT Authentication
- Protected Routes
- User-specific data isolation

### Task Management
- Create Tasks
- Edit Tasks
- Delete Tasks
- Update Status
    - Pending
    - In Progress
    - Completed

### Real-Time Time Tracking
- Start Timer
- Stop Timer
- Live Running Timer
- Store Time Logs
- View Logged Sessions

### Daily Summary
- Total Tasks
- Completed Tasks
- Pending Tasks
- Total Time Tracked

---

## Tech Stack

### Frontend
- React
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt

---

## Local Setup

### Backend

Go to server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create .env:

```env
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET
```

Run:

```bash
node app.js
```

Backend:

```text
http://localhost:5000
```

---

### Frontend

Go to client:

```bash
cd client
```

Install:

```bash
npm install
```

Run:

```bash
npm start
```

## Author

Aishwar Bhatnagar
