import React from 'react';
import TaskCard from './TaskCard';
import { Inbox, PlusCircle, Loader2 } from 'lucide-react';

/**
 * TaskList Component (Stateless / Presentational Component)
 * 
 * Demonstrates:
 * - Rendering lists in React using Array.prototype.map with unique `key` prop.
 * - Conditional rendering for Loading, Empty state, and Populated list.
 * - Passing event handler functions down to child TaskCard components.
 */
function TaskList({ 
  tasks, 
  loading, 
  onToggleStatus, 
  onEdit, 
  onDelete, 
  onAddNew,
  statusFilter,
  priorityFilter,
  searchQuery
}) {
  // 1. Loading State
  if (loading) {
    return (
      <div className="state-container loading-state">
        <Loader2 className="spinner-icon" size={36} />
        <p>Loading tasks from GraphQL server...</p>
      </div>
    );
  }

  // 2. Empty State
  if (!tasks || tasks.length === 0) {
    return (
      <div className="state-container empty-state">
        <div className="empty-icon-wrapper">
          <Inbox size={48} className="empty-icon" />
        </div>
        <h3>No Tasks Found</h3>
        <p>
          {searchQuery
            ? `No tasks match your search for "${searchQuery}".`
            : statusFilter !== 'All' || priorityFilter !== 'All'
            ? `There are no ${statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} tasks with ${priorityFilter !== 'All' ? priorityFilter.toLowerCase() : ''} priority.`
            : 'You have no tasks right now. Create your first task to get organized!'}
        </p>
        <button className="btn btn-primary" onClick={onAddNew}>
          <PlusCircle size={18} />
          <span>Add New Task</span>
        </button>
      </div>
    );
  }

  // 3. Grid of Tasks
  return (
    <div className="task-list-section">
      <div className="task-list-header">
        <h2>
          Tasks 
          <span className="task-count-pill">{tasks.length}</span>
        </h2>
        <span className="filter-summary">
          Showing: <strong>{statusFilter}</strong> status • <strong>{priorityFilter}</strong> priority
        </span>
      </div>

      <div className="tasks-grid">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleStatus={onToggleStatus}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;

