# Blog API

A RESTful backend API for a Facebook-style blog/social feed app, built to practice **Express.js**, **MongoDB**, and **authentication with JWT**. Users can register, log in, create posts, like/unlike posts, and comment on them.

**Live API:** `https://blog-api-production-11d7.up.railway.app`

---

## Features

- **Authentication** — JWT-based auth with session tracking (login sessions stored in a `Token` collection with auto-expiry, supporting logout/revocation and multi-device sessions)
- **Posts** — full CRUD, with ownership checks (only the author can edit/delete their own posts)
- **Likes** — toggle like/unlike on posts, race-condition safe via a unique compound index
- **Comments** — full CRUD on comments, scoped to a post, with ownership checks
- **Validation** — request validation via `express-validator` on all write endpoints
- **Centralized error handling** — a single Express error-handling middleware catches unexpected failures

---

## Tech Stack

- **Node.js** / **Express**
- **MongoDB** / **Mongoose**
- **JWT** (`jsonwebtoken`) for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS**, **dotenv**

---

## Getting Started

### Prerequisites
- Node.js installed
- A MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
git clone <your-repo-url>
cd blog-api
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DB_URL=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
PORT=3000
```

### Run locally

```bash
npm start
```

Server runs at `http://localhost:3000` by default.

---

## API Endpoints

### Auth / Users — `/api/users`

| Method | Endpoint          | Protected | Description                          |
|--------|--------------------|:---------:|---------------------------------------|
| POST   | `/register`         | No        | Create a new account                  |
| POST   | `/login`             | No        | Log in, returns a JWT                 |
| POST   | `/logout`            | Yes       | Ends the current session              |
| GET    | `/`                  | Yes       | List all users                        |

### Posts — `/api/posts`

| Method | Endpoint       | Protected | Description                            |
|--------|-----------------|:---------:|------------------------------------------|
| GET    | `/`              | No        | Get all posts                          |
| POST   | `/`              | Yes       | Create a new post                      |
| PUT    | `/:id`           | Yes       | Update a post (author only)            |
| DELETE | `/:id`           | Yes       | Delete a post (author only)            |

### Likes — `/api/posts/:id/likes`

| Method | Endpoint              | Protected | Description                     |
|--------|------------------------|:---------:|-----------------------------------|
| POST   | `/:id/likes`            | Yes       | Toggle like/unlike on a post     |
| GET    | `/:id/likes`            | No        | Get like count for a post        |

### Comments — `/api/posts/:id/comments`

| Method | Endpoint                          | Protected | Description                          |
|--------|-------------------------------------|:---------:|-----------------------------------------|
| GET    | `/:id/comments`                      | No        | Get all comments for a post          |
| POST   | `/:id/comments`                      | Yes       | Add a comment                        |
| PUT    | `/:id/comments/:commentId`           | Yes       | Update a comment (author only)       |
| DELETE | `/:id/comments/:commentId`           | Yes       | Delete a comment (author only)       |
| GET    | `/:id/comments-count`                | No        | Get comment count for a post         |

---

## Auth Flow

1. `POST /api/users/register` — creates a user, password hashed with bcrypt
2. `POST /api/users/login` — verifies credentials, returns a JWT (90-day expiry) and creates a session record
3. Include the token on protected requests: `Authorization: Bearer <token>`
4. `POST /api/users/logout` — deletes the session record, invalidating that token immediately (even though the JWT itself would otherwise still be cryptographically valid)

---

## Data Models

- **User** — name, email (unique), hashed password
- **Post** — content, userId (ref User), timestamps
- **Comment** — content, userId, postId, timestamps
- **Like** — userId, postId (unique compound index — one like per user per post)
- **Token** — userId, token, device, createdAt (TTL — auto-expires after 90 days)

---

## Author

Built by Youssef as a backend practice project to learn Express, MongoDB, and JWT-based authentication.
