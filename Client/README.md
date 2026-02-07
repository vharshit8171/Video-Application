# 🎬 Video Streaming Platform

A full-stack video streaming platform inspired by YouTube, built to understand and implement real-world frontend and backend architecture.  
This project focuses on scalability, clean API design, authentication, state management, and a smooth user experience.

---

## 🚀 Core Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Secure protected routes
- Only owners can modify their content (videos, playlists, channels)
- Middleware-based request validation

---

## 📺 Video Management

- Upload videos
- Edit video details (title, description, category, thumbnail)
- Delete videos
- Watch video page
- Video duration & metadata handling
- Responsive video preview cards

---

## 📂 Playlists

- Create playlists
- Delete playlists
- View all user playlists
- Playlist detail page
- Save a single video to **multiple playlists**
- Remove videos from playlists
- Duplicate video prevention
- Owner-only playlist modification
- Graceful empty playlist UI

---

## 🏷️ Channels

- Create a channel
- Channel detail page
- Channel info section
- Edit and Delete options
- List of published videos under a channel
- Channel ownership enforcement

---

## 👤 User Profile

- User profile page
- User-uploaded videos listing
- User playlists
- Watch history integration
- Secure profile-specific data fetching

---

## 🔍 Search & Discovery

- Search videos by:
  - Title
  - Description
  - Category
- Regex-based flexible search
- Empty state handling for no results

---

## 🎨 UI & UX

- Fully responsive layout
- Tailwind CSS styling
- Modal-based interactions (Create Playlist, Save Video)
- Page loaders & skeleton states
- Hover effects and smooth transitions
- Empty state handling for videos, playlists, and search

---

## 🧠 Architecture Decisions

- **Zustand** for global state management
- Backend returns updated entities → frontend directly syncs state
- Centralized error handling using custom API responses
- Modular folder structure for scalability
- Clean separation of concerns (controllers, routes, models)

---

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- Zustand for State Management
- Axios
- React Router DOM
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Custom Error & Response utilities

