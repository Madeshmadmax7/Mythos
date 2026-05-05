# Mythos

Mythos is an AI-powered collaborative storytelling platform where users can create, continue, refine, and co-manage stories in a chat-style experience.

It combines a FastAPI backend, React frontend, and MySQL persistence with LLM-assisted generation to keep narratives coherent and evolving.

## Highlights

- AI story generation with context continuity
- Story continuation and per-message refinement
- JWT-based authentication and user accounts
- Story sharing, access requests, and collaboration workflows
- Message reactions, reviews, and management controls
- Persistent storage for stories, messages, hints, and collaboration metadata

## Screenshot Slots (Add New Images Here)

Only add your new website screenshots in these paths:

- docs/screenshots/home.png
- docs/screenshots/workspace.png
- docs/screenshots/sidebar.png
- docs/screenshots/collaboration.png

After you add images, they will auto-render in this layout.

<table>
    <tr>
        <td align="center" width="50%"><strong>Home / Landing</strong></td>
        <td align="center" width="50%"><strong>Story Workspace</strong></td>
    </tr>
    <tr>
        <td align="center">
            <img src="docs/screenshots/home.png" alt="Home Screenshot" width="100%" />
        </td>
        <td align="center">
            <img src="docs/screenshots/workspace.png" alt="Workspace Screenshot" width="100%" />
        </td>
    </tr>
    <tr>
        <td align="center" width="50%"><strong>Sidebar / Story List</strong></td>
        <td align="center" width="50%"><strong>Sharing & Collaboration</strong></td>
    </tr>
    <tr>
        <td align="center">
            <img src="docs/screenshots/sidebar.png" alt="Sidebar Screenshot" width="100%" />
        </td>
        <td align="center">
            <img src="docs/screenshots/collaboration.png" alt="Collaboration Screenshot" width="100%" />
        </td>
    </tr>
</table>

## Architecture

### High-Level System

```text
Browser (React + Vite)
        |
        | HTTP + JWT
        v
FastAPI API Layer (app/main.py + routes)
        |
        | service calls (generation/refine/continue)
        v
AI Layer (app/ai + app/utils/llm_client.py)
        |
        | persistence via SQLAlchemy
        v
MySQL (stories, messages, hints, access requests, change requests, reviews, reactions)
```

### Backend Architecture

- Entrypoint: backend/app/main.py
- Routing:
    - backend/app/routes/auth_routes.py
    - backend/app/routes/story_routes.py
- AI Services:
    - backend/app/ai/hints.py
    - backend/app/ai/storyteller.py
- Data Layer:
    - backend/app/db/models.py
    - backend/app/db/crud.py
    - backend/app/db/connection.py
    - backend/app/db/init_db.py
- Utilities:
    - backend/app/utils/auth.py
    - backend/app/utils/llm_client.py

### Frontend Architecture

- App shell and routing:
    - story-teller-ui/src/main.jsx
    - story-teller-ui/src/App.jsx
- Core features:
    - story-teller-ui/src/components/ChatArea.jsx
    - story-teller-ui/src/components/Sidebar.jsx
    - story-teller-ui/src/components/ShareModal.jsx
    - story-teller-ui/src/components/ManagementModal.jsx
    - story-teller-ui/src/components/AccessRequestModal.jsx
- Static pages:
    - story-teller-ui/src/pages/HomePage.jsx
    - story-teller-ui/src/pages/DocsPage.jsx
    - story-teller-ui/src/pages/PrivacyPolicyPage.jsx
    - story-teller-ui/src/pages/TermsOfServicePage.jsx

## Tech Stack

- Frontend: React 19, React Router, Tailwind CSS 4, Lucide Icons, React Icons
- Backend: FastAPI, SQLAlchemy, Pydantic, Uvicorn
- Auth/Security: python-jose, passlib, bcrypt
- AI/Networking: groq, httpx
- Database Driver: PyMySQL

## Project Structure

```text
.
|-- backend/
|   |-- app/
|   |   |-- ai/
|   |   |-- db/
|   |   |-- models/
|   |   |-- routes/
|   |   `-- utils/
|   |-- requirements.txt
|   `-- .env
|-- story-teller-ui/
|   |-- src/
|   |   |-- components/
|   |   `-- pages/
|   `-- package.json
`-- readme.md
```

## API Overview

Base URL: http://localhost:8000

### Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and receive JWT token
- GET /api/auth/me - Get current authenticated user

### Stories

- POST /api/stories - Create story
- GET /api/stories - List user stories
- GET /api/stories/{story_id} - Get story by id
- GET /api/stories/hash/{hash_id} - Get story by hash id
- PUT /api/stories/{story_id} - Update story name
- DELETE /api/stories/{story_id} - Delete story

### Messages and AI

- GET /api/stories/{story_id}/messages - List messages in a story
- PUT /api/messages/{message_id} - Edit a message
- POST /api/generate - Generate a new story message
- POST /api/continue - Continue a story thread
- POST /api/refine - Refine a specific segment
- GET /api/stories/{story_id}/hints - Fetch hint context for story

### Reactions and Reviews

- POST /api/messages/{message_id}/reaction - Add/update/remove reaction
- GET /api/messages/{message_id}/reaction - Get reaction summary
- POST /api/messages/{message_id}/reviews - Add review comment
- GET /api/messages/{message_id}/reviews - List reviews
- DELETE /api/reviews/{review_id} - Delete review

### Collaboration and Access Control

- POST /api/stories/hash/{hash_id}/request_access - Request view/collaborate access
- GET /api/stories/hash/{hash_id}/access_requests - List access requests
- PUT /api/stories/hash/{hash_id}/access_requests/{request_id} - Approve/reject access request
- DELETE /api/stories/hash/{hash_id}/access/{user_id} - Remove collaborator access
- POST /api/stories/hash/{hash_id}/propose_change - Submit change request
- GET /api/stories/hash/{hash_id}/change_requests - List change requests
- PUT /api/stories/hash/{hash_id}/change_requests/{request_id} - Approve/reject change request

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- MySQL 8+

### 1) Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create backend/.env:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=story_db
LLM_API_KEY=your_groq_api_key
```

Run backend:

```bash
uvicorn app.main:app --reload
```

### 2) Frontend Setup

```bash
cd story-teller-ui
npm install
npm run dev
```

### 3) Open the App

- Frontend: http://localhost:5173
- Backend docs: http://localhost:8000/docs

## Collaboration Flow

1. User creates a story.
2. Story can be shared with view/collaborate access.
3. Collaborators submit change requests.
4. Story owner reviews and approves/rejects changes.
5. Approved updates are reflected in the story thread.

## Environment Variables

Backend variables expected in backend/.env:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASS`
- `DB_NAME`
- `LLM_API_KEY`

## Roadmap Ideas

- Story version history and branching
- Export to PDF/Markdown
- Team workspaces and shared libraries
- Prompt templates by genre

## License

This project is currently private/internal. Add a license section if you plan to open source Mythos.