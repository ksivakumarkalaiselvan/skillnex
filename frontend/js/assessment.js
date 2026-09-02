const Assessment = {
    subjectQuestions: {
        "Mathematics": [
            { id: 1, topic: "Algebra", question: "Solve for x: 2x + 5 = 15", options: ["A) x = 3", "B) x = 5", "C) x = 10", "D) x = 2"], correct: "b" },
            { id: 2, topic: "Trigonometry", question: "What is the value of sin(90°)?", options: ["A) 0", "B) 0.5", "C) 1", "D) Undefined"], correct: "c" },
            { id: 3, topic: "Calculus", question: "What is the derivative of x²?", options: ["A) x", "B) 2x", "C) x²", "D) 2"], correct: "b" },
            { id: 4, topic: "Arithmetic", question: "What is 10 × 5?", options: ["A) 15", "B) 50", "C) 500", "D) 2"], correct: "b" },
            { id: 5, topic: "Arithmetic", question: "What is 2 + 2?", options: ["A) 2", "B) 3", "C) 4", "D) 5"], correct: "c" }
        ],
        "Physics": [
            { id: 1, topic: "Dynamics", question: "What is the SI unit of force?", options: ["A) Joule", "B) Newton (N)", "C) Pascal", "D) Watt"], correct: "b" },
            { id: 2, topic: "Electrical Circuits", question: "Ohm's Law states that Voltage V is equal to:", options: ["A) I / R", "B) I × R", "C) I + R", "D) R / I"], correct: "b" },
            { id: 3, topic: "Kirchhoff Laws", question: "Kirchhoff's Current Law (KCL) is based on conservation of:", options: ["A) Energy", "B) Charge", "C) Mass", "D) Momentum"], correct: "b" },
            { id: 4, topic: "Kinematics", question: "What is acceleration due to gravity on Earth (approx)?", options: ["A) 9.8 m/s²", "B) 5.0 m/s²", "C) 1.6 m/s²", "D) 12.0 m/s²"], correct: "a" },
            { id: 5, topic: "Work & Energy", question: "What is the SI unit of Work?", options: ["A) Newton", "B) Joule (J)", "C) Watt", "D) Volt"], correct: "b" }
        ],
        "Chemistry": [
            { id: 1, topic: "Periodic Table", question: "What is the atomic number of Carbon?", options: ["A) 4", "B) 6", "C) 12", "D) 8"], correct: "b" },
            { id: 2, topic: "Plant Science", question: "Which gas is released by plants during photosynthesis?", options: ["A) Carbon Dioxide", "B) Oxygen (O₂)", "C) Nitrogen", "D) Hydrogen"], correct: "b" },
            { id: 3, topic: "Chemical Bonding", question: "What type of bond is formed by sharing electrons?", options: ["A) Ionic Bond", "B) Covalent Bond", "C) Metallic Bond", "D) Hydrogen Bond"], correct: "b" },
            { id: 4, topic: "Acids & Bases", question: "What is the pH value of pure neutral water?", options: ["A) 0", "B) 7", "C) 14", "D) 1"], correct: "b" },
            { id: 5, topic: "Elements", question: "What is the chemical symbol for Gold?", options: ["A) Go", "B) Au", "C) Ag", "D) Fe"], correct: "b" }
        ],
        "Computer Science": [
            { id: 1, topic: "Data Structures", question: "Which traversal visits the root between left and right subtrees in a BST?", options: ["A) Pre-order", "B) In-order", "C) Post-order", "D) Level-order"], correct: "b" },
            { id: 2, topic: "Operating Systems", question: "Which of the following is NOT a necessary condition for Deadlock?", options: ["A) Mutual Exclusion", "B) Preemption", "C) Circular Wait", "D) Hold and Wait"], correct: "b" },
            { id: 3, topic: "Algorithms", question: "What is the average search time complexity in a Binary Search Tree?", options: ["A) O(1)", "B) O(log n)", "C) O(n)", "D) O(n²)"], correct: "b" },
            { id: 4, topic: "DBMS", question: "Which SQL clause is used to filter records?", options: ["A) GROUP BY", "B) WHERE", "C) ORDER BY", "D) JOIN"], correct: "b" },
            { id: 5, topic: "Networks", question: "Which protocol is used for secure web browsing?", options: ["A) HTTP", "B) HTTPS", "C) FTP", "D) SMTP"], correct: "b" }
        ],
        "Programming": [
            { id: 1, topic: "C Language", question: "What is a variable in C?", options: ["A) A constant value", "B) A named memory location to store a value", "C) A loop statement", "D) A function header"], correct: "b" },
            { id: 2, topic: "Python", question: "Which keyword is used to define a function in Python?", options: ["A) function", "B) def", "C) define", "D) func"], correct: "b" },
            { id: 3, topic: "JavaScript", question: "What is the output of typeof [1, 2, 3] in JavaScript?", options: ["A) array", "B) object", "C) list", "D) undefined"], correct: "b" },
            { id: 4, topic: "SQL", question: "Which SQL statement is used to fetch data from a database?", options: ["A) GET", "B) SELECT", "C) EXTRACT", "D) OPEN"], correct: "b" },
            { id: 5, topic: "C++", question: "Which feature of OOP allows wrapping data and methods into a single unit?", options: ["A) Polymorphism", "B) Encapsulation", "C) Inheritance", "D) Abstraction"], correct: "b" }
        ],
        "English": [
            { id: 1, topic: "Grammar", question: "Which part of speech modifies or describes a verb or adjective?", options: ["A) Noun", "B) Adverb", "C) Pronoun", "D) Preposition"], correct: "b" },
            { id: 2, topic: "Vocabulary", question: "Select the synonym for 'Abundant':", options: ["A) Scarce", "B) Plentiful", "C) Tiny", "D) Empty"], correct: "b" },
            { id: 3, topic: "Grammar", question: "Choose the correct sentence:", options: ["A) She don't like tea.", "B) She doesn't like tea.", "C) She not like tea.", "D) She no like tea."], correct: "b" },
            { id: 4, topic: "Punctuation", question: "Which symbol indicates a direct pause or list item separator?", options: ["A) Period", "B) Comma", "C) Colon", "D) Question mark"], correct: "b" },
            { id: 5, topic: "Tenses", question: "Identfy the tense: 'I have completed my work.'", options: ["A) Simple Past", "B) Present Perfect", "C) Past Continuous", "D) Future Simple"], correct: "b" }
        ],
        "Electronics": [
            { id: 1, topic: "Digital Logic", question: "An AND gate outputs HIGH (1) only when:", options: ["A) Any input is HIGH", "B) All inputs are HIGH", "C) All inputs are LOW", "D) One input is LOW"], correct: "b" },
            { id: 2, topic: "Circuits", question: "What is the equivalent resistance of two 10Ω resistors connected in series?", options: ["A) 5Ω", "B) 20Ω", "C) 100Ω", "D) 10Ω"], correct: "b" },
            { id: 3, topic: "Microprocessors", question: "Which component inside a CPU performs mathematical calculations?", options: ["A) Control Unit", "B) Arithmetic Logic Unit (ALU)", "C) RAM", "D) Bus"], correct: "b" },
            { id: 4, topic: "Logic Gates", question: "Which gate is known as an Inverter?", options: ["A) AND", "B) NOT", "C) OR", "D) XOR"], correct: "b" },
            { id: 5, topic: "Components", question: "Which component stores electrical charge in an electric field?", options: ["A) Resistor", "B) Capacitor", "C) Inductor", "D) Diode"], correct: "b" }
        ]
    },

    currentSubject: 'Mathematics',
    currentQuestions: [],
    currentIndex: 0,
    correctCount: 0,

    init() {
        const user = Auth.requireAuth('student');
        if (!user) return;

        Components.renderSidebar('assessments');
        Components.renderTopbar('Subject Assessment Engine 📝', 'Single-subject focused tests with exact skill score calculation');

        // Check if subject was selected in study planner
        const savedSubject = localStorage.getItem('skillnex_selected_subject') || 'Mathematics';
        this.switchSubject(savedSubject);
    },

    switchSubject(subject) {
        this.currentSubject = subject;
        localStorage.setItem('skillnex_selected_subject', subject);

        const badgeEl = document.getElementById('assessment-subject-badge');
        if (badgeEl) badgeEl.innerText = `${subject} Assessment`;

        const titleEl = document.getElementById('assessment-title');
        if (titleEl) titleEl.innerText = `${subject} Focused Test`;

        const selectEl = document.getElementById('assessment-subject-select');
        if (selectEl) selectEl.value = subject;

        this.currentQuestions = this.subjectQuestions[subject] || this.subjectQuestions["Mathematics"];
        this.resetQuiz();
    },

    resetQuiz() {
        this.currentIndex = 0;
        this.correctCount = 0;

        const activeArea = document.getElementById('quiz-active-area');
        const resultsArea = document.getElementById('quiz-results-area');

        if (activeArea) activeArea.style.display = 'block';
        if (resultsArea) resultsArea.style.display = 'none';

        this.renderQuestion();
    },

    renderQuestion() {
        const q = this.currentQuestions[this.currentIndex];
        if (!q) {
            this.finishQuiz();
            return;
        }

        document.getElementById('q-num').innerText = `Question ${this.currentIndex + 1} of ${this.currentQuestions.length}`;
        document.getElementById('q-topic').innerText = `Topic: ${q.topic}`;
        document.getElementById('q-text').innerText = q.question;

        const optionsBox = document.getElementById('q-options');
        optionsBox.innerHTML = q.options.map(opt => `
            <div class="quiz-option" onclick="Assessment.answerQuestion('${opt.substring(0, 1).toLowerCase()}')">
                ${opt}
            </div>
        `).join('');

        document.getElementById('q-feedback').style.display = 'none';
    },

    answerQuestion(selectedOpt) {
        const q = this.currentQuestions[this.currentIndex];
        const feedbackEl = document.getElementById('q-feedback');
        feedbackEl.style.display = 'block';

        const isCorrect = selectedOpt.toLowerCase() === q.correct.toLowerCase();

        if (isCorrect) {
            this.correctCount++;
            feedbackEl.className = 'badge badge-emerald';
            feedbackEl.style.fontSize = '0.9rem';
            feedbackEl.innerHTML = '✓ Correct Answer!';
        } else {
            feedbackEl.className = 'badge badge-rose';
            feedbackEl.style.fontSize = '0.9rem';
            feedbackEl.innerHTML = `✕ Incorrect. Option ${q.correct.toUpperCase()} was correct.`;
        }

        setTimeout(() => {
            this.currentIndex++;
            this.renderQuestion();
        }, 1200);
    },

    async finishQuiz() {
        const user = Auth.getUser();
        const activeArea = document.getElementById('quiz-active-area');
        const resultsArea = document.getElementById('quiz-results-area');

        if (activeArea) activeArea.style.display = 'none';
        if (resultsArea) resultsArea.style.display = 'block';

        const totalQ = this.currentQuestions.length;
        const correctQ = this.correctCount;

        // Exact Skill Score Formula: (Correct / Total) * 100
        const calculatedScore = Math.round((correctQ / totalQ) * 100);

        // Exact Skill Level Thresholds
        let skillLevel = "Needs Improvement";
        if (calculatedScore >= 90) skillLevel = "Excellent";
        else if (calculatedScore >= 75) skillLevel = "Good";
        else if (calculatedScore >= 50) skillLevel = "Intermediate";

        document.getElementById('res-score-count').innerText = `${correctQ} / ${totalQ}`;
        document.getElementById('res-pct-val').innerText = `${calculatedScore}%`;
        document.getElementById('res-skill-level').innerText = `${skillLevel}`;
        document.getElementById('res-subject-name').innerText = `Subject: ${this.currentSubject}`;

        // Save subject-wise skill score locally for Skills Intelligence Dashboard
        const userSkillsStr = localStorage.getItem('skillnex_subject_skills') || '{}';
        const userSkills = JSON.parse(userSkillsStr);
        userSkills[this.currentSubject] = {
            score: calculatedScore,
            level: skillLevel,
            correct: correctQ,
            total: totalQ,
            updated_at: new Date().toISOString().split('T')[0]
        };
        localStorage.setItem('skillnex_subject_skills', JSON.stringify(userSkills));

        // Submit to backend
        try {
            await API.submitAssessmentResult({
                assessment_id: `ASM-${this.currentSubject.toUpperCase()}`,
                user_id: user.user_id,
                score: correctQ,
                total_questions: totalQ,
                percentage: calculatedScore,
                weak_topic: skillLevel === "Needs Improvement" ? `${this.currentSubject} Concepts` : ""
            });

            Components.showToast(`🎉 ${this.currentSubject} Skill Score: ${calculatedScore}% (${skillLevel})`, 'success');
        } catch (e) {
            console.error("Submit result error:", e);
        }
    }
};
