# PingUp - Modern Social Media Platform
> ⚠️ **Note:** This project is still under development. Many features are yet to be added such as:
> - **Comments on posts**
> - **Post sharing**
> - **Read receipts in messages**
> - **More enhancements coming soon...**

A full-stack social media application built with React, Node.js, and MongoDB that provides a seamless social networking experience with real-time features, stories, messaging, and more.

## 🌟 Features

### Core Features
- **User Authentication** - Secure authentication using Clerk
- **User Profiles** - Customizable profiles with cover photos and avatars
- **Posts & Feed** - Create, like, comment, and share posts
- **Stories** - 24-hour disappearing stories with viewer tracking
- **Real-time Messaging** - Direct messaging
- **Connections** - Send/accept connection requests, manage connections
- **Discover** - Find and connect with new people
- **Notifications** - Real-time notifications for interactions

### Advanced Features
- **Image Uploads** - Support for multiple image formats with ImageKit integration
- **Email Notifications** - Automated email notifications for important events
- **Background Jobs** - Inngest for handling background tasks
- **Responsive Design** - Mobile-first responsive design with Tailwind CSS
- **Real-time Updates** - Live updates using Redux Toolkit

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **Redux Toolkit** - State management with RTK Query
- **React Router v7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Clerk React** - Authentication and user management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Clerk Express** - Authentication middleware
- **Inngest** - Background job processing
- **ImageKit** - Image storage and optimization
- **Nodemailer** - Email service integration

### Deployment
- **Vercel** - Frontend deployment
- **Backend** - Deployed on cloud platform with MongoDB Atlas

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Clerk account
- ImageKit account
- SMTP service (for email notifications)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/santoshsingh19114/Pingup.git
cd Pingup
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Variables**

Create `.env` files in both server and client directories:

**Server `.env`**
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_email_password
INNGEST_EVENT_KEY=your_inngest_event_key
```

**Client `.env`**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:4000/api
```

4. **Run the application**

```bash
# Terminal 1 - Start the server
cd server
npm start

# Terminal 2 - Start the client
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## 📱 Application Structure

```
swishh/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── features/      # Redux slices
│   │   ├── api/           # API utilities
│   │   └── assets/        # Static assets
│   └── package.json
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── configs/          # Configuration files
│   ├── inngest/          # Background jobs
│   └── server.js
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `GET /api/user/profile/:id` - Get user profile

### Posts
- `GET /api/post/feed` - Get feed posts
- `POST /api/post/create` - Create new post
- `PUT /api/post/:id/like` - Like/unlike post


### Stories
- `GET /api/story` - Get active stories
- `POST /api/story/create` - Create new story
- `GET /api/story/:id/viewers` - Get story viewers
- `DELETE /api/story/:id` - Delete story

### Messages
- `GET /api/message/conversations` - Get user conversations
- `GET /api/message/:userId` - Get messages with specific user
- `POST /api/message/send` - Send new message
- `PUT /api/message/:id/read` - Mark message as read

### Connections
- `POST /api/user/connect/:userId` - Send connection request
- `PUT /api/user/connect/:requestId/accept` - Accept connection request
- `DELETE /api/user/connect/:requestId/decline` - Decline connection request
- `GET /api/user/connections` - Get user connections

## 🎯 Key Features Implementation

### Real-time Messaging
- WebSocket-like functionality using polling
- Read receipts and typing indicators
- Message status tracking

### Stories System
- 24-hour expiration with MongoDB TTL
- Viewer tracking and analytics
- Image optimization with ImageKit

### Feed Algorithm
- Chronological feed with connection filtering
- Pagination for infinite scroll
- Optimized database queries

### Image Handling
- Multiple image upload support
- Automatic resizing and optimization
- CDN delivery via ImageKit

## 🧪 Development

### Available Scripts

**Client:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

**Server:**
```bash
npm start        # Start development server with nodemon
npm run test     # Run tests (when implemented)
```

### Code Style
- ESLint for JavaScript linting
- Prettier for code formatting
- Tailwind CSS for consistent styling

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend
1. Set up MongoDB Atlas cluster
2. Configure environment variables on your hosting platform
3. Deploy using platform-specific instructions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## 🙏 Acknowledgments

- Clerk for authentication
- MongoDB Atlas for database
- ImageKit for image storage
- Tailwind CSS for styling
- React community for amazing tools

