# 🎓 Student Task Manager (StudyFlow)
### Full Stack Web Development (FSWD) Project | MCA Semester 3

A clean, beginner-friendly, and modern **Student Task Manager** web application built with **React.js, Node.js, Express.js, GraphQL, and the native Fetch API**. 

Designed specifically for MCA / Computer Science students to easily understand, present, and explain during a **Lab Viva Voce**.

---

## 🌟 Application Features

- **Dashboard Statistics**: Real-time counter cards showing **Total Tasks**, **Pending Tasks**, **Completed Tasks**, and **High-Priority Deadlines** with overall progress percentage.
- **Add Tasks**: Form to add tasks with Title, Description, Due Date, and Priority (`High`, `Medium`, `Low`).
- **Edit Tasks**: Reusable form modal to update existing task deadlines, descriptions, or priority.
- **Delete Tasks**: Confirmation dialog to safely delete tasks.
- **Toggle Task Status**: One-click button on each task card to toggle between **Pending** and **Completed** with strike-through styling.
- **Filter by Status**: Instant filtering by `All Tasks`, `Pending`, or `Completed`.
- **Filter by Priority**: Filter tasks by `High`, `Medium`, or `Low` priority.
- **Live Search**: Instant keyword search filtering tasks by title or description.
- **Toast Notifications**: Clean pop-up feedback alerts when tasks are created, updated, toggled, or deleted.
- **Overdue Indicator**: Visual badge flagging tasks whose due date has passed.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 / 19 (Vite) | Declarative UI with functional components & hooks |
| **API Client** | Native Fetch API | Sends GraphQL HTTP POST requests (`query`, `variables`) |
| **Backend** | Node.js + Express.js | Lightweight HTTP server & middleware pipeline |
| **API Layer** | Apollo Server (GraphQL) | GraphQL schema definitions (`typeDefs`) and `resolvers` |
| **Data Layer** | In-Memory Array | Fast, zero-database configuration storage |
| **Styling** | Modern Vanilla CSS | Professional responsive dashboard design |

---

## 📁 Project Structure

```text
├── backend/
│   ├── package.json               # Backend dependencies (express, @apollo/server, graphql, cors)
│   ├── server.js                  # Express server & Apollo GraphQL middleware initialization
│   ├── schema/
│   │   └── typeDefs.js            # GraphQL Schema (Task, TaskStats, Queries, Mutations)
│   ├── resolvers/
│   │   └── taskResolvers.js       # GraphQL resolver functions (Query & Mutation logic)
│   └── data/
│       └── tasksData.js           # In-memory student task storage array
│
├── frontend/
│   ├── package.json               # Frontend dependencies (react, react-dom, lucide-react)
│   ├── index.html                 # Main HTML template with Inter font
│   ├── vite.config.js             # Vite development server configuration
│   └── src/
│       ├── main.jsx               # React DOM root render
│       ├── App.jsx                # Stateful Root Component (coordinates state & layout)
│       ├── App.css                # Dashboard, sidebar, card, and modal CSS styles
│       ├── index.css              # Global CSS reset & design tokens
│       ├── constants/
│       │   └── graphqlQueries.js  # GraphQL Query and Mutation definitions
│       ├── services/
│       │   └── graphqlService.js  # Fetch API wrappers to call GraphQL backend
│       └── components/
│           ├── Sidebar.jsx            # Stateless component: Status & priority filters
│           ├── Header.jsx             # Stateless component: Search input & Add Task trigger
│           ├── TaskStats.jsx          # Stateless component: Summary stat metric cards
│           ├── TaskList.jsx           # Stateless component: Tasks grid & empty state
│           ├── TaskCard.jsx           # Stateless component: Individual task card with actions
│           ├── TaskForm.jsx           # Stateful component: Add/Edit modal with useState
│           └── DeleteConfirmModal.jsx # Stateless component: Delete confirmation dialog
│
├── package.json                   # Root package with convenient scripts
└── README.md                      # Complete documentation & Viva preparation guide
```

---

## ⚡ Quick Start & Run Instructions

### Prerequisites
- Node.js (v18 or higher recommended; verified on Node v20)
- npm (installed automatically with Node)

All dependencies for both frontend and backend are already installed!

---

### Step 1: Start the Backend Server
Open a terminal in the project directory and run:
```bash
cd backend
npm start
```
*The backend server will run at:* **`http://localhost:5000`**  
*GraphQL Endpoint:* **`http://localhost:5000/graphql`**

---

### Step 2: Start the Frontend React App
Open a **second terminal** in the project directory and run:
```bash
cd frontend
npm run dev
```
*The React application will open at:* **`http://localhost:3000`** (or `http://localhost:5173`)

