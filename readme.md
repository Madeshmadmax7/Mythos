# AI Story Generator (FastAPI + React + Groq LLM)

A GPT-like AI storytelling application with chat-based interface.  
Each story is like a chat session where you can continue the narrative and refine individual segments.

---

## Features

1. **Chat-like Interface** - Stories appear as conversations with the AI
2. **Multiple Stories** - Each story is a separate chat (like GPT conversations)
3. **Continuation without Repetition** - Each new segment uses previous hints to avoid repeating content
4. **Segment-level Refinement** - Refine only specific parts without affecting others
5. **Context Hints** - 5-10 word hints are extracted from each segment for RAG-like continuity
6. **Persistent Storage** - All stories, messages, and hints stored in MySQL

---

## How It Works

1. **New Story**: User enters a prompt, a new story/chat is created
2. **Generation**: AI generates story content + extracts a 5-10 word context hint
3. **Continuation**: User can continue the story; previous hints prevent repetition
4. **Refinement**: Each message can be refined individually without affecting others
5. **RAG-like Context**: Accumulated hints serve as few-shot context for continuity

---

## Project Structure

```
backend/
    app/
        main.py              # FastAPI app
        ai/
            hints.py         # Story generation, hints, refinement
        db/
            connection.py    # MySQL connection
            models.py        # SQLAlchemy models
            crud.py          # Database operations
            init_db.py       # Table creation
        routes/
            story_routes.py  # API endpoints
    requirements.txt
    .env

story-teller-ui/
    src/
        App.jsx              # Main app state
        components/
            Sidebar.jsx      # Story list (like GPT sidebar)
            ChatArea.jsx     # Chat messages and input
```

---

## Database Tables

### stories
- id
- story_name (chat title)
- description
- genre
- created_at
- updated_at

### story_messages  
- id
- story_id
- order_index (position in chat)
- user_prompt
- ai_response
- hint_context (5-10 word context hint)
- created_at
- updated_at

### story_hints
- id
- story_id
- hint_text (5-10 words max)
- message_id
- created_at

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stories | Get all stories |
| POST | /api/stories | Create new story |
| GET | /api/stories/{id} | Get single story |
| DELETE | /api/stories/{id} | Delete story |
| GET | /api/stories/{id}/messages | Get all messages |
| POST | /api/generate | Generate new message |
| POST | /api/continue | Continue story |
| POST | /api/refine | Refine specific message |

---

## Prompting Strategy

- **Initial Generation**: One-shot with genre and user prompt
- **Hint Extraction**: 5-10 word context hints after each generation
- **Continuation**: Uses ALL previous hints to avoid repetition
- **Refinement**: Only refines targeted segment using prior hints for consistency

---

## Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- MySQL 8.0+

### Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Create .env file with:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASS=your_password
# DB_NAME=story_db
# LLM_API_KEY=your_groq_api_key

# Run backend
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd story-teller-ui
npm install
npm run dev
```

### Database Migration
If upgrading from old schema, drop existing tables:
```sql
DROP TABLE IF EXISTS story_hints;
DROP TABLE IF EXISTS story_levels;
DROP TABLE IF EXISTS story_versions;
DROP TABLE IF EXISTS stories;
```

The app will recreate tables on startup.

---

## Usage

1. Open the app at http://localhost:5173
2. Click "New Story" to start a new chat
3. Select a genre and enter your story prompt
4. Click Generate to create the first part
5. Continue the story by entering more prompts
6. Hover over any AI response and click "Refine" to improve just that part
7. Previous stories appear in the left sidebar

---

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, Groq LLM (LLaMA 3.1 8B)
- **Frontend**: React, Lucide Icons, React Icons
- **Database**: MySQL
- **Styling**: Inline CSS with dark theme



## uvicorn app.main:app --reload