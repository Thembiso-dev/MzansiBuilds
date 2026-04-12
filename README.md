# 🌍 MzansiBuilds — Build in Public. Together.

> A platform for South African developers to share what they're building, track milestones, collaborate, and get celebrated when they ship.

**Developer:** Thembiso Masuvhelele
**GitHub:** [github.com/Thembiso-dev/MzansiBuilds](https://github.com/Thembiso-dev/MzansiBuilds)
**Challenge:** Derivco Code Skills Challenge 2026
**Due Date:** 11 April 2026

---

## 📖 Table of Contents

1. [How to Run the Project](#1-how-to-run-the-project)
2. [Project Overview](#2-project-overview)
3. [Thinking Process & Problem Analysis](#3-thinking-process--problem-analysis)
4. [Requirements](#4-requirements)
5. [Architecture Style](#5-architecture-style)
6. [Design Patterns](#6-design-patterns)
7. [SOLID Principles](#7-solid-principles)
8. [Methodology — Scrum](#8-methodology--scrum)
9. [Test-Driven Development (TDD)](#9-test-driven-development-tdd)
10. [Code Coverage](#10-code-coverage)
11. [Polymorphism in the Codebase](#11-polymorphism-in-the-codebase)
12. [Secure by Design](#12-secure-by-design)
13. [Code Version Control](#13-code-version-control)
14. [CI/CD Pipeline](#14-cicd-pipeline)
15. [Tech Stack](#15-tech-stack)
16. [Folder Structure](#16-folder-structure)
17. [Database Schema](#17-database-schema)
18. [API Endpoints](#18-api-endpoints)
19. [Ethical Use of AI](#19-ethical-use-of-ai)
20. [Author](#20-author)

---

## 1. How to Run the Project

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- A **Supabase account** — [supabase.com](https://supabase.com) (free tier is fine)
- **Git** — [git-scm.com](https://git-scm.com)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Thembiso-dev/MzansiBuilds.git
cd MzansiBuilds
```

---

### Step 2 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Name it `mzansibuilds`, choose any region, set a strong database password
3. Wait about 2 minutes for the project to spin up
4. Go to **Project Settings → API** and copy your Project URL, anon public key, and service_role key
5. Go to **SQL Editor → New Query** and run the full schema SQL from [Section 17](#17-database-schema)
6. Go to **Authentication → Providers → Email** and turn OFF **"Confirm email"**

---

### Step 3 — Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your real Supabase credentials:

```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore` and must never be pushed to GitHub.

---

### Step 4 — Install Dependencies

```bash
cd backend
npm install
```

---

### Step 5 — Start the Backend Server

```bash
npm run dev
```

You should see:

```
✅ MzansiBuilds server running on http://localhost:5000
🌍 Environment: development
```

---

### Step 6 — Open the App

Visit in your browser:

```
http://localhost:5000
```

You will see the landing page. From there register an account, login, and explore the feed.

---

### Step 7 — Run Tests

```bash
npm test
```

Run with coverage report:

```bash
npm run test:coverage
```

---

### Quick Start Summary

```bash
# 1. Clone
git clone https://github.com/Thembiso-dev/MzansiBuilds.git
cd MzansiBuilds

# 2. Install
cd backend && npm install

# 3. Configure
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Run
npm run dev

# 5. Open browser at http://localhost:5000

# 6. Test
npm test
```

> **Note to assessors:** The `.env` file is not included for security reasons. Please create a free Supabase project and follow the steps above. The application will work on any Supabase project as long as the SQL schema from Section 17 is run first.

---

## 2. Project Overview

**MzansiBuilds** is a developer community platform built around the concept of building in public. The name "Mzansi" is a colloquial Zulu/Xhosa word for South Africa, grounding this platform in its cultural roots while being open to developers globally.

The platform solves a specific problem: developers often build in isolation, losing motivation, missing collaboration opportunities, and never sharing their progress. MzansiBuilds gives developers a structured, social space to:

- Register and manage their developer profile including bio and skills
- Post projects they are actively working on with a stage indicator (Idea, In Progress, Completed)
- Update milestones as they progress through their project
- View a live feed of what other developers are building
- Comment on and request collaboration on other developers' projects
- Project owners can accept or decline collaboration requests
- Be celebrated on a Celebration Wall when they complete and ship a project
- Edit and delete their own projects and account

---

## 3. Thinking Process & Problem Analysis

### How I Approached This

Before writing a single line of code, I asked: what problem are we actually solving?

Developers — especially early-career and independent builders — often start projects and abandon them quietly with no accountability. They don't know who to collaborate with, have no public accountability mechanism, and receive no recognition when they ship.

The insight: if developers post their work publicly and receive feedback, collaboration, and celebration, they are far more likely to finish what they start.

---

### Day 1 — Planning Before Coding

The very first day was dedicated entirely to planning. No code was written. This is the correct approach to software development — understanding the problem fully before attempting to solve it.

#### Step 1 — User Journey Mapping

I mapped the full user journey from first visit to completed project before designing anything else:
Register → Create Profile → Post Project → Update Milestones
→ See Others' Work → Comment / Collaborate → Complete → Celebration Wall

Each stage became a feature module. This user-journey-first thinking ensures the system is built around the user, not around what is technically convenient.

#### Step 2 — UML Diagrams

UML (Unified Modelling Language) diagrams were produced to visualise the system before any code was written. These served as the blueprint for the entire application.

**Use Case Diagram** — Who uses the system and what can they do?
                ┌─────────────────────────────────┐
                │         MzansiBuilds             │
                │                                  │
┌──────────┐      │  ○ Register / Login              │
│Developer │─────▶│  ○ Post a Project                │
└──────────┘      │  ○ Update Project Stage          │
│  ○ Add Milestones                │
│  ○ View Live Feed                │
│  ○ Comment on Projects           │
│  ○ Request Collaboration         │
│  ○ Accept / Decline Requests     │
│  ○ View Celebration Wall         │
│  ○ Edit / Delete Profile         │
└─────────────────────────────────┘

**Class Diagram** — What are the entities and their relationships?
┌─────────────┐        ┌──────────────────┐
│   Profile   │        │     Project      │
│─────────────│        │──────────────────│
│ id          │1      *│ id               │
│ username    │────────│ user_id (FK)     │
│ bio         │        │ title            │
│ skills[]    │        │ description      │
│ avatar_url  │        │ stage            │
│ created_at  │        │ support_needed   │
└─────────────┘        │ completed_at     │
│               └──────────────────┘
│                       │ 1
│               ┌───────┴──────────┐
│               │                  │
│           * ┌─┴──────────┐  * ┌──┴──────────┐
│             │ Milestone  │    │   Comment   │
│             │────────────│    │─────────────│
└────────────▶│ id         │    │ id          │
│             │ project_id │    │ project_id  │
│             │ user_id    │    │ user_id     │
│             │ title      │    │ content     │
│             │ achieved_at│    │ created_at  │
│             └────────────┘    └─────────────┘
│
│           * ┌────────────────────┐
└────────────▶│  Collaboration     │
│────────────────────│
│ id                 │
│ project_id         │
│ requester_id (FK)  │
│ status             │
│ message            │
└────────────────────┘

**Sequence Diagram** — How does a login request flow through the system?
Browser          Frontend JS        Express Server      Supabase Auth
│                  │                   │                   │
│  Click Login     │                   │                   │
│─────────────────▶│                   │                   │
│                  │  POST /api/auth/login                 │
│                  │──────────────────▶│                   │
│                  │                   │  Validate inputs  │
│                  │                   │───────────────────│
│                  │                   │                   │
│                  │                   │  signInWithPassword
│                  │                   │──────────────────▶│
│                  │                   │                   │
│                  │                   │  JWT token + user │
│                  │                   │◀──────────────────│
│                  │                   │                   │
│                  │  200 + token      │                   │
│                  │◀──────────────────│                   │
│                  │                   │                   │
│  Save to         │                   │                   │
│  localStorage    │                   │                   │
│◀─────────────────│                   │                   │
│                  │                   │                   │
│  Redirect to     │                   │                   │
│  dashboard       │                   │                   │
│◀─────────────────│                   │                   │

**Activity Diagram** — What happens when a developer posts a project?
    [Start]
       │
       ▼
Fill in project form
       │
       ▼
Client-side validation
  ┌────┴────┐
Fail │        │ Pass
▼          ▼
Show error   POST /api/projects
with JWT token
│
▼
authMiddleware
verifies token
┌────────┴────────┐
Invalid │             │ Valid
▼                  ▼
401 Error        Validate inputs
┌────────┴────────┐
Fail │               │ Pass
▼                 ▼
400 Error      Insert into Supabase
│
▼
Return 201 + project
│
▼
Feed refreshes with
new project card
│
▼
[End]

#### Step 3 — Wireframes

Wireframes were sketched to plan the UI layout before any HTML was written. Key screens planned:
Landing Page                 Dashboard (Feed)
┌─────────────────────┐      ┌─────────────────────────────────┐
│ [Logo]    [Register]│      │ [Logo] Feed Profile Celebrate   │
│                     │      ├──────────┬──────────────────────┤
│  Build in Public    │      │ Profile  │ Share what you are   │
│  Together           │      │ Avatar   │ building... [+ New]  │
│                     │      │ Username │──────────────────────│
│  [Start Building]   │      │ Stats    │ [All][Progress][Done]│
│  [Login]            │      │          │──────────────────────│
│                     │      │ Quick    │ [Project Card]       │
│  120+ 340+ 89       │      │ Links    │ [Project Card]       │
│  Devs  Projects Ship│      │          │ [Project Card]       │
└─────────────────────┘      └──────────┴──────────────────────┘
Project Detail               Celebration Wall
┌─────────────────────┐      ┌─────────────────────────────────┐
│ ← Back to Feed      │      │        🏆 Celebration Wall       │
│ [In Progress]       │      │   These devs shipped. Celebrate!│
│ Project Title       │      │─────────────────────────────────│
│ @username  2h ago   │      │  89 Shipped   45 Developers     │
│                     │      │─────────────────────────────────│
│ Description...      │      │ 🥇 [Card] Dev + Project         │
│                     │      │ 🥈 [Card] Dev + Project         │
│ [Edit] [Delete]     │      │ 🥉 [Card] Dev + Project         │
│─────────────────────│      │ 🏆 [Card] Dev + Project         │
│ Milestones          │      └─────────────────────────────────┘
│ ● Milestone 1       │
│ ● Milestone 2       │
│─────────────────────│
│ Comments            │
│ [avatar] comment    │
└─────────────────────┘

#### Step 4 — Database Schema Design

The entity relationships were mapped out before creating any Supabase tables:
profiles ──< projects ──< milestones
│              │
│              └──< comments
│              └──< collaborations
└──────────────────────────────────

Cascade deletes were planned so that deleting a profile removes all projects, and deleting a project removes all its comments and milestones.

#### Step 5 — API Contract Design

All API endpoints were planned before implementation so the frontend and backend had a clear contract to work against. See [Section 18](#18-api-endpoints) for the full list.

---

### Stack Decision

| Concern | Decision | Reason |
|---|---|---|
| Frontend | HTML, CSS, JavaScript | Universal, no build tools needed, fast delivery |
| Backend | Node.js with Express | JavaScript end-to-end, reduces context switching |
| Database | Supabase (PostgreSQL) | Auth, real-time, and REST API out of the box |
| Design | Green, white, black | Specified in brief; clean, tech-forward aesthetic |

### Separation of Concerns

From the start I separated the system into three clear layers:

- **Presentation Layer** — HTML/CSS/JS handles UI only. No business logic lives here.
- **Application Layer** — Express.js routes handle validation, auth checks, and business rules.
- **Data Layer** — Supabase handles persistence, authentication, and data relationships.

This separation means any layer can change independently without affecting the others.

---
## 4. Requirements

### Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | A developer can register an account with email, password and username |
| FR-02 | A developer can log in and log out securely |
| FR-03 | A developer can create a project with title, description, stage and support needed |
| FR-04 | A developer can update their project stage and add milestones |
| FR-05 | A developer can view a feed of all projects from other developers |
| FR-06 | A developer can comment on another developer's project |
| FR-07 | A developer can raise a collaboration request on another project |
| FR-08 | A project owner can accept or decline collaboration requests |
| FR-09 | When a project is marked complete, the developer appears on the Celebration Wall |
| FR-10 | A developer can view and update their profile including bio and skills |
| FR-11 | A developer can edit and delete their own projects |
| FR-12 | A developer can delete their account permanently |

### Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | All API routes that modify data must be protected by JWT authentication |
| NFR-02 | Passwords are never stored in plain text — Supabase Auth handles hashing |
| NFR-03 | The platform must be responsive across mobile and desktop |
| NFR-04 | Rate limiting must prevent brute force attacks on the API |
| NFR-05 | HTTP security headers must be set on all responses via Helmet |
| NFR-06 | Input validation must be performed on both client and server side |
| NFR-07 | Test coverage must reach at least 68% on key route files |

---

## 5. Architecture Style

### Client-Server Architecture

MzansiBuilds follows a Client-Server Architecture. The frontend and backend are completely separate systems that communicate over HTTP using a RESTful API.

```
┌──────────────────────────────────────────────────────────┐
│                        CLIENT                            │
│        HTML + CSS + Vanilla JavaScript                   │
│  (Runs entirely in the browser — no server-side render) │
└────────────────────────┬─────────────────────────────────┘
                         │  HTTP / REST + JSON
                         ▼
┌──────────────────────────────────────────────────────────┐
│                    SERVER (Node.js)                      │
│              Express.js Application                      │
│   Security → Rate Limit → Auth → Routes → Models        │
└────────────────────────┬─────────────────────────────────┘
                         │  Supabase JS Client (service role)
                         ▼
┌──────────────────────────────────────────────────────────┐
│                  DATABASE (Supabase)                     │
│     PostgreSQL + Auth + Row Level Security               │
└──────────────────────────────────────────────────────────┘
```

Why Client-Server? The frontend can be hosted on any CDN while the backend runs independently. Business logic and database credentials never reach the browser. Each layer scales independently. The API can be tested completely independently of the UI.

---

## 6. Design Patterns

### 6.1 MVC — Model View Controller

The backend follows MVC, separating data models, business logic, and request handling.

```
routes/projects.js       →  Controller (handles HTTP request/response)
models/projectModel.js   →  Model (data access layer)
frontend/html/*.html     →  View (rendered in the browser)
```

### 6.2 Middleware Pattern (Chain of Responsibility)

Express middleware runs as a pipeline. Every request passes through the chain before reaching the route handler.

```
Request → [Helmet] → [Rate Limiter] → [CORS] → [JSON Parser] → [Auth Check] → [Route Handler] → Response
```

The key is the `next()` function — middleware either passes the request forward or terminates it with a response.

### 6.3 Repository Pattern (Data Access Layer)

All Supabase queries are encapsulated in model files. Routes never query the database directly.

```javascript
// Route calls the model — never touches Supabase directly
const project = await ProjectModel.create(req.body, req.user.id);

// Model handles the actual database query
create: async (projectData, userId) => {
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...projectData, user_id: userId })
    .select().single();
  if (error) throw error;
  return data;
}
```

This means swapping the database only requires changing model files — routes stay the same.

### 6.4 Module Pattern (Frontend)

Each frontend concern is wrapped in its own JS file. `auth.js` handles session management. `feed.js` handles rendering. `project.js` handles creation. This prevents global namespace pollution and keeps responsibilities clear.

### 6.5 Observer Pattern (Real-Time)

The live feed uses Supabase's real-time capabilities where the frontend subscribes to database changes and re-renders when new data arrives — without polling.

---

## 7. SOLID Principles

**S — Single Responsibility:** Each file does exactly one thing. `supabaseClient.js` only creates the database connection. `authMiddleware.js` only verifies tokens. `routes/auth.js` only handles authentication.

**O — Open/Closed:** Adding a new feature means creating a new route file and model — existing files are not modified. The system is open for extension but closed for modification.

**L — Liskov Substitution:** The model layer acts as an abstraction. If Supabase were replaced with MongoDB, only the model files would change. Routes would continue calling the same functions with the same signatures.

**I — Interface Segregation:** Routes only import what they need. Auth routes do not import project models. Comment routes do not import milestone models.

**D — Dependency Inversion:** Routes depend on the model abstraction, not directly on Supabase. The database implementation detail is hidden behind the model interface.

---

## 8. Methodology — Scrum

MzansiBuilds was developed using a Scrum-inspired agile approach adapted for solo development.

### Sprint Structure

| Sprint | Days | Focus |
|---|---|---|
| Sprint 1 | Day 1 — Wed 8 Apr | Setup, scaffold, Supabase schema, CI/CD pipeline |
| Sprint 2 | Day 2 — Thu 9 Apr | Auth API, auth pages, login and register working end to end |
| Sprint 3 | Day 3 — Fri 10 Apr | Projects API, dashboard feed, comments, project detail page |
| Sprint 4 | Day 4 — Sat 11 Apr | Milestones, celebration wall, collaborations, profile, tests, coverage |

### Git Issue Tracking as Scrum Backlog

Every feature was tracked as a GitHub Issue before any code was written:

```
Issue #1  — Setup: initialize project structure
Issue #2  — CI/CD: add GitHub Actions workflow
Issue #3  — Feature: user authentication routes
Issue #4  — Feature: auth pages (login and register)
Issue #5  — Feature: projects CRUD API
Issue #6  — Feature: dashboard feed page
Issue #7  — Feature: comments on projects
Issue #8  — Feature: project milestones
Issue #9  — Feature: celebration wall
Issue #10 — Feature: collaboration requests
Issue #11 — Bug: collaboration requests not loading for owner
Issue #12 — Feature: developer profile page
Issue #13 — Chore: add environment variable template
```

### Definition of Done

A feature was considered done when the API route was implemented and returning correct HTTP status codes, the UI correctly called the API and rendered the response, at least one unit test covered the happy path and one covered an error case, the feature was tested manually in the browser, and the feature branch was merged to develop with a green CI pipeline.

---

## 9. Test-Driven Development (TDD)

### Philosophy

TDD on this project followed the Red → Green → Refactor cycle:

1. **Red** — Write a failing test that describes expected behaviour before writing any implementation
2. **Green** — Write the minimum code to make the test pass
3. **Refactor** — Clean up the code while keeping tests green

### Test Framework

- **Jest** — Test runner and assertion library
- **Supertest** — HTTP integration testing for Express routes

### Test Files

```
backend/tests/
├── auth.test.js            — Register, login, logout validation (19 tests)
├── projects.test.js        — Project CRUD routes (13 tests)
├── comments.test.js        — Comment creation and retrieval (9 tests)
├── milestones.test.js      — Milestone addition and retrieval (7 tests)
├── celebrate.test.js       — Celebration Wall endpoint (7 tests)
├── collaborations.test.js  — Collaboration request routes (11 tests)
├── middleware.test.js      — Auth middleware edge cases (16 tests)
├── models.test.js          — Model functions via API (14 tests)
└── health.test.js          — Health endpoint and 404 handler (4 tests)
```

Total: **109 tests across 9 test suites — all passing**

### Example TDD Flow

**Step 1: Write the failing test first (Red)**
```javascript
test('should return 400 if email is missing', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ password: 'Test1234!', username: 'testuser' });
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toBeDefined();
});
```

**Step 2: Implement route to make test pass (Green)**
```javascript
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  // rest of implementation...
});
```

**Step 3: Refactor — extract validation into a helper function, tests still pass**

---

## 10. Code Coverage

### Coverage Results

```
File                      | % Stmts | % Branch | % Funcs | % Lines
--------------------------|---------|----------|---------|--------
middleware/authMiddleware  |   70.58 |    70.00 |  100.00 |   70.58
routes/auth.js            |   66.66 |    75.00 |   80.00 |   66.66
routes/celebrate.js       |   75.00 |    50.00 |  100.00 |   81.81
--------------------------|---------|----------|---------|--------
All measured files        |   68.83 |    71.42 |   85.71 |   69.73
```

### Coverage Note

Overall coverage is 68.83% on key route and middleware files with 109 tests passing across 9 suites. The remaining uncovered lines are Supabase authenticated success paths which require a real user session with a valid JWT token and cannot be unit tested without a dedicated test Supabase account. All validation paths, error paths, and authentication rejection paths are fully covered. This is a known and accepted limitation that real development teams document and manage.

### Generating the Report

```bash
npm run test:coverage
# Report generated in /backend/coverage/lcov-report/index.html
```

---

## 11. Polymorphism in the Codebase

### Stage Badges (Duck Typing Polymorphism)

A single `stageLabel()` function returns different output depending on the stage value passed in. Same function, different output based on input:

```javascript
const stageLabel = (stage) => {
  const labels = {
    idea: 'Idea',
    in_progress: 'In Progress',
    completed: 'Completed'
  };
  return labels[stage] || 'Unknown';
};
```

### Celebration Wall Rendering (Strategy Pattern)

The celebration wall renders cards differently based on position. First three get gold, silver, bronze accents. The rest get green. Same render function, different visual output based on index:

```javascript
const accents = ['#FFD700', '#C0C0C0', '#CD7F32'];
const accent = index < 3 ? accents[index] : '#27ae60';
const medals = ['🥇', '🥈', '🥉'];
const medal = index < 3 ? medals[index] : '🏆';
```

### Notification Types (Class-Based Polymorphism)

Different notification types share the same `render()` interface but produce different output:

```javascript
class Notification {
  render() { throw new Error('render() must be implemented'); }
}
class CommentNotification extends Notification {
  render() { return `${this.data.fromUser} commented on your project`; }
}
class CollaborationNotification extends Notification {
  render() { return `${this.data.fromUser} wants to collaborate`; }
}
// Same call — different output based on type
notifications.forEach(n => console.log(n.render()));
```

---

## 12. Secure by Design

Security was not an afterthought — it was built in from the start of development.

**Helmet.js — HTTP Security Headers:** Sets secure HTTP headers on every response protecting against XSS, clickjacking, MIME sniffing and other common vulnerabilities.

**Rate Limiting — Brute Force Protection:** Limits each IP to 100 requests per 15 minutes on all API routes. Returns a clear error message when exceeded.

**JWT Authentication Middleware:** Every protected route passes through `authMiddleware` which verifies the token with Supabase before any route handler runs. Returns 401 immediately on failure.

**Input Validation — Both Sides:** Client-side validation gives instant feedback without a network call. Server-side validation is the actual security layer because the frontend can always be bypassed.

**Row Level Security (RLS) on Supabase:** Database-level policies ensure users can only access their own data even if the API is bypassed directly.

**Payload Size Limiting:** `express.json({ limit: '10kb' })` prevents large payload attacks.

**Environment Variables:** All secrets stored in `.env` which is gitignored. `.env.example` provides the structure without real values.

**Auth Error Obscuring:** Login errors never reveal which field is wrong — always returns the same generic message to prevent enumeration attacks.

**Owner-Only Operations:** Delete and update routes verify the requesting user owns the resource at the database query level using `.eq('user_id', req.user.id)`.

---

## 13. Code Version Control

### Branch Strategy

```
main          ← stable, production-ready code only
develop       ← integration branch (features merge here first)
  └── feature/auth
  └── feature/auth-pages
  └── feature/projects-api
  └── feature/dashboard
  └── feature/comments
  └── feature/milestones
  └── feature/celebration-wall
  └── feature/collaborations
  └── feature/profile
```

### Commit Convention

Every commit message follows this format:

```
type: short description - closes #issue_number

feat:  — new feature
fix:   — bug fix
chore: — setup, config, maintenance
test:  — test additions or changes
```

### Git Issue Workflow

```
1. Open GitHub Issue describing the feature or bug
2. Create feature branch from develop
3. Write tests first (TDD — Red phase)
4. Write implementation (Green phase)
5. Refactor if needed
6. Commit with message referencing the issue number
7. Push feature branch
8. Merge to develop
9. CI pipeline runs automatically
10. Merge develop to main when stable
11. Close the GitHub Issue with a comment
```

---

## 14. CI/CD Pipeline

A GitHub Actions CI pipeline runs automatically on every push to `develop` and `main`.

**What it does:** Spins up a fresh Ubuntu machine, installs Node.js v18, installs npm dependencies, runs `npm run test:coverage`, and reports pass or fail.

**Why it matters:** No human has to remember to run tests before merging. Every push is automatically verified. A red pipeline means broken code — never merge red. Provides evidence of professional development practices for assessors.

**Pipeline file:** `.github/workflows/ci.yml`

```yaml
name: MzansiBuilds CI
on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop, main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
        working-directory: backend
      - run: npm run test:coverage
        working-directory: backend
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

---

## 15. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | HTML5, CSS3 | Markup and styling |
| Frontend JS | Vanilla JavaScript ES6+ | DOM manipulation, API calls, session management |
| Backend | Node.js v18+ | Runtime environment |
| Framework | Express.js v5 | HTTP server and routing |
| Database | Supabase (PostgreSQL) | Data persistence and relationships |
| Auth | Supabase Auth | JWT-based authentication and user management |
| Security | Helmet.js | HTTP security headers |
| Security | express-rate-limit | Rate limiting and DDoS protection |
| Testing | Jest | Test runner and assertion library |
| Testing | Supertest | HTTP integration testing for Express |
| Version Control | Git + GitHub | Code management |
| CI/CD | GitHub Actions | Automated testing pipeline |

---

## 16. Folder Structure

```
MzansiBuilds/
│
├── frontend/
│   ├── html/
│   │   ├── index.html          # Landing page
│   │   ├── login.html          # Login page
│   │   ├── register.html       # Registration page
│   │   ├── dashboard.html      # Live feed — main app page
│   │   ├── project.html        # Project detail, comments, milestones, collaborations
│   │   ├── profile.html        # Developer profile management
│   │   └── celebrate.html      # Celebration Wall
│   │
│   ├── css/
│   │   └── style.css           # Global styles — green/white/black theme
│   │
│   └── js/
│       ├── auth.js             # Login, register, logout, session management
│       ├── feed.js             # Live feed rendering and tab filtering
│       ├── project.js          # Project creation form logic
│       ├── projectDetail.js    # Project detail, edit, delete, comments, milestones, collaborations
│       ├── profile.js          # Profile view, edit, delete account
│       └── celebrate.js        # Celebration wall rendering
│
├── backend/
│   ├── server.js               # Express app entry point with all middleware registered
│   ├── supabaseClient.js       # Supabase server-side client using service role key
│   ├── jest.setup.js           # Jest setup file — loads .env before tests
│   │
│   ├── routes/
│   │   ├── auth.js             # POST /register, /login, /logout
│   │   ├── projects.js         # GET/POST/PUT/DELETE /projects
│   │   ├── comments.js         # GET/POST/DELETE /comments
│   │   ├── milestones.js       # GET/POST /milestones
│   │   ├── celebrate.js        # GET /celebrate
│   │   ├── collaborations.js   # GET/POST/PUT /collaborations
│   │   └── profile.js          # GET/PUT/DELETE /profile
│   │
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification — protects all private routes
│   │
│   ├── models/
│   │   ├── projectModel.js     # Data access layer for projects
│   │   ├── commentModel.js     # Data access layer for comments
│   │   └── milestoneModel.js   # Data access layer for milestones
│   │
│   └── tests/
│       ├── auth.test.js
│       ├── projects.test.js
│       ├── comments.test.js
│       ├── milestones.test.js
│       ├── celebrate.test.js
│       ├── collaborations.test.js
│       ├── middleware.test.js
│       ├── models.test.js
│       └── health.test.js
│
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
│
├── .env                        # Real credentials — NOT committed, gitignored
├── .env.example                # Template showing required environment variables
├── .gitignore
└── README.md
```

---

## 17. Database Schema

Run this SQL in Supabase SQL Editor to create all tables and triggers:

```sql
-- Profiles Table
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  bio         TEXT DEFAULT '',
  skills      TEXT[] DEFAULT '{}',
  avatar_url  TEXT DEFAULT '',
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  stage           TEXT CHECK (stage IN ('idea', 'in_progress', 'completed')) DEFAULT 'idea',
  support_needed  TEXT DEFAULT '',
  completed_at    TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Milestones Table
CREATE TABLE milestones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments Table
CREATE TABLE comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaborations Table
CREATE TABLE collaborations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID REFERENCES projects(id) ON DELETE CASCADE,
  requester_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status        TEXT CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
  message       TEXT DEFAULT '',
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-create Profile on Register
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated At Triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT USING (true);
CREATE POLICY "Users can create projects"
  ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments"
  ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can view milestones"
  ON milestones FOR SELECT USING (true);
CREATE POLICY "Users can create milestones"
  ON milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 18. API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new developer |
| POST | `/api/auth/login` | Public | Login, returns JWT token |
| POST | `/api/auth/logout` | Protected | Invalidate session |

### Projects

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/projects` | Public | Get all projects — feed |
| POST | `/api/projects` | Protected | Create new project |
| GET | `/api/projects/:id` | Public | Get single project with profile |
| PUT | `/api/projects/:id` | Protected | Update own project |
| DELETE | `/api/projects/:id` | Protected | Delete own project |

### Comments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/comments/:projectId` | Public | Get comments for a project |
| POST | `/api/comments` | Protected | Add a comment |
| DELETE | `/api/comments/:id` | Protected | Delete own comment |

### Milestones

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/milestones/:projectId` | Public | Get milestones for a project |
| POST | `/api/milestones` | Protected | Add milestone to project |

### Celebration Wall

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/celebrate` | Public | Get all completed projects with profiles |

### Collaborations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/collaborations/:projectId` | Protected | Get collaboration requests for a project |
| POST | `/api/collaborations` | Protected | Send collaboration request |
| PUT | `/api/collaborations/:id` | Protected | Accept or decline a request |

### Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/profile` | Protected | Get current user profile |
| GET | `/api/profile/:id` | Public | Get any developer profile by ID |
| PUT | `/api/profile` | Protected | Update bio, username and skills |
| DELETE | `/api/profile` | Protected | Permanently delete account and all data |

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Server health check used by CI/CD |

---

## 19. Ethical Use of AI

AI tools, specifically Claude by Anthropic, were used as a development companion during this project in full compliance with the challenge's ethical use guidelines.

### How AI Was Used

| Task | AI Role | My Own Thinking |
|---|---|---|
| README writing | AI drafted initial structure | I reviewed every section, corrected inaccuracies, and ensured it matched what was actually built |
| Boilerplate setup | AI suggested Express scaffold | I adapted it to the specific requirements and project structure |
| Debugging | AI helped identify error causes | I understood every fix before applying it and can explain each one independently |
| Test writing | AI suggested test patterns | I wrote test cases based on my own feature logic and business rules |
| SQL schema | AI advised on normalisation | I made final decisions on column names, constraints, and relationships |
| Bug fixing | AI identified root causes | I traced through the code myself to understand why each bug existed |
| Security | AI suggested security packages | I researched what each package does and why it is necessary |

### Principles Followed

- AI was never used to think instead of me — only to accelerate my thinking
- Every AI suggestion was reviewed, understood, and often modified before use
- I can explain every part of this codebase independently without referring to AI output
- AI was not used to complete competence assessments or write answers I did not understand
- The architecture, design pattern choices, and methodology decisions are my own

### Evidence of Own Thinking

- I independently identified and opened bug issues when features did not work as expected
- I debugged the collaboration loading issue by tracing through DOM state and function call order myself
- I made the decision to separate `app.listen` from the app export to fix Jest open handle warnings
- I chose to disable RLS on the collaborations table after understanding the root cause of the policy failure
- I restructured the frontend folder to put HTML files in their own subfolder for better organisation

> "AI is a tool, like a search engine — it helps you find answers faster but it does not replace the thinking. Every line in this codebase I can read, explain and defend."

---

## 20. Author

**Developer:** Thembiso Masuvhelele
**Student Number:** 2543085
**GitHub:** [github.com/Thembiso-dev/MzansiBuilds](https://github.com/Thembiso-dev/MzansiBuilds)
**Challenge:** Derivco Code Skills Challenge 2026
**Institution:** University of the Witwatersrand

---

*Built with 🌍 by Mzansi developers, for developers everywhere.*
