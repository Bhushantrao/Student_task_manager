/**
 * GraphQL API Service using the native Fetch API
 * 
 * Demonstrates:
 * - How to call GraphQL endpoints using vanilla fetch() without external heavy clients.
 * - HTTP POST method with application/json header.
 * - Passing query string and variables in the JSON body.
 */

import {
  GET_TASKS_QUERY,
  GET_TASK_STATS_QUERY,
  CREATE_TASK_MUTATION,
  UPDATE_TASK_MUTATION,
  DELETE_TASK_MUTATION,
  TOGGLE_TASK_STATUS_MUTATION
} from '../constants/graphqlQueries';

// Backend GraphQL server URL
const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql';

/**
 * Generic helper function to send GraphQL requests via Fetch API
 * @param {string} query - GraphQL query or mutation string
 * @param {object} variables - Optional key-value variables
 * @returns {Promise<any>} Data returned by GraphQL server
 */
export async function executeGraphQL(query, variables = {}) {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP network error! Status: ${response.status}`);
    }

    const result = await response.json();

    // Check for GraphQL-level errors
    if (result.errors && result.errors.length > 0) {
      const errorMessage = result.errors.map(err => err.message).join(' | ');
      throw new Error(errorMessage);
    }

    return result.data;
  } catch (error) {
    console.error('GraphQL Request failed:', error);
    throw error;
  }
}

// 1. Fetch all tasks with optional filters
export async function fetchTasks(filters = {}) {
  const data = await executeGraphQL(GET_TASKS_QUERY, filters);
  return data.getTasks;
}

// 2. Fetch task statistics (total, pending, completed, highPriority)
export async function fetchTaskStats() {
  const data = await executeGraphQL(GET_TASK_STATS_QUERY);
  return data.getTaskStats;
}

// 3. Create a new task
export async function createTask(taskInput) {
  const data = await executeGraphQL(CREATE_TASK_MUTATION, { input: taskInput });
  return data.createTask;
}

// 4. Update an existing task
export async function updateTask(id, taskInput) {
  const data = await executeGraphQL(UPDATE_TASK_MUTATION, { id, input: taskInput });
  return data.updateTask;
}

// 5. Delete a task
export async function deleteTask(id) {
  const data = await executeGraphQL(DELETE_TASK_MUTATION, { id });
  return data.deleteTask;
}

// 6. Toggle task status between Pending and Completed
export async function toggleTaskStatus(id) {
  const data = await executeGraphQL(TOGGLE_TASK_STATUS_MUTATION, { id });
  return data.toggleTaskStatus;
}

