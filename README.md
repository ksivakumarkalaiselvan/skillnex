# 🚀 SKILLNEX — AI-Powered Smart Education Platform

**Tagline:** *“Learn Better. Grow Smarter.”*

SKILLNEX is an AI-powered Smart Education ecosystem that transforms traditional learning into an intelligent, personalized, measurable experience. The platform combines a **Student-Driven Study Planner**, **Subject-Specific Adaptive Assessments**, **Data-Driven Skill Measurement**, **Local Ollama AI Integration**, **AI Teacher Copilot Intelligence**, and **Google Sheets Database Architecture**.

---

## 🌟 Key Modules & Features

### 1. Minimalist Data-Driven Student Dashboard
The student dashboard displays strictly 4 core metrics:
- **Student Name**: Displays the logged-in student's name dynamically from their profile (e.g., `Welcome, Sivakumar`).
- **Overall Skill Score**: Calculated average across all completed subject assessments:
  $$\text{Overall Score} = \frac{\sum \text{Assessed Subject Scores}}{\text{Total Assessed Subjects}}$$
- **Active Courses**: Count & list of active subjects with current study plans (e.g., `3` — `Mathematics • Physics • Computer Science`).
- **Best Performing Subject (Automatically Highlighted)**: Evaluates all completed subject assessment scores and dynamically highlights the top subject (e.g., **🏆 Best Performing Subject: Physics — 88%** or **Mathematics — 95%**).

### 2. Single-Subject Student-Driven Study Planner
- **Workflow**: Asks *"Which subject do you find difficult to study?"*.
- **Targeted Plan**: Generates a 5-day study plan **ONLY for the selected subject** (e.g., Mathematics, Physics, Chemistry, Computer Science, Programming, English, Electronics).
- **Direct Link**: Includes a direct button *"Take [Subject] Assessment ➔"* leading into the subject-specific assessment.

### 3. Subject-Specific Assessments
- **Isolated Tests**: Renders questions **strictly for the requested subject**. Never mixes unrelated subjects.
- **Calculated Skill Score Formula**:
  $$\text{Skill Score} = \left(\frac{\text{Correct Answers}}{\text{Total Questions}}\right) \times 100$$
- **Calculated Skill Level Thresholds**:
  - `90–100`: **Excellent**
  - `75–89`: **Good**
  - `50–74`: **Intermediate**
  - `Below 50`: **Needs Improvement**

### 4. Subject-Wise Skill Profile
- Displays skill scores and levels **only for subjects that have been assessed**.
- Shows exact scores, correct answer counts, and skill levels derived strictly from assessment performance.

### 5. Ollama Local AI Workspace (`http://localhost:11434`)
- Connects directly to local Ollama instances (`ollama serve`).
- Auto-detects local models (e.g., `qwen2.5:3b-instruct`, `llama3`, `mistral`, `gemma`).
- Provides private, offline LLM inference for coding, explanations, and logic.

### 6. Teacher Dashboard & AI Copilot
- **Class Analytics**: Total students, average understanding, and attendance rates.
- **Student Risk Matrix**: Early warning system flagging High, Medium, and Low risk students for mentor intervention.

### 7. Institution Admin Dashboard
- **Course Completion Rates**: Real-time progress bars per course module.
- **Department Skill Gaps**: Highlights specific weak topics per department.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism, Dark/Light Mode, Responsive Grid), Vanilla JavaScript (ES Modules).
- **Backend**: Node.js, Express.js REST API.
- **AI Engine**: Local Ollama Integration (`http://localhost:11434`) + Structured Knowledge Base Dataset (`backend/data/knowledgeBase.json`).
- **Database**: Google Sheets accessed via Google Apps Script Web App API (`SKILLNEX_DATABASE`) + Dual-Mode Fallback (`USE_DEMO_DATA: true`).

---

## 📂 Project Structure

