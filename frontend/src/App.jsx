import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskStats from './components/TaskStats';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { 
  fetchTasks, 
  fetchTaskStats, 
  createTask, 
  updateTask, 
  deleteTask, 
  toggleTaskStatus 
} from './services/graphqlService';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './App.css';

/**
 * App Component (Stateful Root Component)
 * 
 * Demonstrates:
 * - Stateful Component: Coordinates entire application state using `useState` hooks.
 * - Side Effects: Uses `useEffect` to fetch initial data from the GraphQL backend via Fetch API.
 * - Props Passing: Passes state and action callbacks down to stateless child components.
 * - Comprehensive event handling (onClick, onChange, onSubmit).
 */
function App() {
  // 1. Core Data State
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, highPriority: 0 });
  const [loading, setLoading] = useState(true);

  // 2. Filter & Search State
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 3. UI Modal & Interaction State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 4. Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Fetch Tasks and Statistics from GraphQL Server
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedTasks, fetchedStats] = await Promise.all([
        fetchTasks({
          status: statusFilter !== 'All' ? statusFilter : undefined,
          priority: priorityFilter !== 'All' ? priorityFilter : undefined,
          search: searchQuery.trim() !== '' ? searchQuery : undefined,
        }),
        fetchTaskStats(),
      ]);

      setTasks(fetchedTasks);
      setStats(fetchedStats);
    } catch (error) {
      console.error('Error fetching data from GraphQL:', error);
      showToast('Could not connect to GraphQL backend. Is the server running?', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter, searchQuery]);

  // Initial fetch and fetch whenever filters/search change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler: Toggle Task Status (Pending <-> Completed)
  const handleToggleStatus = async (id) => {
    try {
      const updatedTask = await toggleTaskStatus(id);
      
      // Update local task in state for immediate feedback
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: updatedTask.status } : t))
      );

      // Refresh statistics
      const updatedStats = await fetchTaskStats();
      setStats(updatedStats);

      showToast(`Task marked as ${updatedTask.status}!`, 'success');
    } catch (error) {
      console.error('Failed to toggle status:', error);
      showToast('Failed to update status on server.', 'error');
    }
  };

  // Handler: Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsFormModalOpen(true);
  };

  // Handler: Open Edit Modal
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  };

  // Handler: Save Task (Create or Update mutation)
  const handleSaveTask = async (formData) => {
    if (editingTask) {
      // Update Mutation
      const updated = await updateTask(editingTask.id, {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        status: formData.status,
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      showToast('Task updated successfully!', 'success');
    } else {
      // Create Mutation
      const created = await createTask({
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        priority: formData.priority,
        status: formData.status || 'Pending',
      });

      // Insert at the beginning of the list
      setTasks((prev) => [created, ...prev]);
      showToast('New task added successfully!', 'success');
    }

    // Refresh stats and close modal
    const updatedStats = await fetchTaskStats();
    setStats(updatedStats);
    setIsFormModalOpen(false);
    setEditingTask(null);
  };

  // Handler: Initiate Task Deletion
  const handlePromptDelete = (task) => {
    setTaskToDelete(task);
  };

  // Handler: Confirm and Execute Deletion Mutation
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      setIsDeleting(true);
      await deleteTask(taskToDelete.id);

      // Remove from state
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));

      // Refresh stats
      const updatedStats = await fetchTaskStats();
      setStats(updatedStats);

      showToast('Task deleted successfully.', 'info');
      setTaskToDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('Failed to delete task.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-content">
            {toast.type === 'success' && <CheckCircle2 size={18} className="toast-icon" />}
            {toast.type === 'error' && <AlertCircle size={18} className="toast-icon" />}
            {toast.type === 'info' && <Info size={18} className="toast-icon" />}
            <span>{toast.message}</span>
          </div>
          <button 
            className="toast-close" 
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Sidebar: Stateless component for filtering */}
      <Sidebar
        currentStatus={statusFilter}
        onStatusChange={setStatusFilter}
        currentPriority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        stats={stats}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-viewport">
        {/* Header: Stateless component with search and action button */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNewTaskModal={handleOpenCreateModal}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <main className="dashboard-content">
          {/* Summary Statistics Cards: Stateless component */}
          <TaskStats
            stats={stats}
            activeStatus={statusFilter}
            onSelectStatus={setStatusFilter}
          />

          {/* Task List Grid / Empty State: Stateless component */}
          <TaskList
            tasks={tasks}
            loading={loading}
            onToggleStatus={handleToggleStatus}
            onEdit={handleOpenEditModal}
            onDelete={handlePromptDelete}
            onAddNew={handleOpenCreateModal}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            searchQuery={searchQuery}
          />
        </main>
      </div>

      {/* Add / Edit Task Modal: Stateful Component */}
      <TaskForm
        isOpen={isFormModalOpen}
        initialTask={editingTask}
        onSave={handleSaveTask}
        onCancel={() => {
          setIsFormModalOpen(false);
          setEditingTask(null);
        }}
      />

      {/* Delete Confirmation Modal: Stateless Component */}
      <DeleteConfirmModal
        isOpen={Boolean(taskToDelete)}
        taskTitle={taskToDelete?.title || ''}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
}

export default App;
