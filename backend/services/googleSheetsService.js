const dotenv = require('dotenv');
dotenv.config();

const API_URL = process.env.GOOGLE_SHEETS_API_URL;
const USE_DEMO_DATA = process.env.USE_DEMO_DATA !== 'false';

// Memory DB without City Battles
let memoryDB = {
  Users: [
    {
      user_id: "USR-101",
      name: "Arun Kumar",
      email: "arun@skillnex.edu",
      password: "password123",
      role: "student",
      city: "Coimbatore",
      department: "Computer Science",
      year: "3rd Year",
      xp: 4820,
      level: 18,
      streak: 12,
      created_at: "2026-01-15"
    },
    {
      user_id: "USR-102",
      name: "Priya Sharma",
      email: "priya@skillnex.edu",
      password: "password123",
      role: "student",
      city: "Chennai",
      department: "Information Technology",
      year: "2nd Year",
      xp: 5210,
      level: 20,
      streak: 15,
      created_at: "2026-01-18"
    },
    {
      user_id: "USR-103",
      name: "Rahul V",
      email: "rahul@skillnex.edu",
      password: "password123",
      role: "student",
      city: "Madurai",
      department: "Electronics",
      year: "3rd Year",
      xp: 3450,
      level: 14,
      streak: 8,
      created_at: "2026-02-01"
    },
    {
      user_id: "USR-104",
      name: "Karthik R",
      email: "karthik@skillnex.edu",
      password: "password123",
      role: "student",
      city: "Coimbatore",
      department: "Computer Science",
      year: "4th Year",
      xp: 4100,
      level: 16,
      streak: 5,
      created_at: "2026-02-10"
    },
    {
      user_id: "USR-105",
      name: "Divya S",
      email: "divya@skillnex.edu",
      password: "password123",
      role: "student",
      city: "Salem",
      department: "AI & Data Science",
      year: "1st Year",
      xp: 2900,
      level: 11,
      streak: 9,
      created_at: "2026-02-15"
    },
    {
      user_id: "USR-T201",
      name: "Dr. Rajesh K (Teacher)",
      email: "teacher@skillnex.edu",
      password: "password123",
      role: "teacher",
      city: "Coimbatore",
      department: "Computer Science",
      year: "Faculty",
      xp: 9900,
      level: 35,
      streak: 45,
      created_at: "2026-01-01"
    },
    {
      user_id: "USR-A301",
      name: "Admin Office",
      email: "admin@skillnex.edu",
      password: "password123",
      role: "admin",
      city: "Coimbatore",
      department: "Administration",
      year: "Admin",
      xp: 15000,
      level: 50,
      streak: 100,
      created_at: "2026-01-01"
    }
  ],
  Courses: [
    {
      course_id: "CRS-1",
      course_name: "Python Programming",
      subject: "Computer Science",
      description: "Master fundamentals, data structures, OOP, and algorithms in Python.",
      difficulty: "Intermediate",
      duration: "6 Weeks",
      status: "Active",
      created_at: "2026-01-10"
    },
    {
      course_id: "CRS-2",
      course_name: "Data Structures & Algorithms",
      subject: "Computer Science",
      description: "In-depth trees, graphs, sorting algorithms, dynamic programming, and complexity analysis.",
      difficulty: "Advanced",
      duration: "8 Weeks",
      status: "Active",
      created_at: "2026-01-12"
    },
    {
      course_id: "CRS-3",
      course_name: "Physics Fundamentals",
      subject: "Science",
      description: "Electromagnetism, mechanics, Kirchhoff laws, quantum physics introduction.",
      difficulty: "Beginner",
      duration: "5 Weeks",
      status: "Active",
      created_at: "2026-01-15"
    },
    {
      course_id: "CRS-4",
      course_name: "Mathematics for AI",
      subject: "Mathematics",
      description: "Linear algebra, multivariable calculus, probability & statistics for machine learning.",
      difficulty: "Intermediate",
      duration: "6 Weeks",
      status: "Active",
      created_at: "2026-01-20"
    },
    {
      course_id: "CRS-5",
      course_name: "Communication Skills",
      subject: "Humanities",
      description: "Professional articulation, active listening, presentation skills, public speaking.",
      difficulty: "Beginner",
      duration: "4 Weeks",
      status: "Active",
      created_at: "2026-02-01"
    },
    {
      course_id: "CRS-6",
      course_name: "Database Management Systems",
      subject: "Computer Science",
      description: "Relational database design, SQL queries, indexing, normalization, transactions.",
      difficulty: "Intermediate",
      duration: "6 Weeks",
      status: "Active",
      created_at: "2026-02-05"
    }
  ],
  Learning_Progress: [
    { progress_id: "LP-1", user_id: "USR-101", course_id: "CRS-1", topic: "Python Functions", completion: 80, score: 85, time_spent: 320, status: "In Progress", last_activity: "2026-09-02" },
    { progress_id: "LP-2", user_id: "USR-101", course_id: "CRS-2", topic: "Binary Search Tree", completion: 65, score: 72, time_spent: 450, status: "In Progress", last_activity: "2026-09-02" },
    { progress_id: "LP-3", user_id: "USR-101", course_id: "CRS-3", topic: "Kirchhoff Law", completion: 90, score: 88, time_spent: 210, status: "Completed", last_activity: "2026-08-30" },
    { progress_id: "LP-4", user_id: "USR-101", course_id: "CRS-6", topic: "Relational SQL", completion: 70, score: 78, time_spent: 280, status: "In Progress", last_activity: "2026-08-28" }
  ],
  Assessments: [
    {
      assessment_id: "ASM-1",
      title: "Binary Tree Traversal Challenge",
      subject: "Data Structures",
      topic: "Tree Traversal",
      question: "Which traversal visits the root between left and right subtrees?",
      option_a: "Pre-order Traversal",
      option_b: "In-order Traversal",
      option_c: "Post-order Traversal",
      option_d: "Level-order Traversal",
      correct_answer: "b",
      difficulty: "Medium",
      question_type: "MCQ",
      created_by: "USR-T201",
      created_at: "2026-08-25"
    },
    {
      assessment_id: "ASM-2",
      title: "Python List Comprehensions",
      subject: "Python Programming",
      topic: "Lists & Iterators",
      question: "What is the output of [x*2 for x in range(3)]?",
      option_a: "[0, 2, 4]",
      option_b: "[2, 4, 6]",
      option_c: "[0, 1, 2]",
      option_d: "[1, 2, 3]",
      correct_answer: "a",
      difficulty: "Easy",
      question_type: "MCQ",
      created_by: "USR-T201",
      created_at: "2026-08-26"
    },
    {
      assessment_id: "ASM-3",
      title: "Kirchhoff Current Law",
      subject: "Physics",
      topic: "Electrical Circuits",
      question: "Kirchhoff's First Law is based on the law of conservation of:",
      option_a: "Energy",
      option_b: "Charge",
      option_c: "Momentum",
      option_d: "Mass",
      correct_answer: "b",
      difficulty: "Medium",
      question_type: "MCQ",
      created_by: "USR-T201",
      created_at: "2026-08-28"
    }
  ],
  Assessment_Results: [
    {
      result_id: "RES-1",
      assessment_id: "ASM-1",
      user_id: "USR-101",
      score: 8,
      total_questions: 10,
      percentage: 80,
      weak_topic: "Tree Traversal",
      completed_at: "2026-09-02"
    }
  ],
  Study_Plans: [
    { plan_id: "PLN-1", user_id: "USR-101", goal: "Master Data Structures", day: "Day 1", topic: "Binary Tree", activity: "Learn Concepts & Visual Diagrams", duration: "30 min", priority: "High", status: "Completed", created_at: "2026-09-01" },
    { plan_id: "PLN-2", user_id: "USR-101", goal: "Master Data Structures", day: "Day 2", topic: "Tree Traversal", activity: "Practice In-order & Pre-order Problems", duration: "45 min", priority: "High", status: "In Progress", created_at: "2026-09-01" },
    { plan_id: "PLN-3", user_id: "USR-101", goal: "Master Data Structures", day: "Day 3", topic: "Advanced Tree Problems", activity: "Solve BST Insertion & Deletion", duration: "60 min", priority: "Medium", status: "Pending", created_at: "2026-09-01" },
    { plan_id: "PLN-4", user_id: "USR-101", goal: "Master Data Structures", day: "Day 4", topic: "Adaptive Mock Test", activity: "Take 15-min Adaptive Quiz", duration: "45 min", priority: "High", status: "Pending", created_at: "2026-09-01" },
    { plan_id: "PLN-5", user_id: "USR-101", goal: "Master Data Structures", day: "Day 5", topic: "Final Revision", activity: "Review Weak Topics & Notes", duration: "30 min", priority: "Medium", status: "Pending", created_at: "2026-09-01" }
  ],
  Skills: [
    { skill_id: "SK-1", user_id: "USR-101", skill_name: "Programming", score: 90, level: "Advanced", trend: "Up", ai_recommendation: "Keep solving complex algorithm problems.", updated_at: "2026-09-02" },
    { skill_id: "SK-2", user_id: "USR-101", skill_name: "Data Structures", score: 82, level: "Intermediate", trend: "Up", ai_recommendation: "Focus on Tree Traversal & Graph algorithms.", updated_at: "2026-09-02" },
    { skill_id: "SK-3", user_id: "USR-101", skill_name: "Physics", score: 72, level: "Intermediate", trend: "Stable", ai_recommendation: "Review Kirchhoff current law applications.", updated_at: "2026-09-02" },
    { skill_id: "SK-4", user_id: "USR-101", skill_name: "Problem Solving", score: 68, level: "Developing", trend: "Up", ai_recommendation: "Solve 2 medium difficulty puzzles daily.", updated_at: "2026-09-02" },
    { skill_id: "SK-5", user_id: "USR-101", skill_name: "Mathematics", score: 55, level: "Developing", trend: "Down", ai_recommendation: "Practice Linear Algebra vectors and matrices.", updated_at: "2026-09-02" },
    { skill_id: "SK-6", user_id: "USR-101", skill_name: "Communication", score: 42, level: "Needs Improvement", trend: "Needs Focus", ai_recommendation: "Practice 10 min speaking & vocabulary challenge.", updated_at: "2026-09-02" }
  ],
  Notifications: [
    { notification_id: "NT-1", user_id: "USR-101", title: "🏆 Achievement Unlocked", message: "You earned Quiz Master badge!", type: "Achievement", is_read: false, created_at: "2026-09-02 10:15" },
    { notification_id: "NT-2", user_id: "USR-101", title: "⚠ Weak Topic Detected", message: "Tree Traversal needs 20 minutes practice.", type: "Warning", is_read: false, created_at: "2026-09-02 11:30" }
  ]
};

