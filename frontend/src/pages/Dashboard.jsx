import { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import DeleteModal from '../components/DeleteModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const priorityConfig = {
  High: {
    color: 'text-orange-400',
    bg: 'bg-orange-500/5',
    border: 'border-orange-500/10',
    headerBorder: 'border-orange-500/50',
    badge: 'bg-orange-500/10 text-orange-400',
  },
  Medium: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/10',
    headerBorder: 'border-blue-500/50',
    badge: 'bg-blue-500/10 text-blue-400',
  },
  Low: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/10',
    headerBorder: 'border-emerald-500/50',
    badge: 'bg-emerald-500/10 text-emerald-400',
  },
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
  
  // Filters and pagination (Pagination disabled for Board view, generally helpful to see all)
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    startDate: '',
    endDate: '',
    sortBy: 'latest',
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      // For Kanban board, we typically want to fetch all relevant tasks or a reasonable batch
      // We'll set a higher limit to ensure the board is populated
      const params = {
        limit: 100, 
        ...filters,
      };
      
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await taskAPI.getAll(params);
      
      if (response.data && response.data.data) {
        let filteredTasks = response.data.data;
        if (searchQuery) {
          filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        setTasks(filteredTasks);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load tasks';
      toast.error(errorMessage);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
    ) {
        return;
    }

    const newPriority = destination.droppableId;
    
    // Optimistic Update
    const updatedTasks = tasks.map(t => 
        t._id === draggableId ? { ...t, priority: newPriority } : t
    );
    setTasks(updatedTasks);

    try {
        await taskAPI.update(draggableId, { priority: newPriority });
        toast.success(`Moved to ${newPriority} Priority`);
    } catch (error) {
        toast.error('Failed to update task priority');
        fetchTasks(); // Revert on failure
    }
  };

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

  // Group tasks by priority
  const groupedTasks = {
    High: tasks.filter(t => t.priority === 'High'),
    Medium: tasks.filter(t => t.priority === 'Medium'),
    Low: tasks.filter(t => t.priority === 'Low'),
  };

  const priorities = ['High', 'Medium', 'Low'];

  return (
    <div className="h-[calc(100vh-theme(spacing.24))] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-1">
          <div>
            <h1 className="text-3xl font-bold text-white">Task Board</h1>
            <p className="text-slate-400 mt-1">Manage tasks by priority</p>
          </div>
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </button>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
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

                {/* Filter Toggles */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex gap-2 items-center px-4 py-2 border rounded-lg text-sm transition-all ${
                        showFilters || activeFiltersCount > 0 
                            ? 'bg-slate-800 border-slate-600 text-white' 
                            : 'border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                    {activeFiltersCount > 0 && (
                        <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        >
                            <option value="High">High</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-xs font-medium text-slate-400 mb-1.5">Date Range</label>
                         <div className="flex gap-2">
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                            <span className="text-slate-500 self-center">-</span>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            />
                         </div>
                    </div>
                </div>
            )}
        </div>

        {/* Kanban Board */}
        {loading ? (
             <LoadingSkeleton />
        ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex flex-1 gap-6 overflow-x-auto pb-6 items-start">
                    {priorities.map((priority) => {
                        const config = priorityConfig[priority];
                        return (
                            <div 
                                key={priority} 
                                className={`flex-shrink-0 w-80 lg:w-96 flex flex-col max-h-full rounded-xl border ${config.border} ${config.bg} backdrop-blur-sm`}
                            >
                                {/* Column Header */}
                                <div className={`p-4 border-b ${config.border} flex justify-between items-center sticky top-0 bg-slate-950/50 backdrop-blur-md rounded-t-xl z-10`}>
                                    <h3 className={`font-bold text-lg ${config.color} flex items-center gap-2`}>
                                        <span className={`w-2 h-2 rounded-full ${config.color.replace('text', 'bg').replace('-400', '-500')}`}></span>
                                        {priority}
                                    </h3>
                                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${config.badge} border ${config.border}`}>
                                        {groupedTasks[priority].length}
                                    </span>
                                </div>

                                {/* Droppable Area */}
                                <Droppable droppableId={priority}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors ${
                                                snapshot.isDraggingOver ? 'bg-slate-800/30' : ''
                                            }`}
                                        >
                                            <div className="flex flex-col gap-3">
                                                {groupedTasks[priority].map((task, index) => (
                                                    <Draggable key={task._id} draggableId={task._id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    transform: snapshot.isDragging 
                                                                        ? `${provided.draggableProps.style?.transform} scale(1.02)` 
                                                                        : provided.draggableProps.style?.transform,
                                                                }}
                                                                className={`group ${snapshot.isDragging ? 'z-50 shadow-2xl ring-2 ring-indigo-500/50 rotate-1' : ''}`}
                                                            >
                                                                <TaskCard
                                                                    task={task}
                                                                    onStatusChange={handleStatusChange}
                                                                    onDelete={handleDelete}
                                                                    onEdit={handleEdit}
                                                                    compact={true} // Add a compact prop if needed or ensure card handles narrow width
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                            
                                            {groupedTasks[priority].length === 0 && (
                                                <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-lg m-2">
                                                    <p className="text-slate-600 text-sm font-medium">Drop items here</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>
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
