const Courses = {
    async init() {
        const user = Auth.requireAuth('student');
        if (!user) return;

        Components.renderSidebar('courses');
        Components.renderTopbar('My Learning Courses 📚', 'Master curated curriculum with interactive assistance');

        await this.loadCourses();
    },

    async loadCourses() {
        try {
            const res = await API.getCourses();
            const courses = res.data || [];
            this.renderCoursesGrid(courses);
        } catch (e) {
            console.error("Courses load error:", e);
        }
    },

    renderCoursesGrid(courses) {
        const container = document.getElementById('courses-grid-container');
        if (!container) return;

        container.innerHTML = courses.map((course, idx) => {
            const progress = idx === 0 ? 80 : idx === 1 ? 65 : idx === 2 ? 90 : 40;
            const completedLessons = idx === 0 ? 12 : idx === 1 ? 9 : idx === 2 ? 15 : 6;
            const totalLessons = 15;

            return `
                <div class="glass-card" style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span class="badge badge-indigo">${course.subject}</span>
                            <span class="badge badge-purple">${course.difficulty}</span>
                        </div>
                        <h3 style="font-size: 1.3rem; margin-bottom: 8px;">${course.course_name}</h3>
                        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px;">${course.description}</p>
                    </div>

                    <div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">
                            <span>Progress</span>
                            <span>${progress}% (${completedLessons}/${totalLessons} Lessons)</span>
                        </div>
                        <div class="progress-bar-bg" style="margin-bottom: 20px;">
                            <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                        </div>
                        <a href="assessments.html" class="btn btn-primary btn-sm" style="width: 100%;">Continue Quiz →</a>
                    </div>
                </div>
            `;
        }).join('');
    }
};
