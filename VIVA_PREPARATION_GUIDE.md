# 🎓 MCA Lab Viva Voce Preparation Guide
## Full Stack Web Development (FSWD) — Student Task Manager

This guide contains **15 essential viva questions and answers** covering **React.js, Node.js, Express.js, GraphQL, and the Fetch API**, tailored directly to this project.

---

### Section 1: React.js & Frontend Architecture

#### Q1: What is a Functional Component in React?
> **Answer:** A functional component is a plain JavaScript function that accepts `props` as an argument and returns JSX (JavaScript XML) describing the user interface. Functional components use React Hooks (like `useState`, `useEffect`, `useCallback`) to manage state and side effects without writing class components.
> In our project: Every component (`App`, `Sidebar`, `Header`, `TaskCard`, `TaskForm`, etc.) is a functional component.

#### Q2: What is the difference between Stateful and Stateless components in this project?
> **Answer:**
> - **Stateful Components** manage and own dynamic data using the `useState` hook.
>   - Example 1: `App.jsx` manages `tasks`, `stats`, `statusFilter`, `priorityFilter`, `searchQuery`, and modal open/close states.
>   - Example 2: `TaskForm.jsx` manages local form input values (`title`, `description`, `dueDate`, `priority`, `status`) and form validation `errors`.
> - **Stateless (Presentational) Components** do not own mutable state; they receive data and callback functions from their parent via `props`.
>   - Example: `TaskCard.jsx` simply displays task information and triggers parent functions (`onEdit`, `onDelete`, `onToggleStatus`) when buttons are clicked.

#### Q3: How do `useState` and `props` differ?
> **Answer:**
> - **`useState`**: Used for internal, mutable component state. When state changes using its setter function (e.g., `setTasks(...)`), React re-renders that component.
> - **`props`**: Used to pass data from a parent component down to a child component. Props are read-only (immutable) in the receiving component.

#### Q4: How is event handling (`onClick`, `onChange`, `onSubmit`) implemented in this application?
> **Answer:**
> - **`onClick`**: Used for button clicks, such as toggling status between Pending and Completed (`onToggleStatus`), opening modals, and switching sidebar filters.
> - **`onChange`**: Listens to user keystrokes in input fields. Used in the search bar to filter tasks in real-time, and inside `TaskForm` to capture user input into the `formData` state.
> - **`onSubmit`**: Intercepts form submission in `TaskForm`. We invoke `e.preventDefault()` to stop the browser from reloading the page, validate the required fields, and trigger the GraphQL mutation.

#### Q5: Why do we pass a unique `key` prop when rendering lists of tasks?
> **Answer:** When rendering an array of elements using `tasks.map(task => <TaskCard key={task.id} ... />)`, React uses the unique `key` prop to identify which items have changed, been added, or been removed. This optimizes React's virtual DOM reconciliation algorithm by re-rendering only the affected nodes rather than the entire list.

---

### Section 2: GraphQL & Fetch API

#### Q6: What is GraphQL and how does it differ from a traditional REST API?
> **Answer:** GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.
> Key differences from REST:
> 1. **Single Endpoint**: REST requires multiple URL endpoints (`/api/tasks`, `/api/tasks/stats`, `/api/tasks/:id`). GraphQL uses a single endpoint (`/graphql`) via HTTP POST.
> 2. **Over-fetching & Under-fetching**: In REST, endpoints return fixed payloads (over-fetching unused fields) or require multiple requests (under-fetching). With GraphQL, the client requests exactly the fields it needs in one query.
> 3. **Type Schema**: GraphQL APIs are strictly defined by a schema (`typeDefs`) ensuring contracts between client and server.

#### Q7: What are GraphQL Queries and Mutations?
> **Answer:**
> - **Query**: Used for reading or fetching data (similar to HTTP `GET` in REST). In our project: `getTasks`, `getTaskById`, `getTaskStats`.
> - **Mutation**: Used for writing, modifying, or deleting data (similar to HTTP `POST`, `PUT`, `DELETE` in REST). In our project: `createTask`, `updateTask`, `deleteTask`, `toggleTaskStatus`.