Open that URL in your browser to view and use the Student Task Manager.

---

## 🔬 Technical Concepts Explained (Viva Cheat Sheet)

### 1. GraphQL vs. REST API
- **Single Endpoint**: Unlike REST (which uses separate routes like `GET /tasks`, `POST /tasks`, `PUT /tasks/:id`), GraphQL uses a **single endpoint** (`/graphql`) via HTTP `POST`.
- **No Over-fetching / Under-fetching**: The client specifies the exact fields it needs (`id`, `title`, `status`, etc.).
- **Schema & Type Safety**: Strongly-typed schema (`typeDefs`) that contracts what queries and mutations are valid.

### 2. How GraphQL Works with the Native Fetch API
No heavy library like Apollo Client or Relay is needed. Standard `fetch()` sends a POST request with a JSON body:
```javascript
const response = await fetch('http://localhost:5000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      query GetTasks($status: String) {
        getTasks(status: $status) {
          id
          title
          dueDate
          priority
          status
        }
      }
    `,
    variables: { status: 'Pending' }
  })
});

const { data } = await response.json();
console.log(data.getTasks);
```

### 3. Stateful vs. Stateless Components in this Project

| Type | Component | Reason |
|---|---|---|
| **Stateful** | `App.jsx` | Holds global application state (`tasks`, `stats`, `statusFilter`, `priorityFilter`, `searchQuery`, modals) using `useState` and manages data loading with `useEffect`. |
| **Stateful** | `TaskForm.jsx` | Manages internal form fields (`formData`: title, description, dueDate, priority, status) and validation `errors` using `useState`. |
| **Stateless** | `TaskStats.jsx` | Receives `stats` object as `props` and renders cards. No internal `useState`. |
| **Stateless** | `TaskCard.jsx` | Receives individual `task` and callback functions (`onEdit`, `onDelete`, `onToggleStatus`) as `props`. |
| **Stateless** | `TaskList.jsx` | Receives `tasks` array as `props` and renders cards. |
| **Stateless** | `Sidebar.jsx` | Receives filter values and click handlers as `props`. |
| **Stateless** | `Header.jsx` | Receives search query and button callbacks as `props`. |
| **Stateless** | `DeleteConfirmModal.jsx` | Receives task title and confirm/cancel callbacks as `props`. |

### 4. Event Handlers Implemented
1. **`onClick`**:
   - Selecting status filters in `Sidebar` (`onStatusChange`).
   - Toggling task status between Pending/Completed on `TaskCard` (`onToggleStatus`).
   - Opening Create Task modal from `Header` (`onOpenNewTaskModal`).
   - Editing a task from `TaskCard` (`onEdit`).
   - Confirming/Cancelling task deletion in `DeleteConfirmModal`.
2. **`onChange`**:
   - Live search input in `Header` (`onSearchChange`).
   - Form input fields (Title, Description, Due Date, Priority dropdown) in `TaskForm` (`handleChange`).
3. **`onSubmit`**:
   - Submitting the form in `TaskForm` (`handleSubmit`). Uses `e.preventDefault()` to stop traditional page refresh, validates inputs, and triggers the GraphQL mutation.

---

## 🎓 Common Viva Questions & Answers

**Q1: What are GraphQL Queries and Mutations?**  
> *Answer:* In GraphQL, a **Query** is an operation used to read or fetch data (analogous to HTTP GET in REST). A **Mutation** is an operation used to write, insert, update, or delete data on the server (analogous to POST, PUT, DELETE in REST).

**Q2: What is the purpose of resolvers in GraphQL?**  
> *Answer:* The schema (`typeDefs`) defines *what* data exists, while **resolvers** are the functions that specify *how* to produce that data. Every field in a query or mutation maps to a resolver function that queries the database or memory array and returns the requested shape.

**Q3: Why use `e.preventDefault()` inside an `onSubmit` handler?**  
> *Answer:* By default, standard HTML forms perform a page reload and submit via GET/POST query parameters. In a Single Page Application (SPA) like React, `e.preventDefault()` stops the default reload so we can asynchronously validate the form and send a GraphQL mutation via `fetch()` without losing application state.

**Q4: How does data flow between components in React?**  
> *Answer:* React uses **unidirectional (top-down) data flow**. Data is passed from parent to child via `props`. When a child needs to update the parent's state, the parent passes down a callback function as a prop, which the child invokes when an event occurs (e.g., `onClick`, `onChange`).

**Q5: What is the advantage of using in-memory data for this project?**  
> *Answer:* In-memory storage uses a JavaScript array in Node.js, making the project lightweight, portable, and immediately runnable on any machine without needing MongoDB or MySQL server installations or connection strings.

