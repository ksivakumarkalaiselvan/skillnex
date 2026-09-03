# 🚀 SKILLNEX — AI-Powered Smart Education Platform & Progressive Web App (PWA)

**Tagline:** *“Learn Better. Grow Smarter.”*

SKILLNEX is an AI-powered Smart Education ecosystem that transforms traditional learning into an intelligent, personalized, measurable experience. The platform combines a **Downloadable PWA via Notifications**, **Student-Driven Study Planner**, **Subject-Specific Adaptive Assessments**, **Data-Driven Skill Measurement**, **Local Ollama AI Integration**, **AI Teacher Copilot Intelligence**, and **Google Sheets Database Architecture**.

---

## 🌟 Key Modules & Features

### 📲 1. Downloadable PWA via Notification System
- **Notification-Driven Installation**: Users receive/trigger native OS push and local notifications (`📲 Download & Install SKILLNEX App`) that allow instant 1-click PWA installation directly to your Desktop or Mobile Home Screen.
- **Offline Caching Engine**: Powered by Service Worker (`sw.js`) with **Stale-While-Revalidate** caching for static assets and **Network-First** strategy for API endpoints.
- **Glassmorphic PWA Controls**: Floating `📲 Download App` badge with live pulsing status indicators, topbar install triggers, and non-intrusive install banners.
- **Multi-Platform Manifest**: Includes full `manifest.json` with dark mode branding palette (`#0f172a`, `#6366f1`), multi-resolution icons (192x192, 512x512, maskable icons, apple touch icons), and shortcuts to key dashboards.

### 📊 2. Minimalist Data-Driven Student Dashboard
The student dashboard displays strictly 4 core metrics:
- **Student Name**: Displays the logged-in student's name dynamically from their profile (e.g., `Welcome, Sivakumar`).
- **Overall Skill Score**: Calculated average across all completed subject assessments:
  $$\text{Overall Score} = \frac{\sum \text{Assessed Subject Scores}}{\text{Total Assessed Subjects}}$$
- **Active Courses**: Count & list of active subjects with current study plans (e.g., `3` — `Mathematics • Physics • Computer Science`).
- **Best Performing Subject (Automatically Highlighted)**: Evaluates all completed subject assessment scores and dynamically highlights the top subject (e.g., **🏆 Best Performing Subject: Physics — 88%** or **Mathematics — 95%**).

### 📅 3. Single-Subject Student-Driven Study Planner
- **Workflow**: Asks *"Which subject do you find difficult to study?"*.
- **Targeted Plan**: Generates a 5-day study plan **ONLY for the selected subject** (e.g., Mathematics, Physics, Chemistry, Computer Science, Programming, English, Electronics).
- **Direct Link**: Includes a direct button *"Take [Subject] Assessment ➔"* leading into the subject-specific assessment.

### 📝 4. Subject-Specific Assessments
- **Isolated Tests**: Renders questions **strictly for the requested subject**. Never mixes unrelated subjects.
- **Calculated Skill Score Formula**:
  $$\text{Skill Score} = \left(\frac{\text{Correct Answers}}{\text{Total Questions}}\right) \times 100$$
- **Calculated Skill Level Thresholds**:
  - `90–100`: **Excellent**
  - `75–89`: **Good**
  - `50–74`: **Intermediate**
  - `Below 50`: **Needs Improvement**

### ⚡ 5. Subject-Wise Skill Profile
- Displays skill scores and levels **only for subjects that have been assessed**.
- Shows exact scores, correct answer counts, and skill levels derived strictly from assessment performance.

### 🦙 6. Ollama Local AI Workspace (`http://localhost:11434`)
- Connects directly to local Ollama instances (`ollama serve`).
- Auto-detects local models (e.g., `qwen2.5:3b-instruct`, `llama3`, `mistral`, `gemma`).
- Provides private, offline LLM inference for coding, explanations, and logic.

### 👨‍🏫 7. Teacher Dashboard & AI Copilot
- **Class Analytics**: Total students, average understanding, and attendance rates.
- **Student Risk Matrix**: Early warning system flagging High, Medium, and Low risk students for mentor intervention.

### 🏛️ 8. Institution Admin Dashboard
- **Course Completion Rates**: Real-time progress bars per course module.
- **Department Skill Gaps**: Highlights specific weak topics per department.

---

## 🌐 Live Deployment & Vercel Links

