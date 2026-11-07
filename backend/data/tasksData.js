// In-memory data storage for Student Tasks
// Realistic sample data for an MCA / Computer Science student

export let tasks = [
  {
    id: "1",
    title: "Complete FSWD Assignment 3",
    description: "Build a full-stack GraphQL application with React frontend and Express backend.",
    dueDate: "2026-11-10",
    priority: "High",
    status: "Completed",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Prepare for MCA Lab Viva",
    description: "Revise React hooks (useState, useEffect), GraphQL queries & mutations, and REST differences.",
    dueDate: "2026-11-14",
    priority: "High",
    status: "Pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Review Cloud Computing Research Paper",
    description: "Read IEEE paper on serverless edge computing architectures and prepare 2-page summary.",
    dueDate: "2026-11-18",
    priority: "Medium",
    status: "Pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Submit Data Science Mini-Project Proposal",
    description: "Draft synopsis for Student Performance Prediction model using Scikit-Learn.",
    dueDate: "2026-11-20",
    priority: "Low",
    status: "Pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Update Project Documentation & GitHub",
    description: "Add architecture diagram, setup instructions, and API endpoints to README.",
    dueDate: "2026-11-12",
    priority: "Medium",
    status: "Completed",
    createdAt: new Date().toISOString()
  }
];

