# DocuPilot Backend API

Express.js backend API for DocuPilot project management system.

## Features

- Project creation via shell script integration
- CORS enabled for frontend communication
- Security middleware with Helmet
- Environment-based configuration
- Error handling and logging

## Installation

```bash
cd backend
bun install
```

## Development

```bash
# Start development server with hot reload
bun run dev

# Start production server
bun start
```

## Environment Variables

Copy `.env` file and configure:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

## API Endpoints

### POST /api/create-project

Creates a new project by executing the initialization script.

**Request Body:**
```json
{
  "projectTitle": "My Project",
  "repositoryUrl": "https://github.com/user/repo.git",
  "branchName": "main",
  "description": "Project description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {...},
  "output": "Script execution output"
}
```

### GET /health

Health check endpoint.

### GET /api/projects

List existing projects (TODO: Implementation needed).

## Architecture

```
backend/
├── server.js          # Express server setup
├── routes/
│   └── projects.js    # Project-related routes
├── .env              # Environment configuration
├── package.json      # Dependencies and scripts
└── README.md         # This file
```