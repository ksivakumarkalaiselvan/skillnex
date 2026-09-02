const Skills = {
    async init() {
        const user = Auth.requireAuth('student');
        if (!user) return;

        Components.renderSidebar('skills');
        Components.renderTopbar('Skills Intelligence Dashboard ⚡', 'Subject-specific skill scores calculated directly from your assessment performance');

        this.loadAssessedSubjectSkills();
    },

    loadAssessedSubjectSkills() {
        const container = document.getElementById('skills-grid-container');
        if (!container) return;

        // Retrieve subject skills calculated from actual assessment submissions
        const userSkillsStr = localStorage.getItem('skillnex_subject_skills');
        const subjectSkills = userSkillsStr ? JSON.parse(userSkillsStr) : null;

        if (!subjectSkills || Object.keys(subjectSkills).length === 0) {
            container.innerHTML = `
                <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 48px;">
                    <div style="font-size: 3rem; margin-bottom: 12px;">📊</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 8px;">No Assessed Subjects Yet</h3>
                    <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 24px;">
                        Complete a subject study plan and assessment to generate your calculated Subject Skill Score.
                    </p>
                    <a href="study-planner.html" class="btn btn-primary btn-lg">Open Study Planner →</a>
                </div>
            `;
            return;
        }

        const entries = Object.entries(subjectSkills);

        container.innerHTML = entries.map(([subjectName, data]) => {
            const score = data.score;
            const level = data.level;
            const colorClass = score >= 90 ? 'var(--accent-emerald)' : score >= 75 ? 'var(--primary)' : score >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)';
            const badgeClass = score >= 90 ? 'badge-emerald' : score >= 75 ? 'badge-indigo' : score >= 50 ? 'badge-amber' : 'badge-rose';

            return `
                <div class="glass-card" style="padding: 24px; border-top: 4px solid ${colorClass};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h3 style="font-size: 1.3rem;">${subjectName}</h3>
                        <span class="badge ${badgeClass}">${level}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 6px;">
                        <span>Calculated Skill Score</span>
                        <span style="color: ${colorClass}; font-size: 1.3rem;">${score}%</span>
                    </div>
                    <div class="progress-bar-bg" style="margin-bottom: 16px;">
                        <div class="progress-bar-fill" style="width: ${score}%; background: ${colorClass};"></div>
                    </div>
                    <div style="background: var(--bg-tertiary); padding: 12px; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--text-muted); border: 1px solid var(--glass-border);">
                        <strong>Assessment Record:</strong> ${data.correct} / ${data.total} Correct Answers (${data.updated_at})
                    </div>
                </div>
            `;
        }).join('');
    }
};
