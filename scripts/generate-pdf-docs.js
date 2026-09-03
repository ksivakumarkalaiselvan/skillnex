const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const docsDir = path.join(__dirname, '../docs');
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
}

const htmlPath = path.join(docsDir, 'SKILLNEX_Technical_Documentation.html');
const pdfPath = path.join(__dirname, '../SKILLNEX_Technical_Documentation.pdf');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SKILLNEX — Full Technical Documentation & Architecture PDF</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;600&display=swap');

        @page {
            size: A4;
            margin: 16mm 16mm 16mm 16mm;
        }

        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #0b0f19;
            color: #f1f5f9;
            margin: 0;
            padding: 0;
            font-size: 10.5pt;
            line-height: 1.6;
        }

        /* Cover & Header Styling */
        .cover-header {
            background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0f172a 100%);
            border: 1px solid rgba(99, 102, 241, 0.4);
            border-radius: 18px;
            padding: 36px 32px;
            margin-bottom: 28px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            position: relative;
            overflow: hidden;
        }

        .cover-header::before {
            content: '';
            position: absolute;
            top: -50px;
            right: -50px;
            width: 220px;
            height: 220px;
            background: radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(0,0,0,0) 70%);
            border-radius: 50%;
        }

        .logo-badge {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1, #06b6d4);
            color: #ffffff;
            font-weight: 800;
            font-size: 0.85rem;
            padding: 4px 14px;
            border-radius: 20px;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 14px;
        }

        .cover-title {
            font-size: 26pt;
            font-weight: 800;
            color: #ffffff;
            margin: 0 0 8px 0;
            letter-spacing: -0.5px;
            line-height: 1.2;
        }

        .cover-subtitle {
            font-size: 13pt;
            color: #38bdf8;
            font-weight: 600;
            margin: 0 0 18px 0;
        }

        .cover-meta-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-top: 20px;
            padding-top: 18px;
            border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .meta-item {
            background: rgba(15, 23, 42, 0.6);
            padding: 10px 14px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .meta-label {
            font-size: 7.5pt;
            color: #94a3b8;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.5px;
        }

        .meta-val {
            font-size: 9.5pt;
            color: #f8fafc;
            font-weight: 700;
            margin-top: 2px;
            word-break: break-all;
        }

        /* Section Containers */
        .section {
            margin-bottom: 26px;
        }

        .section-title {
            font-size: 15pt;
            font-weight: 800;
            color: #f8fafc;
            border-bottom: 2px solid #6366f1;
            padding-bottom: 6px;
            margin-top: 24px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-title span.icon {
            font-size: 16pt;
        }

        h3 {
            font-size: 12pt;
            font-weight: 700;
            color: #38bdf8;
            margin-top: 18px;
            margin-bottom: 10px;
        }

        p {
            margin: 0 0 10px 0;
            color: #cbd5e1;
        }

        /* Card Panels */
        .card {
            background: #151d30;
            border: 1px solid rgba(99, 102, 241, 0.25);
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 14px;
        }

        .card-header {
            font-weight: 700;
            font-size: 11pt;
            color: #a5b4fc;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        /* Formula & Code Boxes */
        .formula-box {
            background: #090d16;
            border-left: 4px solid #38bdf8;
            padding: 12px 16px;
            border-radius: 6px;
            font-family: 'Fira Code', monospace;
            font-size: 9.5pt;
            color: #e0f2fe;
            margin: 12px 0;
        }

        pre, code {
            font-family: 'Fira Code', monospace;
            background: #090d16;
            color: #a5b4fc;
            border-radius: 6px;
        }

        pre {
            padding: 12px 16px;
            font-size: 8.5pt;
            overflow-x: auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin: 12px 0;
            line-height: 1.45;
        }

        code {
            padding: 2px 6px;
            font-size: 9pt;
        }

        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 14px 0;
            font-size: 9pt;
        }

        th {
            background: #1e1b4b;
            color: #a5b4fc;
            text-align: left;
            padding: 10px 12px;
            font-weight: 700;
            border-bottom: 2px solid #4f46e5;
        }

        td {
            padding: 9px 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            color: #cbd5e1;
        }

        tr:nth-child(even) td {
            background: rgba(30, 41, 59, 0.3);
        }

        /* Badges & Highlights */
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 8pt;
            font-weight: 700;
        }

        .badge-indigo { background: rgba(99, 102, 241, 0.2); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.4); }
        .badge-cyan { background: rgba(6, 182, 212, 0.2); color: #38bdf8; border: 1px solid rgba(6, 182, 212, 0.4); }
        .badge-emerald { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
        .badge-amber { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }

        .page-break {
            page-break-before: always;
        }

        .footer-note {
            text-align: center;
            font-size: 8pt;
            color: #64748b;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 12px;
            margin-top: 30px;
        }
    </style>
</head>
<body>

    <!-- Cover Header -->
    <div class="cover-header">
        <span class="logo-badge">SKILLNEX SYSTEM ARCHITECTURE</span>
        <h1 class="cover-title">Full Technical Documentation</h1>
        <div class="cover-subtitle">AI-Powered Smart Education Platform & Progressive Web App (PWA)</div>
        <p style="color: #cbd5e1; max-width: 620px; font-size: 9.5pt;">
            Comprehensive architectural reference, Progressive Web App notification download specification, algorithm definitions, backend REST APIs, and deployment configurations.
        </p>

        <div class="cover-meta-grid">
            <div class="meta-item">
                <div class="meta-label">PWA Production App</div>
                <div class="meta-val">https://skillnex.vercel.app</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">GitHub Repository</div>
                <div class="meta-val">ksivakumarkalaiselvan/skillnex</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Architecture Version</div>
                <div class="meta-val">v2.4.0 (PWA + Notification Engine)</div>
            </div>
        </div>
    </div>

    <!-- Section 1: Executive Overview -->
    <div class="section">
        <div class="section-title"><span class="icon">🌟</span> 1. Executive System Overview</div>
        <p>
            <strong>SKILLNEX</strong> is an AI-powered Smart Education ecosystem designed to deliver dynamic, personalized, and measurable learning experiences. By combining a client-driven progressive web application architecture, local LLM inference engines, subject-isolated assessment metrics, and Google Sheets cloud databases, SKILLNEX eliminates learning friction and accelerates skill acquisition.
        </p>
        
        <div class="card">
            <div class="card-header">
                <span>Core Architectural Pillars</span>
                <span class="badge badge-indigo">Unified Platform</span>
            </div>
            <ul>
                <li><strong>Notification-Driven PWA Installation:</strong> Seamless 1-click app download triggered directly via native browser notifications.</li>
                <li><strong>Data-Driven Student Dashboard:</strong> Focused on 4 deterministic metrics (Student Name, Overall Skill Score, Active Courses, Best Subject).</li>
                <li><strong>Single-Subject AI Study Planner:</strong> Generates targeted 5-day remediation workflows specifically for identified weak subjects.</li>
                <li><strong>Isolated Subject Assessments:</strong> Standardized multi-subject quiz engine with exact score and skill level classification algorithms.</li>
                <li><strong>Local Ollama AI Integration:</strong> Offline, zero-latency LLM workspace supporting local model inference (<code style="color:#38bdf8;">qwen2.5</code>, <code style="color:#38bdf8;">llama3</code>).</li>
                <li><strong>Teacher Copilot & Risk Warning Matrix:</strong> Automated early warning detection for struggling students across classrooms.</li>
            </ul>
        </div>
    </div>

    <!-- Section 2: PWA & Notification Architecture -->
    <div class="section">
        <div class="section-title"><span class="icon">📲</span> 2. Downloadable PWA & Notification System Architecture</div>
        <p>
            SKILLNEX incorporates a modern Progressive Web App (PWA) layer designed to convert the web application into an offline-capable, desktop/mobile downloadable app through an interactive notification flow.
        </p>

        <div class="card">
            <div class="card-header">
                <span>PWA Components & Specification</span>
                <span class="badge badge-cyan">Service Worker v1.0</span>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Component File</th>
                        <th>Path</th>
                        <th>Technical Function</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Web App Manifest</strong></td>
                        <td><code>frontend/manifest.json</code></td>
                        <td>Defines app identity, branding colors (<code>#0f172a</code>, <code>#6366f1</code>), standalone display mode, multi-resolution icons (192x192, 512x512, maskable), and dashboard shortcuts.</td>
                    </tr>
                    <tr>
                        <td><strong>Service Worker</strong></td>
                        <td><code>frontend/sw.js</code></td>
                        <td>Pre-caches static assets, executes Stale-While-Revalidate caching for static files, Network-First strategy for <code>/api/</code> endpoints, and handles <code>push</code> & <code>notificationclick</code> events.</td>
                    </tr>
                    <tr>
                        <td><strong>PWA Installer Manager</strong></td>
                        <td><code>frontend/js/pwa-installer.js</code></td>
                        <td>Captures <code>beforeinstallprompt</code>, dispatches native OS install notifications, controls in-app download badges, and executes <code>deferredPrompt.prompt()</code>.</td>
                    </tr>
                    <tr>
                        <td><strong>PWA Glassmorphism Styles</strong></td>
                        <td><code>frontend/css/pwa.css</code></td>
                        <td>Provides glassmorphism modal styles, notification toasts, floating status badges with live CSS pulsing keyframe animations.</td>
                    </tr>
                    <tr>
                        <td><strong>App Branding Icons</strong></td>
                        <td><code>frontend/icons/</code></td>
                        <td>Generated vector & raster icon assets (<code>icon-192.png</code>, <code>icon-512.png</code>, <code>icon-maskable-512.png</code>, <code>badge-96.png</code>, <code>icon.svg</code>).</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3>Notification-Driven Installation Workflow</h3>
        <pre><code>User Clicks "📲 Install App"
   │
   ├──> Request Notification Permission (Notification.requestPermission())
   │
   ├──> Dispatch System Notification: "📲 Download & Install SKILLNEX App"
   │       Actions: [ ⚡ Install PWA Now ] | [ Later ]
   │
   └──> User Clicks Notification -> Service Worker NotificationClick Handler
           │
           └──> Window Focus -> Execute deferredPrompt.prompt() -> Native PWA Installed!</code></pre>
    </div>

    <div class="page-break"></div>

    <!-- Section 3: Core Algorithms & Formulas -->
    <div class="section">
        <div class="section-title"><span class="icon">📐</span> 3. Core Algorithms, Formulas & Metrics</div>

        <h3>1. Overall Skill Score Calculation Formula</h3>
        <p>Calculates the average performance score across all assessed subjects for the logged-in student:</p>
        <div class="formula-box">
            Overall Skill Score = ( ∑ Assessed Subject Scores ) / ( Total Assessed Subjects )
        </div>

        <h3>2. Subject Assessment Skill Score Formula</h3>
        <p>Evaluates percentage mastery derived strictly from correct answer accuracy:</p>
        <div class="formula-box">
            Skill Score (%) = ( Correct Answers / Total Questions ) × 100
        </div>

        <h3>3. Standardized Skill Level Thresholds</h3>
        <table>
            <thead>
                <tr>
                    <th>Score Range (%)</th>
                    <th>Skill Level Designation</th>
                    <th>Recommended Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><span class="badge badge-emerald">90% – 100%</span></td>
                    <td><strong>Excellent</strong></td>
                    <td>Advanced topics & peer mentoring eligibility.</td>
                </tr>
                <tr>
                    <td><span class="badge badge-cyan">75% – 89%</span></td>
                    <td><strong>Good</strong></td>
                    <td>Consolidation exercises & practice quizzes.</td>
                </tr>
                <tr>
                    <td><span class="badge badge-amber">50% – 74%</span></td>
                    <td><strong>Intermediate</strong></td>
                    <td>5-Day targeted AI study plan revision.</td>
                </tr>
                <tr>
                    <td><span class="badge badge-indigo">Below 50%</span></td>
                    <td><strong>Needs Improvement</strong></td>
                    <td>Teacher copilot risk flag & direct remediation.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Section 4: Database Architecture -->
    <div class="section">
        <div class="section-title"><span class="icon">📊</span> 4. Google Sheets Database Schema (SKILLNEX_DATABASE)</div>
        <p>
            The backend connects to Google Sheets via Google Apps Script Web App API with a dual-mode fallback strategy. If live Google Sheets connection is unavailable, it operates seamlessly in-memory (<code style="color:#34d399;">USE_DEMO_DATA: true</code>).
        </p>

        <table>
            <thead>
                <tr>
                    <th>Sheet Name</th>
                    <th>Header Schema Definitions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Users</strong></td>
                    <td><code>user_id, name, email, password, role, city, department, year, xp, level, streak, created_at</code></td>
                </tr>
                <tr>
                    <td><strong>Courses</strong></td>
                    <td><code>course_id, course_name, subject, description, difficulty, duration, status, created_at</code></td>
                </tr>
                <tr>
                    <td><strong>Learning_Progress</strong></td>
                    <td><code>progress_id, user_id, course_id, topic, completion, score, time_spent, status, last_activity</code></td>
                </tr>
                <tr>
                    <td><strong>Assessments</strong></td>
                    <td><code>assessment_id, title, subject, topic, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, question_type, created_by, created_at</code></td>
                </tr>
                <tr>
                    <td><strong>Assessment_Results</strong></td>
                    <td><code>result_id, assessment_id, user_id, score, total_questions, percentage, weak_topic, completed_at</code></td>
                </tr>
                <tr>
                    <td><strong>Study_Plans</strong></td>
                    <td><code>plan_id, user_id, goal, day, topic, activity, duration, priority, status, created_at</code></td>
                </tr>
                <tr>
                    <td><strong>Skills</strong></td>
                    <td><code>skill_id, user_id, skill_name, score, level, trend, ai_recommendation, updated_at</code></td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Section 5: Complete File Index -->
    <div class="section">
        <div class="section-title"><span class="icon">📂</span> 5. Complete Codebase Directory Index</div>
        <pre><code>SKILLNEX/
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
│   ├── css/ (style.css, landing.css, dashboard.css, components.css, pwa.css, responsive.css)
│   └── js/ (config.js, api.js, auth.js, components.js, pwa-installer.js, dashboard.js, planner.js, assessment.js, skills.js, courses.js, ollama.js)
├── backend/
│   ├── server.js                   # Express REST API & PWA Header Server
│   ├── GoogleAppsScript.gs         # Google Sheets Web App API Script
│   ├── data/knowledgeBase.json      # Knowledge Base Dataset across 12 disciplines
│   └── routes/ & services/         # REST API Routes & Services
├── vercel.json                     # Vercel deployment & PWA headers configuration
└── README.md                       # Comprehensive Technical Documentation</code></pre>
    </div>

    <div class="footer-note">
        SKILLNEX Technical Architecture Document • Generated for SKILLNEX Team • Confidential & Proprietary
    </div>

</body>
</html>`;

fs.writeFileSync(htmlPath, htmlContent);
console.log(`✓ HTML Document generated at: ${htmlPath}`);

// Run Microsoft Edge or Google Chrome Headless to render PDF
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let browserPath = fs.existsSync(edgePath) ? edgePath : (fs.existsSync(chromePath) ? chromePath : null);

if (!browserPath) {
    console.error("❌ Neither Microsoft Edge nor Google Chrome browser executable was found.");
    process.exit(1);
}

console.log(`🖨️ Rendering PDF using headless browser: ${browserPath}`);
const cmd = `"${browserPath}" --headless --disable-gpu --print-to-pdf="${pdfPath}" --no-pdf-header-footer "${htmlPath}"`;

try {
    execSync(cmd);
    console.log(`🎉 PDF generated successfully! Saved at: ${pdfPath}`);
} catch (err) {
    console.error("Error generating PDF:", err);
}
