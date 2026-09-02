const Auth = {
    getUser() {
        const userStr = localStorage.getItem('skillnex_user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    },

    setUser(user) {
        localStorage.setItem('skillnex_user', JSON.stringify(user));
    },

    logout() {
        localStorage.removeItem('skillnex_user');
        if (typeof Components !== 'undefined' && Components.showToast) {
            Components.showToast('Logged out successfully', 'info');
        }
        window.location.href = 'login.html';
    },

    requireAuth(requiredRole = null) {
        const user = this.getUser();
        if (!user) {
            window.location.href = 'login.html';
            return null;
        }

        if (requiredRole && user.role !== requiredRole) {
            // Redirect to appropriate dashboard based on actual role
            if (user.role === 'student') window.location.href = 'student-dashboard.html';
            else if (user.role === 'teacher') window.location.href = 'teacher-dashboard.html';
            else if (user.role === 'admin') window.location.href = 'admin-dashboard.html';
            return null;
        }
        return user;
    },

    // Seed default student session if none exists for quick evaluation preview
    initDefaultSession() {
        if (!this.getUser()) {
            this.setUser({
                user_id: "USR-101",
                name: "Arun Kumar",
                email: "arun@skillnex.edu",
                role: "student",
                city: "Coimbatore",
                department: "Computer Science",
                year: "3rd Year",
                xp: 4820,
                level: 18,
                streak: 12
            });
        }
    }
};
