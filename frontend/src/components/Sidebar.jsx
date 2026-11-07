import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  AlertTriangle, 
  GraduationCap, 
  X,
  Filter
} from 'lucide-react';

/**
 * Sidebar Component (Stateless / Presentational Component)
 * 
 * Demonstrates:
 * - Functional component receiving props.
 * - Stateless design: does not hold its own state, delegates actions to parent via props.
 * - onClick and onChange event handling for filtering tasks.
 */
function Sidebar({ 
  currentStatus, 
  onStatusChange, 
  currentPriority, 
  onPriorityChange, 
  stats,
  isMobileOpen,
  onCloseMobile
}) {
  const statusOptions = [
    { id: 'All', label: 'All Tasks', icon: ListTodo, count: stats?.total ?? 0, color: 'text-indigo-600' },
    { id: 'Pending', label: 'Pending', icon: Clock, count: stats?.pending ?? 0, color: 'text-amber-500' },
    { id: 'Completed', label: 'Completed', icon: CheckCircle2, count: stats?.completed ?? 0, color: 'text-emerald-500' },
  ];

  const priorityOptions = ['All', 'High', 'Medium', 'Low'];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onCloseMobile}
          aria-label="Close mobile sidebar backdrop"
        />
      )}

      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        {/* Brand / Logo */}
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">
            <GraduationCap className="brand-icon" size={28} />
          </div>
          <div className="brand-text">
            <h2>StudyFlow</h2>
            <p>Student Task Hub</p>
          </div>
          {isMobileOpen && (
            <button 
              className="close-sidebar-btn" 
              onClick={onCloseMobile}
              title="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation / Status Filter Section */}
        <div className="sidebar-section">
          <h3 className="section-title">Task Status</h3>
          <nav className="nav-list">
            {statusOptions.map((item) => {
              const Icon = item.icon;
              const isActive = currentStatus.toLowerCase() === item.id.toLowerCase();
              return (
                <button
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onStatusChange(item.id);
                    if (isMobileOpen && onCloseMobile) onCloseMobile();
                  }}
                >
                  <div className="nav-item-content">
                    <Icon size={18} className={`nav-icon ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className={`badge-count ${isActive ? 'active-count' : ''}`}>
                    {item.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Priority Filter Section */}
        <div className="sidebar-section">
          <div className="section-title-wrapper">
            <h3 className="section-title">
              <Filter size={14} style={{ display: 'inline', marginRight: '6px' }} />
              Filter by Priority
            </h3>
          </div>
          <div className="priority-pills">
            {priorityOptions.map((p) => {
              const isActive = currentPriority.toLowerCase() === p.toLowerCase();
              return (
                <button
                  key={p}
                  className={`priority-pill priority-pill-${p.toLowerCase()} ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onPriorityChange(p);
                    if (isMobileOpen && onCloseMobile) onCloseMobile();
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Viva Quick Note in Sidebar */}
        <div className="sidebar-footer">
          <div className="viva-badge">
            <AlertTriangle size={15} className="viva-icon" />
            <p className="viva-text">
              <strong>FSWD Tech Stack:</strong>
              React + Express + GraphQL + Fetch API
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

