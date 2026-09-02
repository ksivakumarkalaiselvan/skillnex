const Planner = {
    subjectTemplates: {
        "Mathematics": [
            { day: "Day 1", topic: "Algebra & Linear Equations", activity: "Solve 2x + 5 = 15 & foundational algebraic simplification", duration: "45 min", priority: "High" },
            { day: "Day 2", topic: "Quadratic Equations & Polynomials", activity: "Practice factoring & quadratic formula problems", duration: "50 min", priority: "High" },
            { day: "Day 3", topic: "Trigonometric Ratios", activity: "Master sin, cos, tan values (90°, 45°, 30°) and identities", duration: "45 min", priority: "High" },
            { day: "Day 4", topic: "Calculus & Differentiation", activity: "Learn power rule d/dx(xⁿ) = n·xⁿ⁻¹ with worked examples", duration: "60 min", priority: "Medium" },
            { day: "Day 5", topic: "Comprehensive Problem Solving & Mock", activity: "Solve 10 mixed Mathematics practice problems", duration: "40 min", priority: "High" }
        ],
        "Physics": [
            { day: "Day 1", topic: "Dynamics & Force Units", activity: "Understand Newton (N), F = m·a, and motion laws", duration: "45 min", priority: "High" },
            { day: "Day 2", topic: "Electrical Circuits & Ohm's Law", activity: "Master V = I · R relationships and resistor calculations", duration: "50 min", priority: "High" },
            { day: "Day 3", topic: "Kirchhoff Current & Voltage Laws", activity: "Analyze node currents (KCL) and loop voltages (KVL)", duration: "60 min", priority: "High" },
            { day: "Day 4", topic: "Electromagnetism & Waves", activity: "Review magnetic fields, induction, and wave properties", duration: "45 min", priority: "Medium" },
            { day: "Day 5", topic: "Physics Problem Solving", activity: "Solve 10 targeted numerical Physics questions", duration: "40 min", priority: "High" }
        ],
        "Chemistry": [
            { day: "Day 1", topic: "Atomic Structure & Periodic Table", activity: "Review elements, atomic numbers (Carbon=6), and electron shell configurations", duration: "45 min", priority: "High" },
            { day: "Day 2", topic: "Chemical Bonding & Valency", activity: "Master covalent vs ionic bonds and formula writing", duration: "50 min", priority: "High" },
            { day: "Day 3", topic: "Stoichiometry & Chemical Equations", activity: "Balance chemical equations and mole calculations", duration: "60 min", priority: "High" },
            { day: "Day 4", topic: "Acids, Bases & pH Scale", activity: "Understand pH scale, neutralisation reactions, and indicators", duration: "45 min", priority: "Medium" },
            { day: "Day 5", topic: "Chemistry Review & Practice", activity: "Solve 10 conceptual Chemistry questions", duration: "40 min", priority: "High" }
        ],
        "Computer Science": [
            { day: "Day 1", topic: "Data Structures & Trees", activity: "Study Binary Search Trees (BST) properties and structure", duration: "45 min", priority: "High" },
            { day: "Day 2", topic: "Tree Traversal Methods", activity: "Master In-order, Pre-order, and Post-order traversals", duration: "50 min", priority: "High" },
            { day: "Day 3", topic: "Operating Systems & Deadlocks", activity: "Study 4 deadlock conditions (Mutual Exclusion, Hold & Wait, etc.)", duration: "50 min", priority: "High" },
            { day: "Day 4", topic: "Database Queries & Normalization", activity: "Practice SQL SELECT queries and relational schema design", duration: "60 min", priority: "Medium" },
            { day: "Day 5", topic: "Computer Science Revision", activity: "Solve 10 algorithm and DS concept questions", duration: "40 min", priority: "High" }
        ],
        "Programming": [
            { day: "Day 1", topic: "Variables & Data Types", activity: "Learn variable memory allocation in C, C++, and Python", duration: "45 min", priority: "High" },
            { day: "Day 2", topic: "Control Statements & Conditionals", activity: "Code largest-number programs using if-else logic", duration: "50 min", priority: "High" },
            { day: "Day 3", topic: "Functions & Recursion", activity: "Implement recursive factorial & Fibonacci programs", duration: "60 min", priority: "High" },
            { day: "Day 4", topic: "Object-Oriented Programming", activity: "Study Classes, Objects, Inheritance, and Encapsulation", duration: "50 min", priority: "Medium" },
            { day: "Day 5", topic: "Code Execution & Debugging", activity: "Write and test 5 working programs", duration: "40 min", priority: "High" }
        ],
        "English": [
            { day: "Day 1", topic: "Parts of Speech & Adverbs", activity: "Identify and use adverbs, adjectives, and verbs correctly", duration: "40 min", priority: "High" },
            { day: "Day 2", topic: "Tenses & Sentence Structure", activity: "Master past, present, and future perfect tenses", duration: "45 min", priority: "High" },
            { day: "Day 3", topic: "Vocabulary Building", activity: "Learn 20 new academic vocabulary terms and synonyms", duration: "45 min", priority: "Medium" },
            { day: "Day 4", topic: "Comprehension Skills", activity: "Practice reading passages and main-idea extraction", duration: "50 min", priority: "High" },
            { day: "Day 5", topic: "Grammar & Writing Practice", activity: "Complete 10 grammar correction exercises", duration: "40 min", priority: "High" }
        ],
        "Electronics": [
            { day: "Day 1", topic: "Digital Electronics & Logic Gates", activity: "Master AND, OR, NOT, NAND, NOR truth tables", duration: "45 min", priority: "High" },
            { day: "Day 2", topic: "Boolean Algebra & Simplification", activity: "Simplify logic expressions using De Morgan's laws", duration: "50 min", priority: "High" },
            { day: "Day 3", topic: "Resistors & DC Circuit Analysis", activity: "Calculate equivalent resistance in series and parallel", duration: "50 min", priority: "High" },
            { day: "Day 4", topic: "Microprocessors & Registers", activity: "Study accumulator, instruction pointer, and bus architecture", duration: "60 min", priority: "Medium" },
            { day: "Day 5", topic: "Electronics Review & Practice", activity: "Solve 10 digital circuit questions", duration: "40 min", priority: "High" }
        ]
    },

    init() {
        const user = Auth.requireAuth('student');
        if (!user) return;

        Components.renderSidebar('planner');
        Components.renderTopbar('Subject Study Planner 📅', 'Select the single subject you find difficult to generate your plan');

        // Check if subject was already selected
        const savedSubject = localStorage.getItem('skillnex_selected_subject');
        if (savedSubject) {
            const selectEl = document.getElementById('difficult-subject-select');
            if (selectEl) selectEl.value = savedSubject;
            this.renderPlanForSubject(savedSubject);
        }
    },

    generateSubjectPlan() {
        const selectEl = document.getElementById('difficult-subject-select');
        if (!selectEl) return;
        const selectedSubject = selectEl.value;

        // Save selected subject locally
        localStorage.setItem('skillnex_selected_subject', selectedSubject);

        Components.showToast(`Generated study plan for ${selectedSubject}`, 'success');
        this.renderPlanForSubject(selectedSubject);
    },

    renderPlanForSubject(subject) {
        const container = document.getElementById('subject-plan-container');
        if (!container) return;

        const planItems = this.subjectTemplates[subject] || this.subjectTemplates["Mathematics"];

        let html = `
            <div class="glass-card" style="padding: 28px; margin-bottom: 24px; border-left: 4px solid var(--primary);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div>
                        <span class="badge badge-indigo">Single Subject Target</span>
                        <h3 style="font-size: 1.5rem; margin-top: 4px;">5-Day Study Plan for ${subject}</h3>
                    </div>
                    <a href="assessments.html" class="btn btn-primary" onclick="localStorage.setItem('skillnex_selected_subject', '${subject}')">
                        Take ${subject} Assessment →
                    </a>
                </div>
                <p style="font-size: 0.9rem; color: var(--text-muted);">
                    This plan is strictly focused on <strong>${subject}</strong>. Complete the days below and test your knowledge in the assessment.
                </p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 16px;">
        `;

        planItems.forEach((item, idx) => {
            html += `
                <div class="glass-card" style="padding: 20px; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                            <span class="badge badge-purple">${item.day}</span>
                            <span class="badge ${item.priority === 'High' ? 'badge-rose' : 'badge-amber'}">${item.priority} Priority</span>
                            <span style="font-size: 0.8rem; color: var(--text-muted);">⏱ ${item.duration}</span>
                        </div>
                        <h4 style="font-size: 1.1rem; margin-bottom: 4px;">${item.topic}</h4>
                        <p style="font-size: 0.9rem; color: var(--text-muted);">${item.activity}</p>
                    </div>
                    <div>
                        <button class="btn btn-secondary btn-sm" onclick="Components.showToast('Day ${idx + 1} marked complete!', 'success')">
                            Mark Complete
                        </button>
                    </div>
                </div>
            `;
        });

        html += `
            </div>
            <div style="margin-top: 28px; text-align: center;">
                <a href="assessments.html" class="btn btn-primary btn-lg" onclick="localStorage.setItem('skillnex_selected_subject', '${subject}')">
                    Proceed to ${subject} Assessment →
                </a>
            </div>
        `;

        container.innerHTML = html;
    }
};
