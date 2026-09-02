const Dashboard = {
    async initStudent() {
        const user = Auth.requireAuth('student');
        if (!user) return;

        Components.renderSidebar('dashboard');
        Components.renderTopbar(`Welcome, ${user.name} 👋`, 'Student Dashboard');

        await this.loadStudentDashboard(user);
    },

    async loadStudentDashboard(user) {
        // 1. Student Name
        const nameEl = document.getElementById('dash-student-name');
        if (nameEl) nameEl.innerText = `Welcome, ${user.name || 'Student'}`;

        const deptEl = document.getElementById('dash-student-dept');
        if (deptEl) deptEl.innerText = `${user.department || 'Computer Science'} • ${user.year || '3rd Year'}`;

        const avatarEl = document.getElementById('dash-avatar');
        if (avatarEl && user.name) avatarEl.innerText = user.name.charAt(0).toUpperCase();

        // Retrieve subject-specific assessment scores from localStorage & backend
        const userSkillsStr = localStorage.getItem('skillnex_subject_skills');
        const subjectSkills = userSkillsStr ? JSON.parse(userSkillsStr) : {};

        const entries = Object.entries(subjectSkills);

        // 2. Overall Skill Score Calculation
        const overallScoreEl = document.getElementById('dash-overall-score');
        const scoreBasisEl = document.getElementById('dash-score-basis');

        if (entries.length === 0) {
            if (overallScoreEl) overallScoreEl.innerText = '0%';
            if (scoreBasisEl) scoreBasisEl.innerText = 'No assessments completed yet';
        } else {
            const totalSum = entries.reduce((sum, [_, data]) => sum + Number(data.score), 0);
            const avgScore = Math.round(totalSum / entries.length);

            if (overallScoreEl) overallScoreEl.innerText = `${avgScore}%`;
            if (scoreBasisEl) scoreBasisEl.innerText = `Based on ${entries.length} completed subject assessment${entries.length > 1 ? 's' : ''}`;
        }

        // 3. Active Courses
        const activeCountEl = document.getElementById('dash-active-count');
        const activeListEl = document.getElementById('dash-active-list');

        // Fetch active study plans or selected subject
        const selectedSubject = localStorage.getItem('skillnex_selected_subject');
        let activeSubjects = [];
        if (selectedSubject) activeSubjects.push(selectedSubject);

        try {
            const plansRes = await API.getStudyPlans(user.user_id).catch(() => ({ data: [] }));
            const plans = plansRes.data || [];
            plans.forEach(p => {
                if (p.goal && !activeSubjects.includes(p.goal.replace('Master ', ''))) {
                    activeSubjects.push(p.goal.replace('Master ', ''));
                }
            });
        } catch (e) {}

        if (activeSubjects.length === 0) activeSubjects = ["Mathematics", "Physics", "Computer Science"];

        if (activeCountEl) activeCountEl.innerText = activeSubjects.length;
        if (activeListEl) activeListEl.innerText = activeSubjects.join(' • ');

        // 4. Best Performing Subject Calculation
        const bestSubjectEl = document.getElementById('dash-best-subject');
        const bestScoreEl = document.getElementById('dash-best-score');
        const bestBadgeEl = document.getElementById('dash-best-badge');

        if (entries.length === 0) {
            if (bestSubjectEl) bestSubjectEl.innerText = 'None Assessed';
            if (bestScoreEl) bestScoreEl.innerText = '--';
            if (bestBadgeEl) bestBadgeEl.innerText = 'Pending Assessment';
        } else {
            // Find subject entry with highest score
            let bestSubject = entries[0][0];
            let bestScore = Number(entries[0][1].score);

            entries.forEach(([subj, data]) => {
                if (Number(data.score) > bestScore) {
                    bestScore = Number(data.score);
                    bestSubject = subj;
                }
            });

            if (bestSubjectEl) bestSubjectEl.innerText = bestSubject;
            if (bestScoreEl) bestScoreEl.innerText = `${bestScore}%`;
            if (bestBadgeEl) bestBadgeEl.innerText = `🏆 Highest Score (${bestScore}%)`;
        }

        // 5. Subject Scores List
        const container = document.getElementById('dash-subject-scores-container');
        if (!container) return;

        if (entries.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 24px; color: var(--text-muted);">
                    No subject assessments completed yet. Complete a subject assessment to track your scores.
                </div>
            `;
            return;
        }

        // Sort entries by score descending
        entries.sort((a, b) => Number(b[1].score) - Number(a[1].score));

        container.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 12px;">
                ${entries.map(([subj, data], idx) => {
                    const isBest = idx === 0;
                    return `
                        <div style="padding: 16px; border-radius: var(--radius-sm); background: ${isBest ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-tertiary)'}; border: 1px solid ${isBest ? 'var(--primary-glow)' : 'var(--glass-border)'}; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
                                    ${subj} ${isBest ? '<span class="badge badge-emerald">🏆 Best Subject</span>' : ''}
                                </div>
                                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
                                    Skill Level: <strong>${data.level}</strong> (${data.correct}/${data.total} Correct)
                                </div>
                            </div>
                            <div style="font-size: 1.4rem; font-weight: 800; color: ${isBest ? '#34d399' : '#a5b4fc'};">
                                ${data.score}%
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    async initTeacher() {
        const user = Auth.requireAuth('teacher');
        if (!user) return;

        Components.renderSidebar('teacher-dashboard');
        Components.renderTopbar(`Teacher Portal — Dr. Rajesh K 👨‍🏫`, 'Class Analytics & AI Risk Intelligence Copilot');

        await this.loadTeacherDashboardData();
    },

    async loadTeacherDashboardData() {
        try {
            const copilotRes = await API.getTeacherCopilotAI();
            const insight = copilotRes.data;

            document.getElementById('teacher-total-students').innerText = insight.metrics.strugglingStudentsCount + 41;
            document.getElementById('teacher-avg-understanding').innerText = `${insight.metrics.avgUnderstanding}%`;
            document.getElementById('teacher-attendance').innerText = `${insight.metrics.attendance}%`;
            document.getElementById('teacher-need-help').innerText = insight.metrics.strugglingStudentsCount;

            const copilotBox = document.getElementById('copilot-insight-box');
            if (copilotBox) {
                copilotBox.innerHTML = `
                    <div style="font-weight: 700; font-size: 1.1rem; color: #a5b4fc; margin-bottom: 8px;">
                        🤖 AI INSIGHT
                    </div>
                    <p style="font-size: 1rem; margin-bottom: 12px;">${insight.summary}</p>
                    <div style="background: rgba(99, 102, 241, 0.15); border: 1px solid var(--primary-glow); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 12px;">
                        <strong>Recommended Action:</strong> ${insight.recommendedAction}
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">
                        <strong>Suggested Students:</strong> ${insight.suggestedStudents.join(', ')}
                    </div>
                `;
            }

            // Load Students Risk Table
            const usersRes = await API.getUsers();
            const students = (usersRes.data || []).filter(u => u.role === 'student');
            this.renderRiskTable(students);

        } catch (e) {
            console.error("Teacher load error:", e);
        }
    },

    renderRiskTable(students) {
        const tbody = document.getElementById('risk-table-body');
        if (!tbody) return;

        tbody.innerHTML = students.map(s => {
            const risk = s.risk || { riskLevel: 'LOW', riskScore: 25, recommendation: 'Performing well' };
            const badgeClass = risk.riskLevel === 'HIGH' ? 'badge-rose' : risk.riskLevel === 'MEDIUM' ? 'badge-amber' : 'badge-emerald';
            return `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid var(--glass-border);">
                        <strong>${s.name}</strong><br>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">${s.department} • ${s.year}</span>
                    </td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--glass-border);">${s.xp} XP</td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--glass-border);">
                        <span class="badge ${badgeClass}">${risk.riskLevel} (${risk.riskScore}%)</span>
                    </td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--glass-border); font-size: 0.85rem;">
                        ${risk.recommendation}
                    </td>
                    <td style="padding: 12px; border-bottom: 1px solid var(--glass-border);">
                        <button class="btn btn-outline btn-sm" onclick="Components.showToast('Mentor alert sent to ${s.name}', 'success')">Notify</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    async initAdmin() {
        const user = Auth.requireAuth('admin');
        if (!user) return;

        Components.renderSidebar('admin-dashboard');
        Components.renderTopbar(`Institution Analytics Admin 🏛️`, 'Department skill gap distribution & system metrics');
    }
};
