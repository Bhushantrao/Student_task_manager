import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  Flame 
} from 'lucide-react';

/**
 * TaskStats Component (Stateless / Presentational Component)
 * 
 * Demonstrates:
 * - Pure component displaying data passed via props.
 * - Dynamic calculation of completion rate.
 * - Interactive onClick cards to filter tasks directly from summary cards.
 */
function TaskStats({ stats, activeStatus, onSelectStatus }) {
  const total = stats?.total || 0;
  const pending = stats?.pending || 0;
  const completed = stats?.completed || 0;
  const highPriority = stats?.highPriority || 0;

  // Completion percentage
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statCards = [
    {
      id: 'All',
      title: 'Total Tasks',
      value: total,
      subtext: `${completionRate}% overall progress`,
      icon: ListTodo,
      variant: 'stat-total',
    },
    {
      id: 'Pending',
      title: 'Pending Tasks',
      value: pending,
      subtext: 'Needs your attention',
      icon: Clock,
      variant: 'stat-pending',
    },
    {
      id: 'Completed',
      title: 'Completed Tasks',
      value: completed,
      subtext: 'Great job!',
      icon: CheckCircle2,
      variant: 'stat-completed',
    },
    {
      id: 'HighPriority',
      title: 'High Priority',
      value: highPriority,
      subtext: 'Urgent submissions',
      icon: Flame,
      variant: 'stat-urgent',
    },
  ];

  return (
    <div className="stats-grid">
      {statCards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeStatus.toLowerCase() === card.id.toLowerCase();

        return (
          <div
            key={card.id}
            className={`stat-card ${card.variant} ${isSelected ? 'stat-card-active' : ''}`}
            onClick={() => {
              if (card.id === 'HighPriority') {
                // Keep status 'All' or whatever user has, or parent can handle
                onSelectStatus('All');
              } else {
                onSelectStatus(card.id);
              }
            }}
            role="button"
            tabIndex={0}
            title={`Click to filter by ${card.title}`}
          >
            <div className="stat-card-header">
              <span className="stat-title">{card.title}</span>
              <div className="stat-icon-wrapper">
                <Icon size={20} />
              </div>
            </div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-subtext">{card.subtext}</div>
          </div>
        );
      })}
    </div>
  );
}

export default TaskStats;