// Internal API Caller for Google Apps Script
async function callGoogleAppsScript(action, payload = {}) {
  if (USE_DEMO_DATA) return null;
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload })
    });
    return await response.json();
  } catch (error) {
    console.warn("Google Apps Script API call failed, falling back to Demo DB:", error.message);
    return null;
  }
}

// User Services
async function getUsers() {
  const remote = await callGoogleAppsScript('getUsers');
  return remote && remote.data ? remote.data : memoryDB.Users;
}

async function getUserById(userId) {
  const users = await getUsers();
  return users.find(u => u.user_id === userId || u.email === userId) || null;
}

async function createUser(userData) {
  const remote = await callGoogleAppsScript('createUser', { user: userData });
  if (remote && remote.success) return remote.data;
  
  const newUser = {
    user_id: "USR-" + (memoryDB.Users.length + 101),
    xp: 0,
    level: 1,
    streak: 1,
    created_at: new Date().toISOString().split('T')[0],
    ...userData
  };
  memoryDB.Users.push(newUser);
  return newUser;
}

async function updateUser(userId, updateData) {
  const remote = await callGoogleAppsScript('updateUser', { userId, updateData });
  if (remote && remote.success) return remote.data;

  const idx = memoryDB.Users.findIndex(u => u.user_id === userId);
  if (idx !== -1) {
    memoryDB.Users[idx] = { ...memoryDB.Users[idx], ...updateData };
    return memoryDB.Users[idx];
  }
  return null;
}

