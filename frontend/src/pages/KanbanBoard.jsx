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
    color: 'text-black',
    bg: 'bg-red-50',
    border: 'border-red-500',
    headerBorder: 'border-red-500',
    badge: 'bg-[#EF4444] text-white',
    dots: 'bg-red-200'
  },
  Medium: {
    color: 'text-black',
    bg: 'bg-blue-100',
    border: 'border-black',
    headerBorder: 'border-black',
    badge: 'bg-[#3B82F6] text-white',
  },
  Low: {
    color: 'text-black',
    bg: 'bg-emerald-100',
    border: 'border-black',
    headerBorder: 'border-black',
    badge: 'bg-[#10B981] text-black',
  },
};

const KanbanBoard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination State (Kanban specific)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const TASKS_PER_PAGE_BOARD = 2; 

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
      const baseParams = {
        page: pageNum,
        limit: TASKS_PER_PAGE_BOARD,
        ...filters,
      };
      Object.keys(baseParams).forEach(key => { if (baseParams[key] === '') delete baseParams[key]; });

      const priorities = ['High', 'Medium', 'Low'];
      const requests = priorities.map(priority => 
        taskAPI.getAll({ ...baseParams, priority })
      );

      const responses = await Promise.all(requests);
      
      let combinedTasks = [];
      let hasAnyMore = false;

      responses.forEach(response => {
        if (response.data && response.data.data) {
          combinedTasks = [...combinedTasks, ...response.data.data];
          if (response.data.pagination && response.data.pagination.page < response.data.pagination.pages) {
               hasAnyMore = true;
          }
        }
      });
      
      if (searchQuery) {
          combinedTasks = combinedTasks.filter(task => 
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
          );
      }
      setTasks(combinedTasks);
      setHasMore(hasAnyMore);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load tasks';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery]);

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
    const updatedTasks = tasks.map(t => 
        t._id === draggableId ? { ...t, priority: newPriority } : t
    );
    setTasks(updatedTasks);

    try {
        await taskAPI.update(draggableId, { priority: newPriority });
        toast.success(`Moved to ${newPriority} Priority`);
    } catch (error) {
        toast.error('Failed to update task priority');
        fetchTasks(page); 
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

  const visibleTasks = tasks; // Search applied in fetch for simplicity of existing logic
  
  const groupedTasks = {
    High: visibleTasks.filter(t => t.priority === 'High'),
    Medium: visibleTasks.filter(t => t.priority === 'Medium'),
    Low: visibleTasks.filter(t => t.priority === 'Low'),
  };

  const priorities = ['High', 'Medium', 'Low'];

  return (
    <div className="h-[calc(100vh-theme(spacing.24))] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-1">
          <div>
            <h1 className="text-4xl font-black text-black italic uppercase tracking-tighter">Priority Board</h1>
            <p className="text-gray-600 font-bold mt-1 uppercase text-sm">Drag and Drop tasks</p>
          </div>
        </div>

        {/* Board Content */}
        {loading ? (
             <LoadingSkeleton />
        ) : (
            <div className="flex-1 flex flex-col min-h-0">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex flex-1 gap-6 overflow-x-auto pb-6 items-start">
                        {priorities.map((priority) => {
                            const config = priorityConfig[priority];
                            return (
                                <div 
                                    key={priority} 
                                    className={`flex-shrink-0 w-80 lg:w-96 flex flex-col max-h-full ${config.border} border-2 ${config.bg} shadow-[4px_4px_0_0_#000] transition-colors`}
                                >
                                    <div className={`p-4 border-b-2 ${config.border} flex justify-between items-center sticky top-0 bg-white z-10`}>
                                        <h3 className={`font-black text-lg ${config.color} uppercase flex items-center gap-2`}>
                                            <span className={`w-3 h-3 border-2 border-black ${config.badge.split(' ')[0]}`}></span>
                                            {priority}
                                        </h3>
                                        <span className={`px-2.5 py-0.5 text-xs font-black uppercase ${config.badge} border-2 border-black`}>
                                            {groupedTasks[priority].length}
                                        </span>
                                    </div>
                                    <Droppable droppableId={priority}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors ${
                                                    snapshot.isDraggingOver ? 'bg-black/5' : ''
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
                                                                        transform: provided.draggableProps.style?.transform,
                                                                    }}
                                                                    className={`group ${snapshot.isDragging ? 'z-50' : ''}`}
                                                                >
                                                                    <TaskCard
                                                                        task={task}
                                                                        onStatusChange={handleStatusChange}
                                                                        onDelete={handleDelete}
                                                                        onEdit={handleEdit}
                                                                        compact={true} 
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                                {groupedTasks[priority].length === 0 && (
                                                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-black/20 m-2">
                                                        <p className="text-black/40 text-sm font-black uppercase">DROP HERE</p>
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
                
                 {/* Pagination / Prev Next */}
                <div className="flex justify-center p-6 gap-6 items-center border-t-2 border-black mt-6 bg-white">
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

export default KanbanBoard;
