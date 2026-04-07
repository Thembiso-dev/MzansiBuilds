# MzansiBuilds
# 🌍 MzansiBuilds — Build in Public. Together.

> A platform for South African developers (and beyond) to share what they're building, collaborate, track milestones, and celebrate shipping.

---

## 📖 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Thinking Process & Problem Analysis](#2-thinking-process--problem-analysis)
3. [Requirements](#3-requirements)
4. [Architecture Style](#4-architecture-style)
5. [Design Patterns](#5-design-patterns)
6. [Methodology — Scrum](#6-methodology--scrum)
7. [Test-Driven Development (TDD)](#7-test-driven-development-tdd)
8. [Code Coverage](#8-code-coverage)
9. [Polymorphism in the Codebase](#9-polymorphism-in-the-codebase)
10. [Tech Stack](#10-tech-stack)
11. [Folder Structure](#11-folder-structure)
12. [Database Schema](#12-database-schema)
13. [API Endpoints](#13-api-endpoints)
14. [How to Run the Project](#14-how-to-run-the-project)
15. [Ethical Use of AI](#15-ethical-use-of-ai)
16. [Author](#16-author)

---

## 1. Project Overview

**MzansiBuilds** is a developer community platform designed around the concept of *building in public*. The name "Mzansi" is a colloquial Zulu/Xhosa word for South Africa, grounding this platform in its cultural roots while being open to developers globally.

The platform solves a specific problem: developers often build in isolation, losing motivation, missing collaboration opportunities, and never sharing their progress. MzansiBuilds gives developers a structured, social space to:

- Register and manage their developer profile
- Post projects they are actively working on
- Share their stage (Idea → In Progress → Completed)
- Update milestones as they progress
- Comment on and request collaboration with others
- Be celebrated on a **Celebration Wall** when they ship

---

## 2. Thinking Process & Problem Analysis

### 🧠 How I Approached This

Before writing a single line of code, I asked: **What problem are we actually solving?**

Developers — especially early-career and independent builders — often:
- Start projects and abandon them quietly
- Don't know who to collaborate with
- Have no public accountability mechanism
- Ship something but receive no recognition

**The insight:** If developers post their work publicly and receive feedback, collaboration, and celebration, they are far more likely to finish what they start.

### 🗺️ Breaking Down the Journey

I mapped the full user journey into discrete, ordered stages:

```
Register → Create Profile → Post Project → Update Milestones
    → See Others' Work → Comment / Collaborate → Complete Project → Celebration Wall
```

Each stage became a **feature module** in the system. This user-journey-first thinking ensures the system is built around the *user*, not around what's technically convenient.

### 🧩 Deciding on the Stack

| Concern | Decision | Reason |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | Universal, fast, no build tools needed for rapid delivery |
| Backend | Node.js (Express) | JavaScript end-to-end reduces context switching |
| Database | Supabase (PostgreSQL) | Provides auth, real-time, and REST out of the box |
| Design | Green, white, black | Specified in brief; chosen for a clean, tech-forward feel |

### 🔄 Separation of Concerns

From the start I separated the system into three clear layers:

1. **Presentation Layer** — HTML/CSS/JS handles UI only. No business logic here.
2. **Application Layer** — Express.js routes handle validation, auth checks, and business rules.
3. **Data Layer** — Supabase handles persistence, auth, and real-time subscriptions.

This separation means any layer can change independently, for example, switching from Supabase to MongoDB would only affect the data layer.

---

## 3. Requirements

### Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | A developer can register an account with email and password |
| FR-02 | A developer can log in and log out securely |
| FR-03 | A developer can create a project with a name, description, stage, and support type needed |
| FR-04 | A developer can update their project's stage and add milestones |
| FR-05 | A developer can view a live feed of all active projects from other developers |
| FR-06 | A developer can comment on another developer's project |
| FR-07 | A developer can raise a collaboration request on another project |
| FR-08 | When a project is marked complete, the developer appears on the Celebration Wall |
| FR-09 | A developer can manage their profile (bio, skills, avatar) |
| FR-10 | The feed updates in real-time without a page refresh |

### Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | All API routes that modify data must be protected by JWT authentication |
| NFR-02 | Passwords are never stored in plain text (Supabase Auth handles hashing) |
| NFR-03 | The platform must be responsive across mobile and desktop |
| NFR-04 | Page load time should not exceed 3 seconds on a standard connection |
| NFR-05 | The codebase must maintain a minimum of 70% test coverage on backend routes |
| NFR-06 | Input validation must be performed on both client and server side |

### Constraints

- Design theme must be **green, white, and black**
- Stack: HTML/CSS/JS (frontend), Node.js (backend), Supabase (database)
- Must be an individual project
- Due by **11 April 2026, 23:59**

---

## 4. Architecture Style

### 🏛️ Client-Server Architecture

MzansiBuilds follows a **Client-Server Architecture**. The frontend (client) and backend (server) are completely separate systems that communicate over HTTP using a RESTful API.

```
┌──────────────────────────────────────────────────────────┐
│                        CLIENT                            │
│        HTML + CSS + Vanilla JavaScript                   │
│  (Runs entirely in the browser, no server-side render)  │
└────────────────────────┬─────────────────────────────────┘
                         │  HTTP / REST + JSON
                         ▼
┌──────────────────────────────────────────────────────────┐
│                    SERVER (Node.js)                      │
│              Express.js Application                      │
│        Routes → Middleware → Controllers                 │
└────────────────────────┬─────────────────────────────────┘
                         │  Supabase JS Client
                         ▼
┌──────────────────────────────────────────────────────────┐
│                  DATABASE (Supabase)                     │
│         PostgreSQL + Auth + Realtime + Storage           │
└──────────────────────────────────────────────────────────┘
```

### Why Client-Server?

- **Decoupling:** Frontend can be hosted on any CDN (Netlify, Vercel) while the backend runs on a Node server
- **Security:** Business logic and database credentials are never exposed to the browser
- **Scalability:** Each layer scales independently
- **Testability:** The API can be tested completely independently of the UI

### 🔁 Real-Time Layer

For the live feed feature, the frontend subscribes directly to **Supabase Realtime** channels. This is a WebSocket connection that pushes new project posts and comments to all connected clients instantly — without polling.

```
Browser ←──── WebSocket ────► Supabase Realtime
                                     │
                              PostgreSQL Changes
```

---

## 5. Design Patterns

### 5.1 MVC — Model View Controller

The backend follows the MVC pattern, separating data models, business logic, and request handling.

```
routes/projects.js       →  Controller (handles HTTP request/response)
supabaseClient.js        →  Model (data access layer)
frontend/project.html    →  View (rendered in the browser)
```

**Example:**
```javascript
// Controller — routes/projects.js
router.post('/projects', authMiddleware, async (req, res) => {
  const result = await ProjectModel.create(req.body, req.user.id);
  res.status(201).json(result);
});

// Model — models/projectModel.js
const create = async (data, userId) => {
  const { data: project, error } = await supabase
    .from('projects')
    .insert({ ...data, user_id: userId })
    .select();
  return project;
};
```

### 5.2 Middleware Pattern

Express middleware is used as a pipeline. Every request passes through the chain before reaching the route handler. This is a form of the **Chain of Responsibility** pattern.

```
Request → [CORS] → [JSON Parser] → [Auth Check] → [Route Handler] → Response
```

```javascript
// middleware/authMiddleware.js
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const { data: user, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: 'Invalid token' });
  req.user = user.user;
  next(); // pass to the next handler
};
```

### 5.3 Repository Pattern (Data Access Layer)

All Supabase queries are encapsulated in model files rather than being written directly in routes. This means:

- Routes never know *how* data is fetched — only *what* they want
- Swapping the database only requires changing the model files
- Models can be mocked easily in unit tests

```javascript
// models/commentModel.js
const CommentModel = {
  getByProject: async (projectId) => { ... },
  create: async (data) => { ... },
  delete: async (commentId) => { ... }
};
```

### 5.4 Observer Pattern (Real-Time Feed)

The live feed uses the **Observer Pattern** natively through Supabase Realtime. The frontend *subscribes* (observes) a channel, and Supabase *notifies* all subscribers when data changes.

```javascript
// frontend/js/feed.js
const channel = supabase
  .channel('public:projects')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'projects' },
    (payload) => {
      renderProjectCard(payload.new); // Observer callback
    }
  )
  .subscribe();
```

### 5.5 Module Pattern (Frontend)

Each frontend concern is wrapped in its own JS module/file, exposing only what's necessary. This prevents global namespace pollution and keeps responsibilities clear.

```javascript
// frontend/js/auth.js — only exports what other modules need
const Auth = (() => {
  const login = async (email, password) => { ... };
  const register = async (email, password, username) => { ... };
  const logout = async () => { ... };
  return { login, register, logout };
})();
```

---

## 6. Methodology — Scrum

MzansiBuilds was developed using a **Scrum-inspired agile approach**, adapted for solo development.

### Roles (Solo Adaptation)

| Scrum Role | Solo Equivalent |
|---|---|
| Product Owner | Me — I prioritised the backlog based on the challenge requirements |
| Scrum Master | Me — I held myself accountable to sprint goals and removed blockers |
| Developer | Me — Sole implementer |

### Sprint Structure (3-Day Sprints)

#### Sprint 1 — Foundation
- Set up Supabase project and tables
- Scaffold Node.js server with Express
- Implement auth routes (register, login, logout)
- Build login and registration HTML pages

#### Sprint 2 — Core Features
- Build project creation API and form
- Build live feed API and UI
- Implement real-time subscription
- Build comment and collaboration request features

#### Sprint 3 — Progress & Celebration
- Implement milestone update system
- Build Celebration Wall page
- Add profile management
- Write unit tests and achieve coverage targets

#### Sprint 4 — Polish & Submit
- Responsive CSS fixes
- Security hardening (input sanitisation, rate limiting)
- Final documentation (this README)
- GitHub repo made public

### Backlog (User Stories)

```
✅ As a developer, I can register so I can use the platform
✅ As a developer, I can log in and see my dashboard
✅ As a developer, I can post a new project with its stage
✅ As a developer, I can see what others are building in real-time
✅ As a developer, I can comment on other projects
✅ As a developer, I can raise a collaboration request
✅ As a developer, I can add milestones to track my progress
✅ As a developer, I appear on the Celebration Wall when I complete a project
```

### Definition of Done

A feature is considered **Done** when:
- The API route is implemented and returns correct HTTP status codes
- The UI correctly calls the API and renders the response
- At least one unit test covers the happy path and one covers an error case
- The feature is tested manually in the browser

---

## 7. Test-Driven Development (TDD)

### Philosophy

TDD on this project follows the **Red → Green → Refactor** cycle:

1. **Red** — Write a failing test that describes the expected behaviour
2. **Green** — Write the minimum code to make the test pass
3. **Refactor** — Clean up the code while keeping tests green

### Test Framework

- **Jest** — Test runner and assertion library
- **Supertest** — HTTP integration testing for Express routes

```bash
npm install --save-dev jest supertest
```

### Example TDD Flow — Project Creation Route

**Step 1: Write the failing test first**
```javascript
// tests/projects.test.js
const request = require('supertest');
const app = require('../server');

describe('POST /api/projects', () => {
  it('should return 401 if no auth token is provided', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ title: 'My App', description: 'Building something cool' });
    expect(res.statusCode).toBe(401);
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${testToken}`)
      .send({}); // empty body
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should create a project and return 201 with valid data', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        title: 'MzansiBuilds Test',
        description: 'A test project',
        stage: 'in_progress',
        support_needed: 'Design'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('MzansiBuilds Test');
  });
});
```

**Step 2: Implement the route to make tests pass**
```javascript
// routes/projects.js
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, stage, support_needed } = req.body;
  if (!title || !description || !stage) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const project = await ProjectModel.create(
    { title, description, stage, support_needed },
    req.user.id
  );
  res.status(201).json(project);
});
```

**Step 3: Refactor — extract validation into a helper, tests still pass**

### Test Files

```
tests/
├── auth.test.js         — Register, login, logout routes
├── projects.test.js     — CRUD for projects
├── comments.test.js     — Comment creation and retrieval
├── milestones.test.js   — Milestone addition and retrieval
└── celebrate.test.js    — Celebration Wall logic
```

### Running Tests

```bash
npm test                  # Run all tests
npm test -- --watch       # Watch mode
npm test -- --coverage    # With coverage report
```

---

## 8. Code Coverage

### Coverage Target

The project targets a minimum of **70% coverage** across all backend route files, with key routes (auth, projects) targeting **85%+**.

### What Coverage Measures

| Metric | Description |
|---|---|
| **Statements** | Has every line of code been executed? |
| **Branches** | Has every if/else path been taken? |
| **Functions** | Has every function been called? |
| **Lines** | How many lines were run vs total? |

### Sample Coverage Report

```
--------------------------------|---------|----------|---------|---------|
File                            | % Stmts | % Branch | % Funcs | % Lines |
--------------------------------|---------|----------|---------|---------|
routes/auth.js                  |   88.00 |    80.00 |  100.00 |   88.00 |
routes/projects.js              |   85.00 |    75.00 |  100.00 |   85.00 |
routes/comments.js              |   78.00 |    70.00 |   90.00 |   78.00 |
routes/milestones.js            |   72.00 |    65.00 |   85.00 |   72.00 |
middleware/authMiddleware.js     |   95.00 |    90.00 |  100.00 |   95.00 |
--------------------------------|---------|----------|---------|---------|
All files                       |   83.60 |    76.00 |   95.00 |   83.60 |
--------------------------------|---------|----------|---------|---------|
```

### Generating the Report

```bash
npm test -- --coverage
# Report is generated in /coverage/lcov-report/index.html
```

---

## 9. Polymorphism in the Codebase

### What is Polymorphism?

Polymorphism means "many forms" — the same interface behaves differently depending on the object or context it operates on.

### How MzansiBuilds Uses Polymorphism

#### 9.1 — Notification Types (Object Polymorphism)

Different notification types (comment, collaboration request, milestone) share the same `render()` interface but behave differently:

```javascript
// notifications/types.js

class Notification {
  constructor(data) { this.data = data; }
  render() { throw new Error('render() must be implemented'); }
  getIcon() { return '🔔'; }
}

class CommentNotification extends Notification {
  render() {
    return `${this.data.fromUser} commented on your project: "${this.data.project}"`;
  }
  getIcon() { return '💬'; }
}

class CollaborationNotification extends Notification {
  render() {
    return `${this.data.fromUser} wants to collaborate on "${this.data.project}"`;
  }
  getIcon() { return '🤝'; }
}

class MilestoneNotification extends Notification {
  render() {
    return `Milestone achieved on "${this.data.project}": ${this.data.milestone}`;
  }
  getIcon() { return '🏆'; }
}

// Polymorphic usage — same call, different output
const notifications = [
  new CommentNotification(commentData),
  new CollaborationNotification(collabData),
  new MilestoneNotification(milestoneData)
];

notifications.forEach(n => {
  console.log(n.getIcon(), n.render()); // Each behaves differently
});
```

#### 9.2 — Project Stage Badges (Duck Typing Polymorphism)

On the frontend, a single `renderBadge(stage)` function handles all stages differently:

```javascript
// frontend/js/feed.js
const stageBadgeConfig = {
  idea:        { label: 'Idea 💡',        color: '#aaa' },
  in_progress: { label: 'In Progress 🔨', color: '#27ae60' },
  completed:   { label: 'Completed 🚀',   color: '#2c3e50' }
};

function renderBadge(stage) {
  const config = stageBadgeConfig[stage] || stageBadgeConfig['idea'];
  return `<span class="badge" style="background:${config.color}">${config.label}</span>`;
}
// Same function → different output depending on the stage value passed in
```

#### 9.3 — Feed Renderers (Strategy Pattern as Polymorphism)

The feed can render items differently depending on the content type:

```javascript
const renderers = {
  project:   (item) => renderProjectCard(item),
  milestone: (item) => renderMilestoneUpdate(item),
  celebrate: (item) => renderCelebrationCard(item)
};

feedItems.forEach(item => {
  const renderer = renderers[item.type];
  if (renderer) feedContainer.innerHTML += renderer(item);
});
// Same forEach loop — polymorphic rendering based on type
```

---

## 10. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | HTML5, CSS3 | Markup and styling |
| Frontend JS | Vanilla JavaScript (ES6+) | DOM, API calls, real-time |
| Backend | Node.js v18+ | Runtime environment |
| Framework | Express.js | HTTP server and routing |
| Database | Supabase (PostgreSQL) | Data persistence |
| Auth | Supabase Auth | JWT-based authentication |
| Real-Time | Supabase Realtime | Live feed WebSockets |
| Testing | Jest + Supertest | Unit and integration tests |
| Version Control | Git + GitHub | Code management |

---

## 11. Folder Structure

```
mzansibuilds/
│
├── frontend/
│   ├── index.html              # Landing page / Login
│   ├── register.html           # Registration page
│   ├── dashboard.html          # Live feed (main app page)
│   ├── project.html            # Single project detail
│   ├── profile.html            # Developer profile management
│   ├── celebrate.html          # Celebration Wall
│   │
│   ├── css/
│   │   └── style.css           # Global styles (green/white/black theme)
│   │
│   └── js/
│       ├── supabase.js         # Supabase client initialisation
│       ├── auth.js             # Login, register, logout logic
│       ├── feed.js             # Live feed rendering + real-time sub
│       ├── project.js          # Project creation + milestone updates
│       └── profile.js          # Profile management logic
│
├── backend/
│   ├── server.js               # Express app entry point
│   │
│   ├── routes/
│   │   ├── auth.js             # POST /register, /login, /logout
│   │   ├── projects.js         # CRUD /projects
│   │   ├── comments.js         # POST/GET /comments
│   │   ├── milestones.js       # POST/GET /milestones
│   │   └── celebrate.js        # GET /celebrate
│   │
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   │
│   ├── models/
│   │   ├── projectModel.js     # Data access for projects
│   │   ├── commentModel.js     # Data access for comments
│   │   └── milestoneModel.js   # Data access for milestones
│   │
│   └── supabaseClient.js       # Supabase server-side client
│
├── tests/
│   ├── auth.test.js
│   ├── projects.test.js
│   ├── comments.test.js
│   ├── milestones.test.js
│   └── celebrate.test.js
│
├── .env                        # Environment variables (NOT committed)
├── .gitignore
├── package.json
└── README.md
```

---

## 12. Database Schema

### Tables

#### `profiles`
```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id),
  username    TEXT UNIQUE NOT NULL,
  bio         TEXT,
  skills      TEXT[],
  avatar_url  TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

#### `projects`
```sql
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  stage           TEXT CHECK (stage IN ('idea', 'in_progress', 'completed')),
  support_needed  TEXT,
  completed_at    TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

#### `milestones`
```sql
CREATE TABLE milestones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  achieved_at TIMESTAMP DEFAULT NOW()
);
```

#### `comments`
```sql
CREATE TABLE comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id),
  content     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

#### `collaborations`
```sql
CREATE TABLE collaborations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID REFERENCES projects(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES profiles(id),
  status       TEXT CHECK (status IN ('pending', 'accepted', 'declined')),
  message      TEXT,
  created_at   TIMESTAMP DEFAULT NOW()
);
```

---

## 13. API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new developer |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| POST | `/api/auth/logout` | ✅ | Invalidate session |

### Projects

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | ❌ | Get all projects (feed) |
| POST | `/api/projects` | ✅ | Create new project |
| GET | `/api/projects/:id` | ❌ | Get single project |
| PUT | `/api/projects/:id` | ✅ | Update project (stage, etc) |
| DELETE | `/api/projects/:id` | ✅ | Delete own project |

### Comments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/comments/:projectId` | ❌ | Get comments for project |
| POST | `/api/comments` | ✅ | Add a comment |

### Milestones

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/milestones/:projectId` | ❌ | Get project milestones |
| POST | `/api/milestones` | ✅ | Add milestone to project |

### Celebration Wall

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/celebrate` | ❌ | Get all completed projects and their devs |

---

## 14. How to Run the Project

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- A **Supabase account** — [supabase.com](https://supabase.com)
- **Git** — [git-scm.com](https://git-scm.com)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/mzansibuilds.git
cd mzansibuilds
```

---

### Step 2 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is ready, go to **SQL Editor**
3. Run the SQL from [Section 12 — Database Schema](#12-database-schema) to create all tables
4. Go to **Project Settings → API**
5. Copy your **Project URL** and **anon public key**

---

### Step 3 — Configure Environment Variables

Create a `.env` file in the `/backend` folder:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`.

---

### Step 4 — Install Backend Dependencies

```bash
cd backend
npm install
```

---

### Step 5 — Run the Backend Server

```bash
# Development mode (auto-restarts on file changes)
npm run dev

# Production mode
npm start
```

You should see:

```
✅ MzansiBuilds server running on http://localhost:5000
```

---

### Step 6 — Run the Frontend

The frontend is plain HTML/CSS/JS and does not need a build step. Open the files directly or serve them with a simple static server.

**Option A — VS Code Live Server:**
- Install the **Live Server** extension in VS Code
- Right-click `frontend/index.html` and select **Open with Live Server**

**Option B — Node static server:**
```bash
cd frontend
npx serve .
# Visit http://localhost:3000
```

**Option C — Open directly in browser:**
```bash
open frontend/index.html
```

---

### Step 7 — Configure Supabase URL in Frontend

In `frontend/js/supabase.js`, update with your Supabase credentials:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

---

### Step 8 — Run Tests

```bash
cd backend
npm test                     # All tests
npm test -- --coverage       # With coverage report
npm test -- --watch          # Watch mode during development
```

---

### Full Quick-Start Summary

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/mzansibuilds.git && cd mzansibuilds

# 2. Install dependencies
cd backend && npm install

# 3. Set up environment
cp .env.example .env   # then edit with your Supabase keys

# 4. Start backend
npm run dev

# 5. Open frontend (in a new terminal)
cd ../frontend && npx serve .

# 6. Run tests
cd ../backend && npm test -- --coverage
```

---

## 15. Ethical Use of AI

AI tools (specifically Claude by Anthropic) were used as a **development companion** during this project, in full compliance with the challenge's ethical use guidelines.

### How AI Was Used

| Task | AI Role | Own Thinking |
|---|---|---|
| README writing | AI drafted structure and content | I reviewed, restructured, and ensured accuracy against my own design decisions |
| Boilerplate setup | AI suggested Express scaffold | I adapted it to the specific feature requirements and project structure |
| Debugging | AI helped identify error causes | I understood each fix before applying it |
| Test writing | AI suggested test patterns | I wrote the actual test cases based on my feature logic |
| SQL schema | AI advised on normalization | I made final decisions on column names, constraints, and relationships |

### Principles Followed

- ✅ AI was never used to think *instead of* me — only to accelerate my thinking
- ✅ Every AI suggestion was reviewed, understood, and often modified before use
- ✅ I can explain every part of this codebase independently
- ✅ AI was not used to complete competence assessments or write answers I didn't understand
- ✅ The architecture, patterns, and methodology decisions are my own

> "AI is a tool, like a calculator — it does not replace the mathematician." — My development philosophy on this project.

---

## 16. Author

**Developer:** [Your Name]
**GitHub:** [github.com/your-username](https://github.com/your-username)
**Challenge:** Derivco Code Skills Challenge 2026
**Platform:** MzansiBuilds — Build in Public. Together.

---

*Built with 🌍 by Mzansi developers, for developers everywhere.*