// Courses & Progress
async function getCourses() {
  const remote = await callGoogleAppsScript('getCourses');
  return remote && remote.data ? remote.data : memoryDB.Courses;
}

async function createCourse(courseData) {
  const remote = await callGoogleAppsScript('createCourse', { course: courseData });
  if (remote && remote.success) return remote.data;

  const newCourse = {
    course_id: "CRS-" + (memoryDB.Courses.length + 1),
    status: "Active",
    created_at: new Date().toISOString().split('T')[0],
    ...courseData
  };
  memoryDB.Courses.push(newCourse);
  return newCourse;
}

async function getProgress(userId) {
  const remote = await callGoogleAppsScript('getProgress', { userId });
  const allProgress = remote && remote.data ? remote.data : memoryDB.Learning_Progress;
  return userId ? allProgress.filter(p => p.user_id === userId) : allProgress;
}

async function createOrUpdateProgress(progressData) {
  const remote = await callGoogleAppsScript('updateProgress', { progress: progressData });
  if (remote && remote.success) return remote.data;

  const existingIdx = memoryDB.Learning_Progress.findIndex(
    p => p.user_id === progressData.user_id && p.course_id === progressData.course_id
  );

  if (existingIdx !== -1) {
    memoryDB.Learning_Progress[existingIdx] = {
      ...memoryDB.Learning_Progress[existingIdx],
      ...progressData,
      last_activity: new Date().toISOString().split('T')[0]
    };
    return memoryDB.Learning_Progress[existingIdx];
  } else {
    const newProgress = {
      progress_id: "LP-" + (memoryDB.Learning_Progress.length + 1),
      status: "In Progress",
      last_activity: new Date().toISOString().split('T')[0],
      ...progressData
    };
    memoryDB.Learning_Progress.push(newProgress);
    return newProgress;
  }
}