#### Q8: How does the Fetch API interact with a GraphQL server without Apollo Client?
> **Answer:** GraphQL operates over standard HTTP POST requests. Instead of installing large client libraries, we use the browser's native `fetch()` function in `graphqlService.js`:
> ```javascript
> const response = await fetch('http://localhost:5000/graphql', {
>   method: 'POST',
>   headers: { 'Content-Type': 'application/json' },
>   body: JSON.stringify({ query, variables })
> });
> const result = await response.json();
> ```
> This makes the application lightweight, fast, and dependency-free on the frontend.

#### Q9: What are GraphQL Schema (`typeDefs`) and `Resolvers`?
> **Answer:**
> - **`typeDefs` (Type Definitions)**: Defines the data model, types, inputs, queries, and mutations using the GraphQL Schema Definition Language (SDL).
> - **`resolvers`**: JavaScript functions that execute the business logic for each field defined in the schema. When a client requests `getTasks`, Apollo Server invokes the `getTasks` resolver function, which filters the in-memory array and returns the matching task objects.

#### Q10: What are GraphQL Variables?
> **Answer:** Variables allow passing dynamic arguments separately from the query string itself rather than string concatenation. This prevents syntax errors and injection vulnerabilities.
> Example:
> ```graphql
> mutation Toggle($id: ID!) {
>   toggleTaskStatus(id: $id) {
>     id
>     status
>   }
> }
> ```
> Where `$id` is supplied in the variables JSON object: `{ "id": "1" }`.

---

### Section 3: Backend & Architecture

#### Q11: What is the role of Express.js and Apollo Server middleware?
> **Answer:** Express.js provides the underlying HTTP web server, routing, and middleware capabilities. Apollo Server (`@apollo/server`) parses incoming GraphQL documents, validates them against `typeDefs`, and executes the matching `resolvers`. We mount Apollo Server as middleware on Express using `expressMiddleware(server)` at the `/graphql` route.

#### Q12: Why is `cors()` middleware necessary?
> **Answer:** CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks web pages running on one origin (e.g., `http://localhost:3000`) from requesting resources from another origin (e.g., `http://localhost:5000`). Calling `app.use(cors())` sets the appropriate HTTP response headers (`Access-Control-Allow-Origin: *`) allowing our React frontend to communicate with our Express backend.

#### Q13: How does in-memory data storage work in this project?
> **Answer:** Tasks are stored in a JavaScript array (`backend/data/tasksData.js`).
> - When `createTask` is invoked, a new object is prepended using `tasks.unshift(newTask)`.
> - When `updateTask` or `toggleTaskStatus` is invoked, the object in the array is modified in place.
> - When `deleteTask` is invoked, the element is removed using `tasks.splice(index, 1)`.
> *Advantage:* Zero external database setup (no MongoDB or MySQL installation needed), ensuring instant setup and portable execution on any machine.

#### Q14: How does the application handle error handling and feedback?
> **Answer:**
> - **Client-side validation:** `TaskForm.jsx` ensures the title has at least 3 characters and a valid due date is selected before submitting.
> - **API Error Handling:** `executeGraphQL()` in `graphqlService.js` checks both HTTP status codes (`response.ok`) and the GraphQL `result.errors` array.
> - **User Feedback:** The UI displays toast notification banners for success, info, and error events with auto-dismiss after 3.5 seconds.

#### Q15: Explain the overall Data Flow in this application.
> **Answer (Step-by-Step):**
> 1. User interacts with UI (e.g., clicks "Mark Completed" on a task card).
> 2. An `onClick` event fires, invoking the callback passed from `App.jsx`.
> 3. `App.jsx` calls `toggleTaskStatus(id)` from `graphqlService.js`.
> 4. `graphqlService.js` executes native `fetch()` sending a GraphQL mutation POST to `http://localhost:5000/graphql`.
> 5. Express routes the request to Apollo Server middleware.
> 6. Apollo Server matches `toggleTaskStatus` to its resolver function in `taskResolvers.js`.
> 7. The resolver toggles the status property in the in-memory `tasks` array and returns the updated task.
> 8. Apollo Server sends JSON back to the frontend: `{ data: { toggleTaskStatus: { id, status: "Completed" } } }`.
> 9. The React component receives the result, updates its local `tasks` and `stats` state with `setTasks`, and re-renders the UI with the updated status badge and updated counters.

