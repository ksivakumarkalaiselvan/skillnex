const API = {
    async request(endpoint, options = {}) {
        const url = `${CONFIG.BACKEND_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        try {
            const response = await fetch(url, { ...options, headers });
            const data = await response.json();
            
            if (!response.ok || !data.success) {
                const errorMsg = data.message || `Request failed with status ${response.status}`;
                if (typeof Components !== 'undefined' && Components.showToast) {
                    Components.showToast(errorMsg, 'error');
                }
                throw new Error(errorMsg);
            }
            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            if (typeof Components !== 'undefined' && Components.showToast) {
                Components.showToast(error.message || 'Unable to connect to server', 'error');
            }
            throw error;
        }
    },

    // Auth APIs
    login: (credentials) => API.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => API.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

    // User APIs
    getUsers: () => API.request('/users'),
    getUser: (id) => API.request(`/users/${id}`),
    updateUser: (id, data) => API.request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    // Course & Progress APIs
    getCourses: () => API.request('/courses'),
    createCourse: (courseData) => API.request('/courses', { method: 'POST', body: JSON.stringify(courseData) }),
    getProgress: (userId) => API.request(`/progress/${userId}`),
    updateProgress: (data) => API.request('/progress', { method: 'POST', body: JSON.stringify(data) }),

    // Assessment APIs
    getAssessments: () => API.request('/assessments'),
    createAssessment: (data) => API.request('/assessments', { method: 'POST', body: JSON.stringify(data) }),
    getAssessmentResults: (userId) => API.request(`/assessments/results/${userId}`),
    submitAssessmentResult: (data) => API.request('/assessments/results', { method: 'POST', body: JSON.stringify(data) }),

    // Study Plan APIs
    getStudyPlans: (userId) => API.request(`/study-plans/${userId}`),
    createStudyPlan: (data) => API.request('/study-plans', { method: 'POST', body: JSON.stringify(data) }),
    updateStudyPlan: (id, data) => API.request(`/study-plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    // Skill APIs
    getSkills: (userId) => API.request(`/skills/${userId}`),
    updateSkill: (id, data) => API.request(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    // AI Service APIs
    generateStudyPlanAI: (payload) => API.request('/ai/study-plan', { method: 'POST', body: JSON.stringify(payload) }),
    getTeacherCopilotAI: () => API.request('/ai/teacher-copilot'),

    // Ollama Local AI APIs
    getOllamaStatus: () => API.request('/ollama/status'),
    askOllama: (prompt, model) => API.request('/ollama/chat', { method: 'POST', body: JSON.stringify({ prompt, model }) })
};