// Assessments & Results
async function getAssessments() {
  const remote = await callGoogleAppsScript('getAssessments');
  return remote && remote.data ? remote.data : memoryDB.Assessments;
}

async function createAssessment(assessmentData) {
  const remote = await callGoogleAppsScript('createAssessment', { assessment: assessmentData });
  if (remote && remote.success) return remote.data;

  const newAssessment = {
    assessment_id: "ASM-" + (memoryDB.Assessments.length + 1),
    created_at: new Date().toISOString().split('T')[0],
    ...assessmentData
  };
  memoryDB.Assessments.push(newAssessment);
  return newAssessment;
}

async function getAssessmentResults(userId) {
  const remote = await callGoogleAppsScript('getAssessmentResults', { userId });
  const allResults = remote && remote.data ? remote.data : memoryDB.Assessment_Results;
  return userId ? allResults.filter(r => r.user_id === userId) : allResults;
}

async function createAssessmentResult(resultData) {
  const remote = await callGoogleAppsScript('createAssessmentResult', { result: resultData });
  if (remote && remote.success) return remote.data;

  const newResult = {
    result_id: "RES-" + (memoryDB.Assessment_Results.length + 1),
    completed_at: new Date().toISOString().split('T')[0],
    ...resultData
  };
  memoryDB.Assessment_Results.push(newResult);

  // Automatically update skill recommendation if weak topic detected
  if (resultData.weak_topic && resultData.user_id) {
    const userSkills = await getSkills(resultData.user_id);
    const targetSkill = userSkills.find(s => 
      s.skill_name.toLowerCase().includes("structure") || 
      s.skill_name.toLowerCase().includes("program") ||
      s.skill_name.toLowerCase().includes("problem")
    );
    if (targetSkill) {
      await updateSkill(targetSkill.skill_id, {
        ai_recommendation: `Practice ${resultData.weak_topic} for 20 minutes.`,
        trend: "Needs Focus"
      });
    }
  }
  return newResult;
}

