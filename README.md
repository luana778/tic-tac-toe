# 🎮 Tic-Tac-Toe Multiplayer App

A real-time multiplayer Tic-Tac-Toe game built with:

* ⚛️ React + TypeScript (Frontend)
* 🌐 Node.js + Express + Socket.io (Backend)
* 🗄️ MySQL Database

---

## 🚀 Features

* 🔐 User Authentication (Sign Up / Sign In)
* 🏠 Create & Join Game Rooms
* 🎮 Real-time Multiplayer (Socket.io)
* 👀 Spectator Mode
* 🧠 Server-side Game Validation (Anti-cheat)
* 🔄 Game Reset

---

## 📦 Project Structure

```
frontend/    → Frontend (React + Vite)
backend/    → Backend (Node.js + Express + Socket.io)
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

---

## 🖥️ Run Application

### ▶️ Backend

```
cd backend
npm install
npm start
```

---

### ▶️ Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🗄️ Database Setup (MySQL)

Run these queries:

```sql
CREATE DATABASE tic;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_x INT NOT NULL,
  player_o INT NOT NULL,
  winner INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_x) REFERENCES users(id),
  FOREIGN KEY (player_o) REFERENCES users(id)
);
```

---

## 🔌 Environment Config

Update backend DB connection in:

```
server/src/config/db.js
```

Example:

```js
host: "localhost",
user: "root",
password: "",
database: "tic",
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description   |
| ------ | -------- | ------------- |
| POST   | /signup  | Register user |
| POST   | /signin  | Login user    |
| GET    | /rooms   | Get all rooms |

---

## 🔄 Socket Events

### Client → Server

* `joinRoom`
* `move`
* `resetGame`

### Server → Client

* `updateRoom`
* `move`

---

## 🎯 Tech Stack

* React
* TypeScript
* Node.js
* Express
* Socket.io
* MySQL
* Axios

---

## 📌 Notes

* Make sure backend runs on **http://localhost:5137**
* Frontend runs on **http://localhost:5173**
* Ensure CORS is enabled in backend

---

## 🚀 Future Improvements

* 🎨 UI Enhancements
* 🌙 Dark Mode
* 🧠 AI Opponent
* 🔐 JWT Authentication
* ☁️ Deployment (Render / Vercel)

---

## 👨‍💻 Author

Your Name

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