- **Frontend Deployment (Vercel)**: [https://skillnex.vercel.app](https://skillnex.vercel.app)
- **Backend REST API (Render)**: `https://skillnex-xly4.onrender.com/api`
- **GitHub Repository**: [https://github.com/ksivakumarkalaiselvan/skillnex.git](https://github.com/ksivakumarkalaiselvan/skillnex.git)

---

## 🛠️ Technology Stack

- **PWA Infrastructure**: Web App Manifest (`manifest.json`), Service Worker (`sw.js`), Web Push / Local Notifications, Native App Install Prompts.
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
│   ├── manifest.json               # PWA Web App Manifest file
│   ├── sw.js                       # Service Worker (Asset Caching & Push Notifications)
│   ├── index.html                  # Landing Page & PWA Install Controls
│   ├── login.html                  # 1-Click Role Login (Student, Teacher, Admin)
│   ├── register.html               # Registration with Department selection
│   ├── student-dashboard.html      # Minimalist Student Hub (Name, Score, Best Subject)
│   ├── teacher-dashboard.html      # AI Teacher Copilot & Risk Warning Matrix
│   ├── admin-dashboard.html        # Institution & Department Analytics
│   ├── study-planner.html          # Single-Subject Difficult Study Planner
│   ├── assessments.html            # Subject-Specific Assessment Engine
│   ├── skills.html                 # Subject-Wise Skill Intelligence Dashboard
│   ├── courses.html                # My Courses Catalog
│   ├── ollama-ai.html              # Local Ollama AI Workspace
│   ├── icons/                      # PWA Icon Assets (192, 512, maskable, badge, svg)
│   ├── css/
│   │   ├── style.css               # Design tokens & glassmorphism
│   │   ├── landing.css             # Hero graphics & landing grid
│   │   ├── dashboard.css           # Sidebar layout & stat cards
│   │   ├── components.css          # Modals, Toasts, & Progress bars
│   │   ├── pwa.css                 # PWA install banner, toasts & floating badges
│   │   └── responsive.css          # Desktop, Tablet & Mobile adaptors
│   └── js/
│       ├── config.js               # API_URL & app settings
│       ├── api.js                  # Fetch wrapper & API client
│       ├── auth.js                 # Session guard & role routing
│       ├── components.js           # Header, Sidebar, Toasts & Modals
│       ├── pwa-installer.js        # Notification-driven PWA Install Manager
│       ├── dashboard.js            # Minimalist dashboard logic
│       ├── planner.js              # Single-subject planner controller
│       ├── assessment.js           # Subject-specific quiz engine
│       ├── skills.js               # Subject skill profile controller
│       ├── courses.js              # Course catalog controller
│       └── ollama.js               # Ollama local AI UI controller
│
├── backend/
│   ├── server.js                   # Express REST API & PWA Header Server
│   ├── .env                        # PORT, GOOGLE_SHEETS_API_URL, USE_DEMO_DATA
│   ├── GoogleAppsScript.gs         # 1-Click Google Sheets Web App API Script
│   ├── data/
│   │   └── knowledgeBase.json      # Multi-subject dataset across 12 disciplines
│   ├── routes/                     # Auth, User, Course, Assessment, Skill, AI, Ollama routes
│   └── services/
│       ├── googleSheetsService.js  # Dual-mode Google Sheets + Memory DB provider
│       ├── aiService.js            # Study plan generator & teacher copilot
│       └── ollamaService.js        # Local Ollama API client
├── scripts/
│   └── generate-icons.js           # PWA icon PNG & SVG generator script
├── vercel.json                     # Vercel deployment & PWA routing headers
├── package.json
└── README.md
```

---

## ⚡ Local Setup & Execution

### 1. Start SKILLNEX Backend & PWA Server
```bash
# Navigate to project directory
cd e:/IQOO

# Install dependencies (if first time)
npm install

# Start Express backend server
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your web browser.

### 2. Downloading SKILLNEX PWA via Notification
1. Open **[http://localhost:3000](http://localhost:3000)** in Chrome, Edge, or Safari.
2. Click **"📲 Install App"** in the topbar or the floating **"📲 Download App"** badge in the bottom-right corner.
3. Allow notification permissions when prompted.
4. Click the system notification alert **"📲 Download & Install SKILLNEX App"** to install SKILLNEX directly to your desktop or mobile home screen!

---

## 🔑 Demo Credentials

- **Student**: `arun@skillnex.edu` / `password123` (Level 18, 4820 XP)
- **Teacher**: `teacher@skillnex.edu` / `password123` (Faculty, Computer Science)
- **Admin**: `admin@skillnex.edu` / `password123` (Institution Admin)

---

## 🎬 Complete User & PWA Workflow

```text
User Opens Web Application
     ↓
Click "📲 Install App via Notification"
     ↓
Browser Requests Notification Permission
     ↓
System Notification Dispatched: "📲 Download & Install SKILLNEX App"
     ↓
User Clicks Notification Action "⚡ Install PWA Now"
     ↓
Browser Native Install Prompt Triggered -> App Installed to Home Screen / Desktop
     ↓
Offline Mode Activated (Service Worker Pre-caches Static Assets & Data)
```
