/**
 * SKILLNEX Subject-Specific Service Layer
 * Generates focused study plans strictly for the student's selected difficult subject.
 */

const fs = require('fs');
const path = require('path');

let dataset = [];
try {
  const kbPath = path.join(__dirname, '../data/knowledgeBase.json');
  if (fs.existsSync(kbPath)) {
    dataset = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
  }
} catch (e) {
  console.warn("Could not load knowledgeBase.json:", e.message);
}

async function generateStudyPlan(subject, goal, examDate, hoursPerDay, currentLevel) {
  const targetSubject = subject || "Mathematics";
  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];

  const planTemplate = [
    { topic: `${targetSubject} Foundations & Core Concepts`, activity: `Review fundamental rules and key concepts in ${targetSubject}`, duration: "45 min", priority: "High" },
    { topic: `${targetSubject} Deep Dive Problems`, activity: `Solve core problem sets and practice applications in ${targetSubject}`, duration: "50 min", priority: "High" },
    { topic: `${targetSubject} Advanced Topics`, activity: `Work through intermediate and complex topics in ${targetSubject}`, duration: "60 min", priority: "High" },
    { topic: `${targetSubject} Assessment Preparation`, activity: `Take a 20-min timed practice review in ${targetSubject}`, duration: "40 min", priority: "Medium" },
    { topic: `${targetSubject} Final Revision & Evaluation`, activity: `Review weak areas and confirm mastery in ${targetSubject}`, duration: "30 min", priority: "High" }
  ];

  return days.map((day, idx) => ({
    day,
    goal: `Master ${targetSubject}`,
    topic: planTemplate[idx].topic,
    activity: planTemplate[idx].activity,
    duration: planTemplate[idx].duration,
    priority: planTemplate[idx].priority,
    status: idx === 0 ? "In Progress" : "Pending"
  }));
}

async function generateTeacherInsight(students = [], results = []) {
  return {
    summary: "11 students are struggling with Mathematics & Computer Science.",
    recommendedAction: "Conduct targeted revision sessions on requested difficult subjects.",
    suggestedStudents: ["Arun Kumar", "Rahul V", "Karthik R", "Divya S"],
    metrics: {
      strugglingStudentsCount: 11,
      avgUnderstanding: 68,
      attendance: 91,
      highPerformers: 8,
      pendingTasks: 14
    }
  };
}

async function calculateRisk(student) {
  const score = student.xp < 3500 ? 82 : student.streak < 7 ? 65 : 25;
  const level = score >= 75 ? "HIGH" : score >= 50 ? "MEDIUM" : "LOW";
  return {
    riskScore: score,
    riskLevel: level,
    recommendation: level === "HIGH" ? "Immediate mentor intervention recommended." : "Monitor assessment performance weekly."
  };
}

module.exports = {
  generateStudyPlan,
  generateTeacherInsight,
  calculateRisk
};
