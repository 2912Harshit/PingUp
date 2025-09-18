# Pingup

A modern social app with feed, stories, real‑time direct messages, and social graph (follow + connect), built with React + Vite on the client and Express + MongoDB on the server. Authentication is powered by Clerk, images by ImageKit, and background jobs via Inngest.

## Tech Stack
- Client: React 19, React Router 7, Redux Toolkit, Tailwind CSS, Vite
- Server: Node.js, Express 5, Mongoose 8, Clerk (server), Inngest, ImageKit, Multer, Nodemailer
- DB: MongoDB (NoSQL). A relational SQL schema is proposed below for reference.

## Monorepo Structure
```
Pingup-main/
├── client/           # React app
│   └── src/
│       ├── pages/    # Feed, Messages, ChatBox, Connections, Discover, Profile, CreatePost, Login
│       ├── features/ # RTK slices: user, connections, messages
│       ├── components/
│       └── api/axios.js
└── server/           # Express API
    ├── server.js
    ├── routes/       # userRoutes, postRoutes, storyRoutes, messageRoutes
    ├── controllers/  # userController, postController, storyController, messageController
    ├── models/       # User, Post, Story, Message, Connection (Mongoose)
    ├── middleware/   # auth.js (Clerk)
    └── configs/      # db, multer, imagekit, nodeMailer
```

## Environment
Server expects:
- `MONGODB_URL` (base, DB name `pingup` is appended)
- Clerk server keys (used by `@clerk/express`)
- ImageKit keys
- SMTP creds (for `nodemailer` if used by jobs)

Client expects:
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_BASEURL` (e.g. http://pingup-one.vercel.app)

## Running locally
- Server: `cd server && npm i && npm start`
- Client: `cd client && npm i && npm run dev`

## Services and Endpoints
Below is what the API actually exposes in this repo (as implemented in routes and controllers). All protected routes require Clerk auth via `protect` middleware.

### Health
- GET `/` → "Server is running"

### Inngest
- POST `/api/inngest` → Inngest Express serve endpoint (used by jobs; managed internally)

### Users
- GET `/api/user/data` (auth) → Get current user (by Clerk `userId`).
- POST `/api/user/update` (auth, multipart) → Update profile: `username`, `bio`, `location`, `full_name`, plus `profile` and/or `cover` file uploads. Uses ImageKit for URLs.
- POST `/api/user/discover` (auth) → Body: `{ input }`. Case‑insensitive search on `username`, `email`, `full_name`, `location`.
- POST `/api/user/follow` (auth) → Body: `{ id }`. Follow a user; mirrors to their `followers`.
- POST `/api/user/unfollow` (auth) → Body: `{ id }`. Unfollow; removes from each list.
- POST `/api/user/connect` (auth) → Body: `{ id }`. Send connection request; throttled (≤20 per 24h). Enqueues Inngest event `app/connection-request`.
- POST `/api/user/accept` (auth) → Body: `{ id }`. Accept a pending connection; adds each user to other’s `connections` and marks request `accepted`.
- GET `/api/user/connections` (auth) → Returns `{ connections, followers, following, pendingConnections }`.
- POST `/api/user/profiles` → Body: `{ profileId }`. Returns profile and their posts. (No auth currently.)
- GET `/api/user/recent-messages` → Returns inbound messages to current user (requires auth by `getUserRecentMessages`, but route misses `protect`; consider adding).

### Posts
- POST `/api/post/add` (auth, multipart) → Body: `content`, `post_type` in {`text`, `image`, `text_with_image`}; files field `images` (up to 4). Uploads to ImageKit and stores URLs.
- GET `/api/post/feed` (auth) → Feed posts authored by current user, their `connections`, and `following`, newest first.
- POST `/api/post/like` (auth) → Body: `{ postId }`. Toggle like; stores liker ids in `likes_count` array.

### Stories
- POST `/api/story/create` (auth, multipart) → Body: `content`, `media_type` in {`text`, `image`, `video`}, `background_color`; file field `media`. Uploads to ImageKit. Emits Inngest event `app/story.delete` (for timed deletion logic outside this file).
- GET `/api/story/get` (auth) → Stories from current user + their `connections` + `following`, newest first.

### Messages
- GET `/api/message/:userId` → Server‑Sent Events stream for user `:userId`. The server writes new messages as SSE `data:` lines.
- POST `/api/message/send` (auth, multipart) → Body: `to_user_id`, `text`; file `image` optional. Stores as `text` or `image` message. Pushes the message to recipient’s SSE channel if connected.
- POST `/api/message/get` (auth) → Body: `{ to_user_id }`. Returns messages between current user and `to_user_id` (sorted desc) and marks inbound messages as `seen`.

## How core services work
- Auth: Clerk middleware (`clerkMiddleware` globally and `protect` per‑route) exposes `req.auth()` with `{ userId }`. Mongoose `_id` for `User` equals Clerk user id string.
- Media: Multer receives uploads; files are read from disk and pushed to ImageKit, then transformed to webp with quality and width presets; saved URL(s) are stored.
- Feed: `getFeedPosts` queries posts by user id in `[me, ...connections, ...following]` and sorts by `createdAt` desc.
- Social graph: `followers`, `following`, and `connections` are arrays of user id strings on `User` docs. A `Connection` doc tracks pending/accepted state for invitations.
- Messaging: SSE maintains an in‑memory map of userId → Response. When a message is created, if recipient is connected, the message is emitted via SSE immediately; otherwise, client fetches on navigation.
- Stories: Created with optional media; an Inngest event is sent for lifecycle management (e.g., auto‑delete after 24h) outside the controller.

## Data Models (MongoDB)
- `User` {_id: String, email, full_name, username, bio, profile_picture, cover_photo, location, followers[String], following[String], connections[String]}
- `Post` {user: String, content, image_urls[String], post_type: enum, likes_count[String], timestamps}
- `Story` {user: String, content, media_url, media_type: enum, views_count[String], background_color, timestamps}
- `Message` {from_user_id: String, to_user_id: String, text, message_type: enum, media_url, seen: Boolean, timestamps}
- `Connection` {from_user_id: String, to_user_id: String, status: enum(pending|accepted), timestamps}

## Proposed SQL schema (relational)
This mirrors the current NoSQL design. Use UUID or text for user ids to align with Clerk ids.

```sql
-- Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,            -- Clerk user id
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE,
  bio TEXT DEFAULT 'hey there! I am using Pingup.',
  profile_picture TEXT DEFAULT '',
  cover_photo TEXT DEFAULT '',
  location TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_username ON users(username);