// Study Plans
async function getStudyPlans(userId) {
  const remote = await callGoogleAppsScript('getStudyPlans', { userId });
  const plans = remote && remote.data ? remote.data : memoryDB.Study_Plans;
  return userId ? plans.filter(p => p.user_id === userId) : plans;
}

async function createStudyPlan(planData) {
  const remote = await callGoogleAppsScript('createStudyPlan', { plan: planData });
  if (remote && remote.success) return remote.data;

  const newPlan = {
    plan_id: "PLN-" + (memoryDB.Study_Plans.length + 1),
    status: "Pending",
    created_at: new Date().toISOString().split('T')[0],
    ...planData
  };
  memoryDB.Study_Plans.push(newPlan);
  return newPlan;
}

async function updateStudyPlan(planId, updateData) {
  const remote = await callGoogleAppsScript('updateStudyPlan', { planId, updateData });
  if (remote && remote.success) return remote.data;

  const idx = memoryDB.Study_Plans.findIndex(p => p.plan_id === planId);
  if (idx !== -1) {
    memoryDB.Study_Plans[idx] = { ...memoryDB.Study_Plans[idx], ...updateData };
    return memoryDB.Study_Plans[idx];
  }
  return null;
}

// Skills
async function getSkills(userId) {
  const remote = await callGoogleAppsScript('getSkills', { userId });
  const skills = remote && remote.data ? remote.data : memoryDB.Skills;
  return userId ? skills.filter(s => s.user_id === userId) : skills;
}

async function updateSkill(skillId, updateData) {
  const remote = await callGoogleAppsScript('updateSkill', { skillId, updateData });
  if (remote && remote.success) return remote.data;

  const idx = memoryDB.Skills.findIndex(s => s.skill_id === skillId);
  if (idx !== -1) {
    memoryDB.Skills[idx] = {
      ...memoryDB.Skills[idx],
      ...updateData,
      updated_at: new Date().toISOString().split('T')[0]
    };
    return memoryDB.Skills[idx];
  }
  return null;
}

// Notifications
async function getNotifications(userId) {
  const remote = await callGoogleAppsScript('getNotifications', { userId });
  const notifs = remote && remote.data ? remote.data : memoryDB.Notifications;
  return userId ? notifs.filter(n => n.user_id === userId) : notifs;
}

async function createNotification(notifData) {
  const remote = await callGoogleAppsScript('createNotification', { notification: notifData });
  if (remote && remote.success) return remote.data;

  const newNotif = {
    notification_id: "NT-" + (memoryDB.Notifications.length + 1),
    is_read: false,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
    ...notifData
  };
  memoryDB.Notifications.unshift(newNotif);
  return newNotif;
}

async function updateNotification(notificationId, updateData) {
  const remote = await callGoogleAppsScript('updateNotification', { notificationId, updateData });
  if (remote && remote.success) return remote.data;

  const idx = memoryDB.Notifications.findIndex(n => n.notification_id === notificationId);
  if (idx !== -1) {
    memoryDB.Notifications[idx] = { ...memoryDB.Notifications[idx], ...updateData };
    return memoryDB.Notifications[idx];
  }
  return null;
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  getCourses,
  createCourse,
  getProgress,
  createOrUpdateProgress,
  getAssessments,
  createAssessment,
  getAssessmentResults,
  createAssessmentResult,
  getStudyPlans,
  createStudyPlan,
  updateStudyPlan,
  getSkills,
  updateSkill,
  getNotifications,
  createNotification,
  updateNotification
};
