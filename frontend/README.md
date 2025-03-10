# Planning Poker App

A real-time Planning Poker application built with React, TypeScript, and Fluent UI components.

## Features

- Create and join planning poker sessions
- Add user stories for estimation
- Vote on stories using planning poker cards
- View voting results and statistics
- Finalize story point estimates

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Fluent UI
- **Backend**: .NET Core API (not included in this repository)
- **Deployment**: Docker

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)
- .NET 8 SDK (for backend development)

### Development Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm run dev
```

## Docker Deployment

To build and run the application using Docker:

```bash
docker-compose up -d
```

This will start both the frontend and backend services.

## Backend Integration

This application is designed to work with a .NET backend API. The backend should implement the following endpoints:

- `GET /api/sessions` - List all sessions
- `GET /api/sessions/{id}` - Get session details
- `POST /api/sessions` - Create a new session
- `POST /api/sessions/{id}/users` - Join a session
- `GET /api/sessions/{id}/stories` - Get stories for a session
- `POST /api/sessions/{id}/stories` - Create a new story
- `PUT /api/sessions/{id}/stories/{storyId}` - Update a story
- `POST /api/sessions/{id}/stories/{storyId}/votes` - Submit a vote
- `POST /api/sessions/{id}/stories/{storyId}/reveal` - Reveal votes
- `POST /api/sessions/{id}/stories/{storyId}/reset` - Reset voting
- `POST /api/sessions/{id}/stories/{storyId}/finalize` - Finalize estimate

## License

MIT