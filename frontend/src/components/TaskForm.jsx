import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Calendar, Flag, FileText } from 'lucide-react';

/**
 * TaskForm Component (Stateful Component)
 * 
 * Demonstrates:
 * - Stateful component: Manages internal state with `useState` hook for:
 *   - formData (title, description, dueDate, priority, status)
 *   - validation errors
 *   - submission loading state
 * - Event handling:
 *   - onChange: updates form field states dynamically
 *   - onSubmit: intercepts default browser submission with e.preventDefault(),
 *     validates required fields, and triggers GraphQL mutation
 *   - onClick: closes modal and resets form
 * - Reusable for both "Add Task" and "Edit Task" workflows using props (initialTask).
 */
function TaskForm({ initialTask, onSave, onCancel, isOpen }) {
  // 1. Stateful Form Values
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Pending',
  });

  // 2. Stateful Validation Errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if initialTask changes (for editing) or reset for new task
  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        dueDate: initialTask.dueDate ? initialTask.dueDate.substring(0, 10) : '',
        priority: initialTask.priority || 'Medium',
        status: initialTask.status || 'Pending',
      });
    } else {
      // Default due date to 3 days from today
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 3);
      const formattedDate = defaultDate.toISOString().substring(0, 10);

      setFormData({
        title: '',
        description: '',
        dueDate: formattedDate,
        priority: 'Medium',
        status: 'Pending',
      });
    }
    setErrors({});
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  // Handle Input Changes (onChange event handler)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required.';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title should be at least 3 characters long.';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required.';
    }

    return newErrors;
  };

  // Form Submission (onSubmit event handler)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData);
    } catch (err) {
      console.error('Submission error:', err);
      setErrors({ form: err.message || 'Failed to save task.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = Boolean(initialTask && initialTask.id);

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} /* Prevent closing when clicking modal interior */
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
            <p className="modal-subtitle">
              {isEditing
                ? 'Update task details, deadline, or priority'
                : 'Fill in the information below to add a new academic task'}
            </p>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body with onSubmit event handler */}
        <form onSubmit={handleSubmit} className="task-form">
          {errors.form && (
            <div className="form-error-banner">
              <AlertCircle size={16} />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Title Input */}
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Task Title <span className="required-asterisk">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Complete Cloud Computing Lab Report"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              autoFocus
            />
            {errors.title && <span className="field-error-msg">{errors.title}</span>}
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label htmlFor="task-desc" className="form-label">
              <FileText size={15} style={{ display: 'inline', marginRight: '4px' }} />
              Description
            </label>
            <textarea
              id="task-desc"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add key details, links, or notes for this task..."
              rows={3}
              className="form-textarea"
            />
          </div>

          {/* Two-Column Row: Due Date & Priority */}
          <div className="form-row">
            {/* Due Date */}
            <div className="form-group flex-1">
              <label htmlFor="task-dueDate" className="form-label">
                <Calendar size={15} style={{ display: 'inline', marginRight: '4px' }} />
                Due Date <span className="required-asterisk">*</span>
              </label>
              <input
                id="task-dueDate"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`form-input ${errors.dueDate ? 'input-error' : ''}`}
              />
              {errors.dueDate && <span className="field-error-msg">{errors.dueDate}</span>}
            </div>

            {/* Priority */}
            <div className="form-group flex-1">
              <label htmlFor="task-priority" className="form-label">
                <Flag size={15} style={{ display: 'inline', marginRight: '4px' }} />
                Priority Level
              </label>
              <select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Status (If editing) */}
          {isEditing && (
            <div className="form-group">
              <label htmlFor="task-status" className="form-label">
                Status
              </label>
              <select
                id="task-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <Save size={18} />
              <span>{isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;