```text
SKILLNEX/
│
├── frontend/
│   ├── index.html                  # Landing Page & Hero Visual
│   ├── login.html                  # 1-Click Role Login (Student, Teacher, Admin)
│   ├── register.html               # Registration with Department selection
│   ├── student-dashboard.html      # Minimalist Student Hub (Name, Overall Score, Active Courses, Best Subject)
│   ├── teacher-dashboard.html      # AI Teacher Copilot & Risk Warning Matrix
│   ├── admin-dashboard.html        # Institution & Department Analytics
│   ├── study-planner.html          # Single-Subject Difficult Study Planner
│   ├── assessments.html            # Subject-Specific Assessment Engine & Score Calculator
│   ├── skills.html                 # Subject-Wise Skill Intelligence Dashboard
│   ├── courses.html                # My Courses Catalog
│   ├── ollama-ai.html              # Local Ollama AI Workspace
│   ├── css/
│   │   ├── style.css               # Design tokens, variables & glassmorphism
│   │   ├── landing.css             # Hero graphics & landing grid
│   │   ├── dashboard.css           # Sidebar layout & stat cards
│   │   ├── components.css          # Modals, Toasts, & Progress bars
│   │   └── responsive.css          # Desktop, Tablet & Mobile adaptors
│   └── js/
│       ├── config.js               # API_URL & app settings
│       ├── api.js                  # Fetch wrapper & API client
│       ├── auth.js                 # Session guard & role routing
│       ├── components.js           # Header, Sidebar, Toasts & Modals
│       ├── dashboard.js            # Minimalist dashboard logic & score calculation
│       ├── planner.js              # Single-subject planner controller
│       ├── assessment.js           # Subject-specific quiz engine & score calculator
│       ├── skills.js               # Subject skill profile controller
│       ├── courses.js              # Course catalog controller
│       └── ollama.js               # Ollama local AI UI controller
│
├── backend/
│   ├── server.js                   # Express REST API Server
│   ├── .env                        # PORT, GOOGLE_SHEETS_API_URL, USE_DEMO_DATA, OLLAMA_HOST
│   ├── GoogleAppsScript.gs         # 1-Click Google Sheets Web App API Script
│   ├── data/
│   │   └── knowledgeBase.json      # Structured multi-subject dataset across 12 disciplines
│   ├── routes/                     # Auth, User, Course, Assessment, Study Plan, Skill, AI, Ollama routes
│   └── services/
│       ├── googleSheetsService.js  # Dual-mode Google Sheets + Memory DB provider
│       ├── aiService.js            # Single-subject study plan generator & teacher copilot
│       └── ollamaService.js        # Local Ollama API client & status checker
├── package.json
└── README.md
```

---

## 📊 Google Sheets Database Setup (`SKILLNEX_DATABASE`)

Create one spreadsheet named **SKILLNEX_DATABASE** with these tab names and headers:

1. **Users**: `user_id, name, email, password, role, city, department, year, xp, level, streak, created_at`
2. **Courses**: `course_id, course_name, subject, description, difficulty, duration, status, created_at`
3. **Learning_Progress**: `progress_id, user_id, course_id, topic, completion, score, time_spent, status, last_activity`
4. **Assessments**: `assessment_id, title, subject, topic, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, question_type, created_by, created_at`
5. **Assessment_Results**: `result_id, assessment_id, user_id, score, total_questions, percentage, weak_topic, completed_at`
6. **Study_Plans**: `plan_id, user_id, goal, day, topic, activity, duration, priority, status, created_at`
7. **Skills**: `skill_id, user_id, skill_name, score, level, trend, ai_recommendation, updated_at`

### Google Apps Script Deployment:
1. Open **Extensions ➔ Apps Script** in your Google Spreadsheet.
2. Paste the contents of [`backend/GoogleAppsScript.gs`](file:///e:/IQOO/backend/GoogleAppsScript.gs).
3. Click **Deploy ➔ New deployment** as **Web app** (Access: *Anyone*).
4. Copy the Web App URL into `backend/.env` and `frontend/js/config.js`.

---

## ⚡ Local Setup & Execution

### 1. Start SKILLNEX Backend & Application
```bash
# Navigate to project directory
cd e:/IQOO

# Install dependencies (if first time)
npm install

# Start Express backend server
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your web browser.

### 2. Connect Ollama (Optional Local LLM)
```bash
# Start Ollama service
ollama serve

# Pull and run your preferred model
ollama run qwen2.5:3b-instruct
# or
ollama run llama3
```
Open **[http://localhost:3000/ollama-ai.html](http://localhost:3000/ollama-ai.html)** to chat with local Ollama models.

---

## 🔑 Demo Credentials

- **Student**: `arun@skillnex.edu` / `password123` (Level 18, 4820 XP)
- **Teacher**: `teacher@skillnex.edu` / `password123` (Faculty, Computer Science)
- **Admin**: `admin@skillnex.edu` / `password123` (Institution Admin)

---

## 🎬 Complete User Learning Workflow

```text
Student Login
     ↓
Dashboard (Student Name • Overall Skill Score • Active Courses • Best Performing Subject)
     ↓
Study Planner ("Which subject do you find difficult to study?")
     ↓
Select Subject (e.g. Mathematics)
     ↓
Mathematics 5-Day Study Plan
     ↓
Mathematics Assessment (5 Questions)
     ↓
Calculate Correct Answers
     ↓
Exact Skill Score Formula: (Correct / Total) × 100
     ↓
Skill Level Assignment (90-100: Excellent, 75-89: Good, 50-74: Intermediate, <50: Needs Improvement)
     ↓
Subject Skill Profile Updated
     ↓
Dashboard Automatically Highlights Best Performing Subject
```