-- Follows (directed)
CREATE TABLE follows (
  follower_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);
CREATE INDEX idx_follows_following ON follows(following_id);

-- Connections (undirected once accepted)
CREATE TABLE connections (
  id BIGSERIAL PRIMARY KEY,
  from_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending','accepted')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT connections_direction CHECK (from_user_id <> to_user_id)
);
CREATE INDEX idx_connections_pair ON connections(LEAST(from_user_id,to_user_id), GREATEST(from_user_id,to_user_id));

-- Posts
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  post_type TEXT NOT NULL CHECK (post_type IN ('text','image','text_with_image')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_posts_user_created_at ON posts(user_id, created_at DESC);

-- Post images (0..n)
CREATE TABLE post_images (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  url TEXT NOT NULL
);
CREATE INDEX idx_post_images_post ON post_images(post_id);

-- Post likes (many-to-many users↔posts)
CREATE TABLE post_likes (
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- Stories
CREATE TABLE stories (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('text','image','video')),
  background_color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_stories_user_created_at ON stories(user_id, created_at DESC);

-- Story views (optional if you implement tracking)
CREATE TABLE story_views (
  story_id BIGINT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  viewer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (story_id, viewer_id)
);

-- Messages
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  from_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT,
  message_type TEXT CHECK (message_type IN ('text','image')),
  media_url TEXT,
  seen BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_messages_thread ON messages(
  LEAST(from_user_id,to_user_id), GREATEST(from_user_id,to_user_id), created_at DESC
);

-- Optional: Recent inbound messages query helper via a materialized view or index only queries.
```

## Notes and opportunities
- Consider adding `protect` to `GET /api/user/recent-messages` route for consistency.
- SSE connections are in-memory; scale‑out would need a broker (e.g., Redis pub/sub) or a hosted realtime service.
- Add input validation (e.g., Zod) and rate limiting on message and post creation.
- Implement 24h TTL for stories in DB or scheduled deletion via Inngest.

## ER diagram (SQL visualization)
```mermaid
erDiagram
  USERS ||--o{ FOLLOWS : "follower"
  USERS ||--o{ FOLLOWS : "following"
  USERS ||--o{ CONNECTIONS : "from"
  USERS ||--o{ CONNECTIONS : "to"
  USERS ||--o{ POSTS : "authors"
  POSTS ||--o{ POST_IMAGES : "has"
  USERS ||--o{ POST_LIKES : "likes"
  POSTS ||--o{ POST_LIKES : "liked by"
  USERS ||--o{ STORIES : "authors"
  STORIES ||--o{ STORY_VIEWS : "viewed by"
  USERS ||--o{ STORY_VIEWS : "viewer"
  USERS ||--o{ MESSAGES : "sender"
  USERS ||--o{ MESSAGES : "recipient"

  USERS {
    TEXT id PK
    TEXT email
    TEXT full_name
    TEXT username
    TEXT bio
    TEXT profile_picture
    TEXT cover_photo
    TEXT location
    TIMESTAMPTZ created_at
    TIMESTAMPTZ updated_at
  }

  FOLLOWS {
    TEXT follower_id FK
    TEXT following_id FK
    TIMESTAMPTZ created_at
    PK (follower_id, following_id)
  }

  CONNECTIONS {
    BIGSERIAL id PK
    TEXT from_user_id FK
    TEXT to_user_id FK
    TEXT status
    TIMESTAMPTZ created_at
    TIMESTAMPTZ updated_at
  }

  POSTS {
    BIGSERIAL id PK
    TEXT user_id FK
    TEXT content
    TEXT post_type
    TIMESTAMPTZ created_at
    TIMESTAMPTZ updated_at
  }

  POST_IMAGES {
    BIGSERIAL id PK
    BIGINT post_id FK
    TEXT url
  }

  POST_LIKES {
    BIGINT post_id FK
    TEXT user_id FK
    TIMESTAMPTZ created_at
    PK (post_id, user_id)
  }

  STORIES {
    BIGSERIAL id PK
    TEXT user_id FK
    TEXT content
    TEXT media_url
    TEXT media_type
    TEXT background_color
    TIMESTAMPTZ created_at
  }

  STORY_VIEWS {
    BIGINT story_id FK
    TEXT viewer_id FK
    TIMESTAMPTZ viewed_at
    PK (story_id, viewer_id)
  }

  MESSAGES {
    BIGSERIAL id PK
    TEXT from_user_id FK
    TEXT to_user_id FK
    TEXT text
    TEXT message_type
    TEXT media_url
    BOOLEAN seen
    TIMESTAMPTZ created_at
  }
```

## License
MIT

