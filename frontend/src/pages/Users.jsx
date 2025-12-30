import { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import DeleteModal from '../components/DeleteModal';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await userAPI.create(formData);
      toast.success('User created successfully!');
      setIsCreateModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create user';
      toast.error(message);
    }
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await userAPI.delete(userToDelete._id);
      toast.success('User deleted successfully!');
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user';
      toast.error(message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-black italic text-black uppercase tracking-tighter drop-shadow-[2px_2px_0_#fff]">User Management</h1>
          <p className="text-gray-600 font-bold uppercase tracking-widest text-xs mt-1">Manage system users</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-[#FBBF24] text-black font-black uppercase tracking-wider border-2 border-black hover:bg-[#F59E0B] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none rounded-none"
        >
          + Add User
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000]">
          <table className="min-w-full divide-y-2 divide-black">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider border-r-2 border-black">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider border-r-2 border-black">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider border-r-2 border-black">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y-2 divide-black">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap border-r-2 border-black">
                    <div className="text-sm font-bold text-black uppercase">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r-2 border-black">
                    <div className="text-sm text-gray-600 font-mono font-bold uppercase">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r-2 border-black">
                    <span
                      className={`px-2 py-1 text-xs font-black uppercase border-2 border-black ${
                        user.role === 'admin'
                          ? 'bg-[#C4B5FD] text-black'
                          : 'bg-gray-200 text-black'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user._id !== currentUser?._id && (
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-[#EF4444] hover:text-white hover:bg-[#EF4444] px-2 py-1 font-black uppercase transition border-2 border-transparent hover:border-black"
                      >
                        Delete
                      </button>
                    )}
                    {user._id === currentUser?._id && (
                      <span className="text-gray-400 font-black italic uppercase border-2 border-gray-200 px-2 py-1">Current User</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12 border-t-2 border-black">
              <p className="text-gray-500 font-bold uppercase tracking-widest">No users found</p>
            </div>
          )}
        </div>
      )}

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] max-w-md w-full p-6 transition-transform">
            <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
              <h2 className="text-2xl font-black italic text-black uppercase tracking-wider">Create New User</h2>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setFormData({ name: '', email: '', password: '', role: 'user' });
                }}
                className="text-black hover:text-white transition hover:bg-[#EF4444] p-1 border-2 border-transparent hover:border-black"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white border-2 border-black text-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all placeholder-gray-400 font-bold rounded-none"
                  placeholder="ENTER USER NAME"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white border-2 border-black text-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all placeholder-gray-400 font-bold rounded-none"
                  placeholder="ENTER USER EMAIL"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 bg-white border-2 border-black text-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all placeholder-gray-400 font-bold rounded-none"
                  placeholder="ENTER PASSWORD (MIN 6 CHARS)"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase">
                  Role *
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 bg-white border-2 border-black text-black focus:outline-none focus:shadow-[4px_4px_0_0_#000] transition-all font-bold rounded-none"
                >
                  <option value="user">USER</option>
                  <option value="admin">ADMIN</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setFormData({ name: '', email: '', password: '', role: 'user' });
                  }}
                  className="px-6 py-2 border-2 border-black text-black font-black uppercase hover:bg-gray-100 hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all rounded-none"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#10B981] text-black font-black uppercase border-2 border-black hover:bg-[#059669] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none rounded-none"
                >
                  CREATE USER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Users;

