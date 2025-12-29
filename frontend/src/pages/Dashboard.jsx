import { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import DeleteModal from '../components/DeleteModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';

const priorityHeaderColors = {
  Low: 'text-green-700',
  Medium: 'text-blue-700',
  High: 'text-orange-700',
  Urgent: 'text-red-700',
};

const priorityDotColors = {
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
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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
        // Filter by search query on client side if needed
        let filteredTasks = response.data.data;
        if (searchQuery) {
          filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        
        setTasks(filteredTasks);
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
  }, [pagination.page, pagination.limit, filters, searchQuery]);

  // Debounce filter changes and reset to page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.priority, filters.status, filters.startDate, filters.endDate, filters.sortBy, searchQuery]);

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

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
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

  const clearFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({
      ...prev,
      limit: parseInt(newLimit),
      page: 1,
    }));
  };

  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.pages;
    const currentPage = pagination.page;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
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
            <h1 className="text-3xl font-bold text-white">Task Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage and track your tasks</p>
          </div>
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-lg shadow-indigo-500/20"
          >
            + Create Task
          </button>
        </div>

        {/* Compact Filter Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Bar */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Active Filter Pills */}
            {filters.priority && (
              <button
                onClick={() => clearFilter('priority')}
                className="flex gap-2 items-center px-3 py-1.5 border rounded-full text-sm hover:bg-slate-800 bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              >
                Priority: {filters.priority}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {filters.status && (
              <button
                onClick={() => clearFilter('status')}
                className="flex gap-2 items-center px-3 py-1.5 border rounded-full text-sm hover:bg-slate-800 bg-amber-500/10 border-amber-500/20 text-amber-400"
              >
                Status: {filters.status}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {(filters.startDate || filters.endDate) && (
              <button
                onClick={() => {
                  clearFilter('startDate');
                  clearFilter('endDate');
                }}
                className="flex gap-2 items-center px-3 py-1.5 border rounded-full text-sm hover:bg-slate-800 bg-purple-500/10 border-purple-500/20 text-purple-400"
              >
                Date Range
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex gap-2 items-center px-3 py-1.5 border border-slate-700 rounded-full text-sm hover:bg-slate-800 text-slate-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
              </svg>
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="latest">Latest</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Task Lists by Priority */}
        {!loading && (
          <div className="space-y-10">
            {priorities.map((priority) => {
              const priorityTasks = groupedTasks[priority] || [];
              if (priorityTasks.length === 0 && (!filters.priority || filters.priority !== priority)) {
                return null;
              }

              return (
                <div key={priority}>
                  {/* Priority Header */}
                  <div className="flex items-center mb-5">
                    <div className={`w-2 h-2 rounded-full ${priorityDotColors[priority]} mr-3`}></div>
                    <h2 className={`text-xl font-bold ${priorityHeaderColors[priority]}`}>
                      {priority} Priority
                    </h2>
                    <span className="ml-3 px-2.5 py-1 text-xs font-semibold bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                      {priorityTasks.length}
                    </span>
                  </div>

                  {/* Task Grid */}
                  {priorityTasks.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-sm p-8 text-center">
                      <p className="text-slate-500">No tasks in this priority</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {priorityTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onStatusChange={handleStatusChange}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {tasks.length === 0 && (
              <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-lg shadow-sm">
                <p className="text-slate-500 text-lg">No tasks found</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Create your first task
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.total > 0 && (
          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-lg shadow-sm p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400">
                  Showing <span className="font-semibold text-slate-200">
                    {tasks.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}
                  </span> to{' '}
                  <span className="font-semibold text-slate-200">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span> of{' '}
                  <span className="font-semibold text-slate-200">{pagination.total}</span> tasks
                </span>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-400">Show:</label>
                  <select
                    value={pagination.limit}
                    onChange={(e) => handleLimitChange(e.target.value)}
                    className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    disabled={loading}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span className="text-sm text-slate-400">per page</span>
                </div>
              </div>

              {pagination.pages > 1 && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.page === 1 || loading}
                    className="px-3 py-2 border border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 hover:bg-slate-800 hover:text-white transition text-sm"
                    title="First page"
                  >
                    ««
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className="px-3 py-2 border border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 hover:bg-slate-800 hover:text-white transition text-sm"
                    title="Previous page"
                  >
                    ‹
                  </button>
                  {getPageNumbers().map((pageNum, index) => {
                    if (pageNum === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-600">
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
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages || loading}
                    className="px-3 py-2 border border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 hover:bg-slate-800 hover:text-white transition text-sm"
                    title="Next page"
                  >
                    ›
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.pages)}
                    disabled={pagination.page === pagination.pages || loading}
                    className="px-3 py-2 border border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-slate-400 hover:bg-slate-800 hover:text-white transition text-sm"
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
