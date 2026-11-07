import React from 'react';
import { 
  Calendar, 
  CheckCircle, 
  RotateCcw, 
  Pencil, 
  Trash2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

/**
 * TaskCard Component (Stateless / Presentational Component)
 * 
 * Demonstrates:
 * - Functional component receiving task data and action callbacks via props.
 * - Clear onClick event handlers for:
 *   - onToggleStatus (Toggle Pending <-> Completed)
 *   - onEdit (Open edit form with this task data)
 *   - onDelete (Prompt delete confirmation)
 * - Conditional styling based on task.status and task.priority.
 */
function TaskCard({ task, onToggleStatus, onEdit, onDelete }) {
  const isCompleted = task.status.toLowerCase() === 'completed';

  // Format date nicely (e.g., Nov 14, 2026)
  const formatDueDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Determine if task is overdue
  const isOverdue = () => {
    if (isCompleted || !task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  return (
    <div className={`task-card ${isCompleted ? 'task-card-completed' : ''}`}>
      {/* Top row: Priority badge & Status badge */}
      <div className="task-card-header">
        <div className="task-badges">
          <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
            {task.priority} Priority
          </span>
          <span className={`status-badge status-${task.status.toLowerCase()}`}>
            {isCompleted ? (
              <>
                <CheckCircle size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Completed
              </>
            ) : (
              <>
                <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Pending
              </>
            )}
          </span>
        </div>

        {/* Action icons: Edit & Delete */}
        <div className="task-card-tools">
          <button
            className="action-icon-btn edit-btn"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label="Edit task"
          >
            <Pencil size={16} />
          </button>
          <button
            className="action-icon-btn delete-btn"
            onClick={() => onDelete(task)}
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Task Content */}
      <div className="task-body">
        <h3 className={`task-title ${isCompleted ? 'text-strikethrough' : ''}`}>
          {task.title}
        </h3>
        <p className="task-description">
          {task.description || <em>No description provided</em>}
        </p>
      </div>

      {/* Bottom Footer: Due Date & Status Toggle Button */}
      <div className="task-card-footer">
        <div className={`due-date-wrapper ${isOverdue() ? 'date-overdue' : ''}`}>
          <Calendar size={14} className="calendar-icon" />
          <span>Due: {formatDueDate(task.dueDate)}</span>
          {isOverdue() && (
            <span className="overdue-tag" title="This task is past its due date">
              <AlertCircle size={12} style={{ display: 'inline', marginRight: '2px' }} />
              Overdue
            </span>
          )}
        </div>

        {/* Toggle Status Button (onClick) */}
        <button
          className={`toggle-status-btn ${isCompleted ? 'btn-reopen' : 'btn-complete'}`}
          onClick={() => onToggleStatus(task.id)}
          title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
        >
          {isCompleted ? (
            <>
              <RotateCcw size={14} />
              <span>Mark Pending</span>
            </>
          ) : (
            <>
              <CheckCircle size={14} />
              <span>Mark Completed</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default TaskCard;

