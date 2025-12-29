import { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import DeleteModal from '../components/DeleteModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';

const priorityColors = {
  Low: 'bg-green-500',
  Medium: 'bg-blue-500',
  High: 'bg-orange-500',
  Urgent: 'bg-red-500',
};

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    startDate: '',
    endDate: '',
    sortBy: 'latest',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await taskAPI.getAll(params);
      
      if (response.data && response.data.data) {
        setTasks(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages,
        }));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load tasks';
      toast.error(errorMessage);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  // Debounce filter changes and reset to page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.priority, filters.status, filters.startDate, filters.endDate, filters.sortBy]);

  // Fetch tasks when filters, page, or limit changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      toast.success('Status updated successfully!');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await taskAPI.delete(taskToDelete._id);
      toast.success('Task deleted successfully!');
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({
      ...prev,
      limit: parseInt(newLimit),
      page: 1, // Reset to first page when limit changes
    }));
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.pages;
    const currentPage = pagination.page;

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, current page, and pages around current
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.priority]) {
      acc[task.priority] = [];
    }
    acc[task.priority].push(task);
    return acc;
  }, {});

  const priorities = ['Urgent', 'High', 'Medium', 'Low'];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and track your tasks</p>
        </div>
        <button
          onClick={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-lg"
        >
          + Create Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="latest">Latest</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && <LoadingSkeleton />}

      {/* Task Lists by Priority */}
      {!loading && (
        <div className="space-y-6">
          {priorities.map((priority) => {
            const priorityTasks = groupedTasks[priority] || [];
            // Hide priority section if no tasks AND (no priority filter OR filter doesn't match this priority)
            if (priorityTasks.length === 0 && (!filters.priority || filters.priority !== priority)) {
              return null;
            }

            return (
              <div key={priority} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-3 h-3 rounded-full ${priorityColors[priority]} mr-3`}></div>
                  <h2 className="text-xl font-semibold text-gray-900">{priority} Priority</h2>
                  <span className="ml-3 px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
                    {priorityTasks.length}
                  </span>
                </div>

                {priorityTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tasks in this priority</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {priorityTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {tasks.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">No tasks found</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Create your first task
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.total > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Pagination Info */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Showing <span className="font-semibold">
                  {tasks.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}
                </span> to{' '}
                <span className="font-semibold">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span> of{' '}
                <span className="font-semibold">{pagination.total}</span> tasks
              </span>
              
              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Show:</label>
                <select
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={loading}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>
            </div>

            {/* Pagination Buttons */}
            {pagination.pages > 1 && (
              <div className="flex items-center space-x-1">
                {/* First Page */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page === 1 || loading}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition text-sm"
                  title="First page"
                >
                  ««
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition text-sm"
                  title="Previous page"
                >
                  ‹
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((pageNum, index) => {
                  if (pageNum === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={loading}
                      className={`px-3 py-2 border rounded-lg transition text-sm ${
                        pagination.page === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Page */}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages || loading}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition text-sm"
                  title="Next page"
                >
                  ›
                </button>

                {/* Last Page */}
                <button
                  onClick={() => handlePageChange(pagination.pages)}
                  disabled={pagination.page === pagination.pages || loading}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition text-sm"
                  title="Last page"
                >
                  »»
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        taskId={selectedTask?._id}
        onSuccess={fetchTasks}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Dashboard;

