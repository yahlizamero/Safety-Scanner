# SafetyScanner

SafetyScanner is a web application designed to help users check images and content for potential safety and privacy risks before sharing them online.

The project uses a **React (Vite) frontend** and a **Node.js (Express) backend**.  
All AI requests (including image analysis) are handled **server-side**.

---

## Project Structure
client/   # React + Vite frontend
server/   # Express backend (AI + future DB)

---

## Prerequisites

- Node.js 18+
- npm
- An OpenAI API key (for backend only)

---

## Environment Variables (IMPORTANT)

### Backend (server/.env)

Create a file `server/.env` with:

```env
OPENAI_API_KEY=your_openai_key_here
CLIENT_URL=http://localhost:3000
MONGO_URI=
PORT=5050
```
ℹ️ MongoDB is optional for now. Leaving MONGO_URI empty will still allow the server to run.

Frontend (client/.env)

Create a file client/.env with:
VITE_API_URL=http://localhost:5050
This must match the backend port.

### Running the Project Locally

1. Start the Backend

in a terminal window/tab, run:
cd server
npm install
npm run dev

Expected output:
Server is running on port 5050

2) Start the frontend

Open a second terminal window/tab run:
cd client
npm install
npm run dev

Expected behavior:
The app should automatically open at
👉 http://localhost:3000

### Architecture Notes (for contributors):

- No OpenAI calls from the browser
- Duck template removed
- All AI requests go through the Express backend
- Future DB interactions (e.g., MongoDB) will also be handled server-side
- Image files are converted to base64 in the client and sent to the backend
- Frontend calls:
    POST /ai/safety-check

### Troubleshooting

CORS errors

Make sure:
- Backend is running
- CLIENT_URL in server/.env matches the frontend URL
- Both servers are restarted after .env changes