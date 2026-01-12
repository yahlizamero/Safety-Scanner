# SafetyScanner

SafetyScanner is a full-stack web app that helps teens assess online safety risks before sharing content. Users can chat with a friendly assistant, upload images for review, and switch between safety-focused conversation modes.

## Key Features
- AI safety checks for uploaded images and text
- Three conversation modes (social upload, general safety, immediate help)
- Conversation memory for follow-up questions
- Friendly, teen-appropriate tone with language matching
- Modern React UI with responsive layout

## Tech Stack
- Frontend: React 19, Vite, React Router
- Backend: Node.js, Express, OpenAI Responses API
- Optional: MongoDB (for user data if configured)

## Project Structure
```
client/                     # React frontend (Vite)
  public/                   # Static assets
  src/
    assets/                 # Images and UI assets
    components/             # Reusable UI components
    pages/                  # Route-level pages
    services/               # API client + helpers
    styles/                 # Global styles
    App.jsx                 # App routes and layout
    index.jsx               # App entry point

server/                     # Express backend
  controllers/              # Request handlers
  models/                   # Mongoose models (if MongoDB is used)
  prompts/                  # Mode-specific AI prompts
  routes/                   # API routes
  server.js                 # Server entry point
```

## Setup

### Prerequisites
- Node.js 18+ (20+ recommended)
- npm

### 1) Install dependencies
```bash
cd server
npm install
cd ../client
npm install
```

### 2) Environment variables

Create a `server/.env` file:
```
OPENAI_API_KEY=your_openai_api_key
CLIENT_URL=http://localhost:3000
PORT=5050
MONGO_URI=your_mongodb_uri   # optional
```

Create a `client/.env` file:
```
VITE_API_BASE_URL=http://localhost:5000
```

### 3) Run the app
In one terminal:
```bash
cd server
npm run dev
```

In a second terminal:
```bash
cd client
npm run dev
```

The frontend runs on `http://localhost:3000` by default and proxies API requests to the server.

## API Overview

### POST `/ai/safety-check`
Used by the chat UI to send text and/or images for analysis.

Request body:
```json
{
  "text": "optional user text",
  "imageDataUrl": "optional data:image/...;base64,...",
  "mode": "social_upload | general_safety | help",
  "followUp": true,
  "history": [
    { "role": "user", "text": "..." },
    { "role": "assistant", "text": "..." }
  ]
}
```

Response:
```json
{ "reply": "assistant response" }
```

## Notes
- If `MONGO_URI` is not set, the server still runs without a database.
- The client uses `VITE_API_BASE_URL` to find the backend.
