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
    assignedTo: [],
  });
  const [searchQuery, setSearchQuery] = useState('');

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
          assignedTo: isAdmin() ? [] : (user?._id ? [user._id] : []),
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
      // Handle legacy single assignee if necessary, though backend migrates nicely usually
      // Ideally backend returns array now.
      const assignedIds = Array.isArray(task.assignedTo) 
        ? task.assignedTo.map(u => u._id) 
        : (task.assignedTo ? [task.assignedTo._id] : []);
        
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: formatDateForInput(task.dueDate),
        priority: task.priority,
        assignedTo: assignedIds,
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] rounded-none max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
            <h2 className="text-2xl font-black italic text-black uppercase tracking-wider">
              {taskId ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              className="text-black hover:text-white transition hover:bg-[#EF4444] p-1 border-2 border-transparent hover:border-black"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-black text-black mb-2 uppercase">
                Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border-2 border-black text-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all placeholder-gray-400 font-bold rounded-none"
                placeholder="ENTER TASK TITLE"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-black mb-2 uppercase">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 bg-white border-2 border-black text-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all placeholder-gray-400 font-bold rounded-none"
                placeholder="ENTER TASK DESCRIPTION"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  required
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border-2 border-black text-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all font-bold rounded-none"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase">
                  Priority *
                </label>
                <select
                  name="priority"
                  required
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border-2 border-black text-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all font-bold rounded-none"
                >
                  <option value="Low">LOW</option>
                  <option value="Medium">MEDIUM</option>
                  <option value="High">HIGH</option>
                </select>
              </div>
            </div>

            <div>
                <label className="block text-sm font-black text-black mb-2 uppercase flex justify-between items-center">
                <span>Assign To *</span>
                {isAdmin() && (
                  <button
                    type="button"
                    onClick={() => {
                      const nonAdminUsers = users.filter(u => u.role !== 'admin').map(u => u._id);
                      setFormData(prev => ({ ...prev, assignedTo: nonAdminUsers }));
                    }}
                    className="text-xs bg-black text-white px-2 py-1 font-bold uppercase hover:bg-gray-800 transition-colors"
                  >
                    Assign All
                  </button>
                )}
              </label>
              {isAdmin() ? (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="SEARCH USERS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 mb-2 bg-white border-2 border-black text-black text-sm font-bold placeholder-gray-400 focus:outline-none focus:shadow-[2px_2px_0_0_#000] rounded-none uppercase"
                  />
                  {/* ... */}
                  <div className="w-full px-4 py-2 bg-white border-2 border-black text-black max-h-32 overflow-y-auto rounded-none">
                    {users
                      .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((user) => (
                      <label key={user._id} className="flex items-center space-x-3 py-1 cursor-pointer hover:bg-gray-100 -mx-2 px-2">
                        <input
                          type="checkbox"
                          value={user._id}
                          checked={formData.assignedTo.includes(user._id)}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              assignedTo: e.target.checked
                                ? [...prev.assignedTo, value]
                                : prev.assignedTo.filter(id => id !== value)
                            }));
                          }}
                          className="appearance-none h-4 w-4 border-2 border-black bg-white checked:bg-[#8B5CF6] checked:border-black focus:ring-0 focus:ring-offset-0 rounded-none cursor-pointer"
                        />
                        <span className="text-sm font-bold">{user.name}</span>
                        <span className="text-xs text-gray-500 font-mono">({user.email})</span>
                      </label>
                    ))}
                  </div>
                  {formData.assignedTo.length === 0 && (
                    <p className="text-xs text-red-600 mt-1 font-black uppercase border-2 border-red-600 inline-block px-1 bg-red-100">SELECT AT LEAST ONE</p>
                  )}
                </div>
              ) : null}
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border-2 border-black text-black font-black uppercase hover:bg-gray-100 hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all rounded-none"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#FBBF24] text-black font-black uppercase border-2 border-black hover:bg-[#F59E0B] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
              >
                {loading ? 'SAVING...' : taskId ? 'UPDATE TASK' : 'CREATE TASK'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

