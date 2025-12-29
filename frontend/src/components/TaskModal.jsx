import { useState, useEffect } from 'react';
import { taskAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const TaskModal = ({ isOpen, onClose, taskId, onSuccess }) => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    assignedTo: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (isAdmin()) {
        fetchUsers();
      }
      
      if (taskId) {
        fetchTask();
      } else {
        // Reset form for new task
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          priority: 'Medium',
          assignedTo: isAdmin() ? '' : (user?._id || ''),
        });
      }
    }
  }, [isOpen, taskId]);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTask = async () => {
    try {
      const response = await taskAPI.getById(taskId);
      const task = response.data.data;
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: formatDateForInput(task.dueDate),
        priority: task.priority,
        assignedTo: task.assignedTo._id,
      });
    } catch (error) {
      toast.error('Failed to load task');
      onClose();
    }
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
      };

      if (taskId) {
        await taskAPI.update(taskId, submitData);
        toast.success('Task updated successfully!');
      } else {
        await taskAPI.create(submitData);
        toast.success('Task created successfully!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {taskId ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder-slate-500"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder-slate-500"
                placeholder="Enter task description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  required
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Priority *
                </label>
                <select
                  name="priority"
                  required
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Assign To *
              </label>
              {isAdmin() ? (
                <select
                  name="assignedTo"
                  required
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="">Select user</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-800/50 text-slate-400"
                />
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
              >
                {loading ? 'Saving...' : taskId ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

