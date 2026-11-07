// GraphQL Type Definitions (Schema)
// Defines the shape of data, queries, and mutations available in the API.

export const typeDefs = `#graphql
  # Task Type: Represents an individual student task
  type Task {
    id: ID!
    title: String!
    description: String!
    dueDate: String!
    priority: String!   # 'High' | 'Medium' | 'Low'
    status: String!     # 'Pending' | 'Completed'
    createdAt: String
  }

  # Summary statistics for the dashboard
  type TaskStats {
    total: Int!
    pending: Int!
    completed: Int!
    highPriority: Int!
  }

  # Input object for creating a new task
  input TaskInput {
    title: String!
    description: String!
    dueDate: String!
    priority: String!
    status: String
  }

  # Input object for updating an existing task
  input TaskUpdateInput {
    title: String
    description: String
    dueDate: String
    priority: String
    status: String
  }

  # Root Queries (Read operations)
  type Query {
    getTasks(status: String, priority: String, search: String): [Task!]!
    getTaskById(id: ID!): Task
    getTaskStats: TaskStats!
  }

  # Root Mutations (Write/Modify operations)
  type Mutation {
    createTask(input: TaskInput!): Task!
    updateTask(id: ID!, input: TaskUpdateInput!): Task!
    deleteTask(id: ID!): Boolean!
    toggleTaskStatus(id: ID!): Task!
  }
`;

