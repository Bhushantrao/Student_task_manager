/**
 * GraphQL Query & Mutation Definitions
 * 
 * In GraphQL:
 * - Queries: Used to fetch (read) data from the server.
 * - Mutations: Used to create, update, or delete data on the server.
 * 
 * We send these strings in standard HTTP POST requests using the Fetch API.
 */

// 1. Fetch all tasks with optional filters (status, priority, search)
export const GET_TASKS_QUERY = `
  query GetTasks($status: String, $priority: String, $search: String) {
    getTasks(status: $status, priority: $priority, search: $search) {
      id
      title
      description
      dueDate
      priority
      status
      createdAt
    }
  }
`;

// 2. Fetch task summary statistics (Total, Pending, Completed, High Priority)
export const GET_TASK_STATS_QUERY = `
  query GetTaskStats {
    getTaskStats {
      total
      pending
      completed
      highPriority
    }
  }
`;

// 3. Create a new task
export const CREATE_TASK_MUTATION = `
  mutation CreateTask($input: TaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      dueDate
      priority
      status
      createdAt
    }
  }
`;

// 4. Update an existing task
export const UPDATE_TASK_MUTATION = `
  mutation UpdateTask($id: ID!, $input: TaskUpdateInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      dueDate
      priority
      status
      createdAt
    }
  }
`;

// 5. Delete a task
export const DELETE_TASK_MUTATION = `
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

// 6. Toggle task status between Pending and Completed
export const TOGGLE_TASK_STATUS_MUTATION = `
  mutation ToggleTaskStatus($id: ID!) {
    toggleTaskStatus(id: $id) {
      id
      title
      description
      dueDate
      priority
      status
      createdAt
    }
  }
`;

