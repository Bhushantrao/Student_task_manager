import React from 'react';
import { Search, PlusCircle, Menu } from 'lucide-react';

/**
 * Header Component (Stateless / Presentational Component)
 * 
 * Demonstrates:
 * - Functional component with props.
 * - Event handling:
 *   - onChange: triggers live search filtering in parent.
 *   - onClick: opens the Add Task modal.
 */
function Header({
  searchQuery,
  onSearchChange,
  onOpenNewTaskModal,
  onToggleMobileSidebar
}) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="mobile-menu-btn" 
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <div className="header-titles">
          <h1>Student Task Dashboard</h1>
          <p className="header-subtitle">
            Manage your assignments, project deadlines, and study goals effortlessly
          </p>
        </div>
      </div>

      <div className="header-actions">
        {/* Search input with onChange event */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Add Task button with onClick event */}
        <button
          className="btn btn-primary add-task-btn"
          onClick={onOpenNewTaskModal}
        >
          <PlusCircle size={18} />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
}

export default Header;

