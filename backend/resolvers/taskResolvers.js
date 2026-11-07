// Resolvers define the implementation of the GraphQL queries and mutations.
// They interact directly with the in-memory array storage.

import { tasks } from '../data/tasksData.js';

export const resolvers = {
  Query: {
    // Fetch all tasks with optional filters (status, priority, search)
    getTasks: (_, { status, priority, search }) => {
      let result = [...tasks];

      if (status && status !== 'All') {
        result = result.filter(
          (t) => t.status.toLowerCase() === status.toLowerCase()
        );
      }

      if (priority && priority !== 'All') {
        result = result.filter(
          (t) => t.priority.toLowerCase() === priority.toLowerCase()
        );
      }

      if (search && search.trim() !== '') {
        const query = search.toLowerCase().trim();
        result = result.filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query)
        );
      }

      // Sort newest first by default
      return result;
    },

    // Fetch a single task by its unique ID
    getTaskById: (_, { id }) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) {
        throw new Error(`Task with ID ${id} not found`);
      }
      return task;
    },

    // Calculate summary statistics for the dashboard
    getTaskStats: () => {
      const total = tasks.length;
      const completed = tasks.filter((t) => t.status.toLowerCase() === 'completed').length;
      const pending = tasks.filter((t) => t.status.toLowerCase() === 'pending').length;
      const highPriority = tasks.filter((t) => t.priority.toLowerCase() === 'high').length;

      return {
        total,
        pending,
        completed,
        highPriority
      };
    }
  },

  Mutation: {
    // Add a new task
    createTask: (_, { input }) => {
      const newTask = {
        id: Date.now().toString(),
        title: input.title.trim(),
        description: input.description ? input.description.trim() : '',
        dueDate: input.dueDate,
        priority: input.priority || 'Medium',
        status: input.status || 'Pending',
        createdAt: new Date().toISOString()
      };

      tasks.unshift(newTask); // Add to beginning of array
      return newTask;
    },

    // Update an existing task
    updateTask: (_, { id, input }) => {
      const taskIndex = tasks.findIndex((t) => t.id === id);
      if (taskIndex === -1) {
        throw new Error(`Task with ID ${id} not found`);
      }

      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...input,
        title: input.title !== undefined ? input.title.trim() : tasks[taskIndex].title,
        description: input.description !== undefined ? input.description.trim() : tasks[taskIndex].description
      };

      return tasks[taskIndex];
    },

    // Delete a task by ID
    deleteTask: (_, { id }) => {
      const taskIndex = tasks.findIndex((t) => t.id === id);
      if (taskIndex === -1) {
        return false;
      }
      tasks.splice(taskIndex, 1);
      return true;
    },

    // Toggle task status between 'Pending' and 'Completed'
    toggleTaskStatus: (_, { id }) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) {
        throw new Error(`Task with ID ${id} not found`);
      }

      task.status = task.status.toLowerCase() === 'completed' ? 'Pending' : 'Completed';
      return task;
    }
  }
};

