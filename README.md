# Blog Platform (MERN-style split structure)

This repository now follows a **separated project layout**:

```
blog-platform/
├── backend/
└── frontend/
```

> In this environment the repository root is the project root, so `backend/` and `frontend/` are top-level folders.

## Backend structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   └── commentController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   └── commentRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   └── app.js
├── server.js
├── .env.example
└── package.json
```

## Frontend structure (React + Vite)

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axios.js
│   ├── components/
│   │   ├── PostList.jsx
│   │   ├── PostCard.jsx
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Login.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── package.json
└── vite.config.js
```

## Backend setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000` by default.

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Implemented requirements

- JWT register/login
- Roles: reader, writer, admin
- Post CRUD with ownership checks, draft/published status
- Reader sees only published posts
- Pagination and search in posts endpoint
- Comments on published posts by authenticated users
- Comment deletion by owner/admin
- React frontend home page fetching and listing published posts
