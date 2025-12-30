import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import DeleteModal from '../components/DeleteModal';
import TaskModal from '../components/TaskModal';
import { useAuth } from '../context/AuthContext';

const priorityColors = {
  Low: 'bg-green-500/10 text-green-400 border-green-500/20',
  Medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  High: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

const statusColors = {
  Pending: 'bg-slate-700/50 text-slate-300',
  'In Progress': 'bg-amber-500/10 text-amber-500',
  Completed: 'bg-emerald-500/10 text-emerald-500',
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
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
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
          className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center transition"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-3xl font-bold text-white">{task.title}</h1>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <span className={`px-3 py-1 text-sm font-semibold rounded ${statusColors[task.status]}`}>
                {task.status}
              </span>
            </div>
          </div>
          {canEdit && (
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600/90 text-white rounded-lg hover:bg-red-600 transition shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {task.description && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
            <p className="text-slate-300 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Due Date</h3>
            <p className={`text-lg font-semibold ${isOverdue ? 'text-red-400' : 'text-slate-200'}`}>
              {format(new Date(task.dueDate), 'EEEE, MMMM dd, yyyy')}
            </p>
            {isOverdue && (
              <p className="text-sm text-red-400 mt-1">⚠️ Overdue</p>
            )}
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Assigned To</h3>
            {Array.isArray(task.assignedTo) && task.assignedTo.length > 0 ? (
              <div className="space-y-2">
                {task.assignedTo.map(user => (
                  <div key={user._id} className="border-b border-slate-700/50 last:border-0 pb-1 last:pb-0">
                    <p className="text-lg font-semibold text-slate-200">{user.name}</p>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                ))}
              </div>
            ) : (
                <>
                  <p className="text-lg font-semibold text-slate-200">{task.assignedTo?.name || 'Unassigned'}</p>
                  <p className="text-sm text-slate-400">{task.assignedTo?.email}</p>
                </>
            )}
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Created By</h3>
            <p className="text-lg font-semibold text-slate-200">{task.createdBy.name}</p>
            <p className="text-sm text-slate-400">{format(new Date(task.createdAt), 'MMM dd, yyyy')}</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Last Updated</h3>
            <p className="text-lg font-semibold text-slate-200">
              {format(new Date(task.updatedAt), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        </div>

        {/* Status Management */}
        {canEdit && task.status !== 'Completed' && (
          <div className="mb-6 p-4 bg-slate-800/30 border border-slate-800 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Update Status</h3>
            <div className="flex space-x-2">
              {['Pending', 'In Progress', 'Completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    task.status === status
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
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
            <h2 className="text-lg font-semibold text-white mb-4">Status History</h2>
            <div className="space-y-4">
              {task.statusHistory
                .slice()
                .reverse()
                .map((history, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${
                        history.status === 'Completed' ? 'bg-emerald-500' :
                        history.status === 'In Progress' ? 'bg-amber-500' :
                        'bg-slate-500'
                      }`}></div>
                      {index < task.statusHistory.length - 1 && (
                        <div className="w-0.5 h-8 bg-slate-700 ml-1.5"></div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-200">{history.status}</p>
                          {history.changedBy && (
                            <p className="text-xs text-slate-500">
                              by {history.changedBy.name}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {format(new Date(history.changedAt), 'MMM dd, yyyy HH:mm')}
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

