# BlogChan

A full-stack blogging platform with user authentication, post creation, commenting, and voting features built with Node.js, Express, Sequelize, and Handlebars.

## Features

- 🔐 **User Authentication**: Secure signup/signin with bcrypt password hashing
- 📝 **Blog Posts**: Create, edit, and delete blog posts
- 💬 **Comments**: Comment on blog posts
- 👍 **Voting System**: Upvote and downvote posts and comments
- 📱 **Responsive Design**: Mobile-friendly interface with Bootstrap 5
- 🎨 **Modern UI**: Clean, sleek interface inspired by social media platforms

## Tech Stack

**Backend:**
- Node.js
- Express.js v4.18.2
- Sequelize ORM v6.37.1
- MySQL2
- Express Session with Connect Session Sequelize

**Frontend:**
- Handlebars v5.3.5 (templating engine)
- Bootstrap 5.0.2
- Font Awesome 6.4.0
- Custom CSS

**Security:**
- bcrypt for password hashing
- Express sessions for authentication
- Input validation with Sequelize validators
- Authentication middleware for protected routes

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/JohnM89/Blogchan.git
   cd Blogchan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your settings:
   ```env
   # Server Configuration
   PORT=3001

   # Database Configuration
   DB_NAME=blogchan_db
   DB_USER=root
   DB_PASSWORD=your_password

   # Session Configuration (generate a secure random string)
   SESSION_SECRET=your-super-secret-session-key

   # Optional
   SEED_DB=false
   NODE_ENV=development
   ```

4. **Create the database**
   ```bash
   mysql -u root -p
   ```

   Then run:
   ```sql
   CREATE DATABASE blogchan_db;
   ```

5. **Seed the database (optional)**

   Set `SEED_DB=true` in your `.env` file, then start the server to automatically seed the database.

## Usage

### Development

Start the development server with auto-reload:
```bash
npm run dev
```

### Production

Start the production server:
```bash
npm start
```

The application will be available at `http://localhost:3001`

## Project Structure

```
Blogchan/
├── config/
│   └── connection.js          # Sequelize database connection
├── controllers/
│   ├── api/
│   │   ├── index.js          # API router
│   │   └── blogRoutes.js     # Blog API endpoints
│   ├── homeRoutes.js         # View routes
│   └── index.js              # Main router
├── db/
│   └── schema.sql            # Database schema
├── models/
│   ├── index.js              # Model associations
│   ├── User.js               # User model
│   ├── BlogPost.js           # Blog post model
│   └── Comment.js            # Comment model
├── public/
│   ├── css/
│   │   ├── style.css         # Global styles
│   │   ├── components.css    # Component styles
│   │   └── landingpage.css   # Landing page styles
│   ├── js/
│   │   ├── script.js         # Vote functionality
│   │   └── api.js            # Reddit API integration
│   └── assets/               # Images and icons
├── seeds/                    # Database seed files
├── utils/
│   ├── auth.js               # Authentication middleware
│   └── helpers.js            # Handlebars helpers
├── views/
│   ├── layouts/
│   │   └── main.handlebars   # Main layout template
│   ├── partials/             # Reusable partials
│   └── *.handlebars          # Page templates
├── .env.example              # Environment variables template
├── package.json
├── Procfile                  # Heroku deployment config
└── server.js                 # Application entry point
```

## API Endpoints

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/signin` - Sign in existing user
- `POST /api/signout` - Sign out current user

### Blog Posts
- `GET /blogs` - Get all blog posts
- `GET /blogs/:id` - Get single blog post
- `POST /api/blogs` - Create new blog post (protected)
- `PUT /api/blogs/:id` - Update blog post (protected)
- `DELETE /api/blogs/delete/:id` - Delete blog post (protected)

### Voting
- `PUT /api/upvote/:id` - Upvote a blog post
- `PUT /api/downvote/:id` - Downvote a blog post

### Comments
- `POST /api/comment` - Create new comment (protected)

## Database Schema

### User
- `id` (INTEGER, PRIMARY KEY)
- `username` (STRING, UNIQUE)
- `email` (STRING, UNIQUE)
- `password` (STRING, hashed)
- `date_joined` (DATE)

### BlogPost
- `id` (INTEGER, PRIMARY KEY)
- `title` (STRING)
- `content` (TEXT)
- `date` (DATE)
- `upVotes` (INTEGER)
- `downVotes` (INTEGER)
- `authorId` (INTEGER, FOREIGN KEY)

### Comment
- `id` (INTEGER, PRIMARY KEY)
- `commentText` (STRING)
- `dateCreated` (DATE)
- `upVotes` (INTEGER)
- `downVotes` (INTEGER)
- `authorId` (INTEGER, FOREIGN KEY)
- `blogPostId` (INTEGER, FOREIGN KEY)

## Security Features

- **Password Security**: All passwords are hashed using bcrypt with a salt round of 10
- **Email Validation**: Email addresses are validated using Sequelize's built-in validators
- **Password Requirements**: Minimum password length of 8 characters
- **Session Security**:
  - HTTP-only cookies
  - Secure flag in production
  - Same-site strict policy
  - 24-hour session expiration
- **Protected Routes**: Authentication middleware on all create/edit/delete operations
- **Environment Variables**: Sensitive data stored in environment variables
- **Input Validation**: Server-side validation on all user inputs

## Deployment

### Heroku

1. **Create a Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Provision JawsDB MySQL**
   ```bash
   heroku addons:create jawsdb:kitefin
   ```

3. **Set environment variables**
   ```bash
   heroku config:set SESSION_SECRET=your-secret-key
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

The `Procfile` is already configured for Heroku deployment.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Recent Improvements

This codebase has been recently refactored and improved with:

- ✅ **Enhanced Security**: Environment-based secrets, password validation, secure sessions
- ✅ **Clean Code**: Removed all commented/dead code
- ✅ **Organized Structure**: Consolidated CSS files, standardized naming conventions
- ✅ **Error Handling**: Consistent error responses across all endpoints
- ✅ **Authentication**: Proper middleware implementation on protected routes
- ✅ **Responsive Design**: Improved mobile compatibility
- ✅ **Code Quality**: Fixed typos, standardized patterns, improved consistency

## License

ISC

## Author

BlogChan Team

## Acknowledgments

- Bootstrap for the UI framework
- Font Awesome for icons
- Express.js community for excellent documentation
