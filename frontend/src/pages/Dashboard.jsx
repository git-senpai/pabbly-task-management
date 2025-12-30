import { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import DeleteModal from '../components/DeleteModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';

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
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const TASKS_PER_PAGE_LIST = 6;

  // Filters
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    startDate: '',
    endDate: '',
    sortBy: 'latest',
  });

  const fetchTasks = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit: TASKS_PER_PAGE_LIST,
        ...filters,
      };
      Object.keys(params).forEach(key => { if (params[key] === '') delete params[key]; });
      
      const response = await taskAPI.getAll(params);
      setTasks(response.data.data);
      
      if (response.data.pagination) {
        setHasMore(response.data.pagination.page < response.data.pagination.pages);
      } else {
         setHasMore(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load tasks';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    setPage(1);
    fetchTasks(1);
  }, [filters, fetchTasks]);

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTasks(nextPage);
  };

  const handlePrevPage = () => {
    if (page > 1) {
        const prevPage = page - 1;
        setPage(prevPage);
        fetchTasks(prevPage);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      toast.success('Status updated successfully!');
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
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
      setTasks(prev => prev.filter(t => t._id !== taskToDelete._id));
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  const visibleTasks = searchQuery 
    ? tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : tasks;

  return (
    <div className="h-[calc(100vh-theme(spacing.24))] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-1">
          <div>
            <h1 className="text-4xl font-black text-black italic uppercase tracking-tighter">Dashboard</h1>
            <p className="text-gray-600 font-bold mt-1 uppercase text-sm">Task Overview</p>
          </div>
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsModalOpen(true);
            }}
            className="px-5 py-3 bg-[#FBBF24] text-black border-2 border-black font-black uppercase tracking-wider shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 transition-all flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000] p-4 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="SEARCH TASKS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border-2 border-black text-sm text-black font-bold placeholder-gray-500 focus:shadow-[2px_2px_0_0_#000] outline-none transition-shadow"
                        />
                    </div>
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex gap-2 items-center px-4 py-2 border-2 text-sm font-black uppercase transition-all ${
                        showFilters || activeFiltersCount > 0 
                            ? 'bg-black border-black text-white' 
                            : 'bg-white border-black text-black hover:bg-gray-50'
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                    {activeFiltersCount > 0 && (
                        <span className="bg-[#EF4444] text-white text-xs border border-white w-5 h-5 flex items-center justify-center font-bold">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>
            </div>

            {showFilters && (
                <div className="mt-4 pt-4 border-t-2 border-black grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div>
                        <label className="block text-xs font-black text-black uppercase mb-1.5">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 bg-white border-2 border-black text-sm font-bold focus:shadow-[2px_2px_0_0_#000] outline-none"
                        >
                            <option value="">ALL</option>
                            <option value="High">HIGH</option>
                            <option value="In Progress">IN PROGRESS</option>
                            <option value="Completed">COMPLETED</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-xs font-black text-black uppercase mb-1.5">Date Range</label>
                         <div className="flex gap-2">
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                className="w-full px-3 py-2 bg-white border-2 border-black text-sm font-bold focus:shadow-[2px_2px_0_0_#000] outline-none"
                            />
                            <span className="text-black font-black self-center">-</span>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                className="w-full px-3 py-2 bg-white border-2 border-black text-sm font-bold focus:shadow-[2px_2px_0_0_#000] outline-none"
                            />
                         </div>
                    </div>
                </div>
            )}
        </div>

        {/* List Content */}
        {loading ? (
             <LoadingSkeleton />
        ) : (
            <div className="flex-1 flex flex-col min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-6 px-1">
                    {visibleTasks.map(task => (
                        <div key={task._id} className="h-full">
                            <TaskCard 
                                task={task} 
                                onStatusChange={handleStatusChange} 
                                onDelete={handleDelete} 
                                onEdit={handleEdit} 
                            />
                        </div>
                    ))}
                    {visibleTasks.length === 0 && (
                        <div className="col-span-full h-64 flex items-center justify-center border-2 border-dashed border-black">
                            <p className="text-gray-500 font-bold uppercase tracking-widest">No tasks found</p>
                        </div>
                    )}
                </div>
                
                {/* Pagination / Prev Next */}
                <div className="flex justify-center p-6 gap-6 items-center border-t-2 border-black mt-auto bg-white">
                     <button
                        onClick={handlePrevPage}
                        disabled={page === 1 || loading}
                        className="px-6 py-2 bg-white text-black font-black uppercase border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-[4px_4px_0_0_#000] disabled:translate-x-0 disabled:translate-y-0"
                     >
                        Previous
                     </button>
                     <span className="font-mono font-black text-xl bg-black text-white px-4 py-2 rotate-2">
                        PAGE {page}
                     </span>
                     <button
                        onClick={handleNextPage}
                        disabled={!hasMore || loading}
                        className="px-6 py-2 bg-[#FBBF24] text-black font-black uppercase border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-[4px_4px_0_0_#000] disabled:translate-x-0 disabled:translate-y-0"
                     >
                        Next
                     </button>
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
          onSuccess={() => {
              setPage(1);
              fetchTasks(1);
          }}
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
