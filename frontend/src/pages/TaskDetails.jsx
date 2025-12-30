import { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import DeleteModal from '../components/DeleteModal';
import TaskModal from '../components/TaskModal';
import { useAuth } from '../context/AuthContext';

const priorityColors = {
  Low: 'bg-[#10B981] text-black border-black',
  Medium: 'bg-[#3B82F6] text-white border-black',
  High: 'bg-[#EF4444] text-white border-black',
};

const statusColors = {
  Pending: 'bg-gray-200 text-black border-black',
  'In Progress': 'bg-[#FBBF24] text-black border-black',
  Completed: 'bg-[#10B981] text-black border-black',
};

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await taskAPI.getById(id);
      setTask(response.data.data);
    } catch (error) {
      toast.error('Failed to load task');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await taskAPI.updateStatus(id, newStatus);
      toast.success('Status updated successfully!');
      fetchTask();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await taskAPI.delete(id);
      toast.success('Task deleted successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const canEdit = isAdmin() || (task && (
    Array.isArray(task.assignedTo) 
      ? task.assignedTo.some(u => u._id === user?._id)
      : task.assignedTo?._id === user?._id
  ));

  if (loading) {
    return <Loader />;
  }

  if (!task) {
    return null;
  }

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="text-black hover:text-[#8B5CF6] font-black uppercase inline-flex items-center transition underline decoration-2 decoration-black hover:decoration-[#8B5CF6] underline-offset-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-3xl font-black text-black uppercase italic">{task.title}</h1>
              <span className={`px-3 py-1 text-sm font-black uppercase border-2 ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <span className={`px-3 py-1 text-sm font-black uppercase border-2 ${statusColors[task.status]}`}>
                {task.status}
              </span>
            </div>
          </div>
          {canEdit && (
            <div className="flex space-x-3">
              {isAdmin() && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 bg-[#8B5CF6] text-white font-black uppercase border-2 border-black hover:bg-[#7C3AED] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none"
                >
                  Edit
                </button>
              )}
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-[#EF4444] text-white font-black uppercase border-2 border-black hover:bg-red-600 hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {task.description && (
          <div className="mb-6">
            <h2 className="text-lg font-black text-black mb-2 uppercase border-b-2 border-black inline-block pr-4">Description</h2>
            <p className="text-gray-600 whitespace-pre-wrap font-bold mt-2 pl-4 border-l-4 border-gray-200">{task.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 border-2 border-black p-4 shadow-[4px_4px_0_0_#000]">
            <h3 className="text-sm font-black text-black mb-1 uppercase">Due Date</h3>
            <p className={`text-lg font-bold ${isOverdue ? 'text-red-600' : 'text-black'}`}>
              {format(new Date(task.dueDate), 'EEEE, MMMM dd, yyyy').toUpperCase()}
            </p>
            {isOverdue && (
              <p className="text-sm text-red-600 mt-1 font-black bg-red-100 border-2 border-red-500 inline-block px-2 uppercase">⚠️ Overdue</p>
            )}
          </div>

          <div className="bg-gray-50 border-2 border-black p-4 shadow-[4px_4px_0_0_#000]">
            <h3 className="text-sm font-black text-black mb-1 uppercase">Assigned To</h3>
            {Array.isArray(task.assignedTo) && task.assignedTo.length > 0 ? (
              <div className="space-y-2">
                {task.assignedTo.map(user => (
                  <div key={user._id} className="border-b-2 border-gray-200 last:border-0 pb-1 last:pb-0">
                    <p className="text-lg font-bold text-black uppercase">{user.name}</p>
                    <p className="text-sm text-gray-500 font-mono font-bold uppercase">{user.email}</p>
                  </div>
                ))}
              </div>
            ) : (
                <>
                  <p className="text-lg font-bold text-black uppercase">{task.assignedTo?.name || 'Unassigned'}</p>
                  <p className="text-sm text-gray-500 font-mono font-bold uppercase">{task.assignedTo?.email}</p>
                </>
            )}
          </div>

          <div className="bg-gray-50 border-2 border-black p-4 shadow-[4px_4px_0_0_#000]">
            <h3 className="text-sm font-black text-black mb-1 uppercase">Created By</h3>
            <p className="text-lg font-bold text-black uppercase">{task.createdBy.name}</p>
            <p className="text-sm text-gray-500 font-bold uppercase">{format(new Date(task.createdAt), 'MMM dd, yyyy').toUpperCase()}</p>
          </div>

          <div className="bg-gray-50 border-2 border-black p-4 shadow-[4px_4px_0_0_#000]">
            <h3 className="text-sm font-black text-black mb-1 uppercase">Last Updated</h3>
            <p className="text-lg font-bold text-black uppercase">
              {format(new Date(task.updatedAt), 'MMM dd, yyyy HH:mm').toUpperCase()}
            </p>
          </div>
        </div>

        {/* Status Management */}
        {canEdit && task.status !== 'Completed' && (
          <div className="mb-6 p-4 bg-white border-2 border-black rounded-none shadow-[4px_4px_0_0_#000]">
            <h3 className="text-sm font-black text-black mb-3 uppercase">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {['Pending', 'In Progress', 'Completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-4 py-2 font-black uppercase border-2 border-black transition-all ${
                    task.status === status
                      ? 'bg-[#8B5CF6] text-white shadow-[4px_4px_0_0_#000] translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-white text-black hover:bg-gray-100 hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Status History Timeline */}
        {task.statusHistory && task.statusHistory.length > 0 && (
          <div>
            <h2 className="text-lg font-black text-black mb-4 uppercase">Status History</h2>
            <div className="space-y-4">
              {task.statusHistory
                .slice()
                .reverse()
                .map((history, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="flex-shrink-0 relative">
                      <div className={`w-4 h-4 border-2 border-black z-10 relative ${
                        history.status === 'Completed' ? 'bg-[#10B981]' :
                        history.status === 'In Progress' ? 'bg-[#FBBF24]' :
                        'bg-gray-300'
                      }`}></div>
                      {index < task.statusHistory.length - 1 && (
                        <div className="absolute top-4 left-[6px] w-0.5 h-full bg-black -z-0"></div>
                      )}
                    </div>
                    <div className="ml-4 flex-1 bg-white border-2 border-black p-3 shadow-[4px_4px_0_0_#000] mb-2 group-last:mb-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-black text-black uppercase">{history.status}</p>
                          {history.changedBy && (
                            <p className="text-xs text-gray-500 font-bold uppercase">
                              by {history.changedBy.name}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-mono font-bold uppercase">
                          {format(new Date(history.changedAt), 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        taskId={task._id}
        onSuccess={fetchTask}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default TaskDetails;

