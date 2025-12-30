import { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { analyticsAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#10b981']; // Indigo, Amber, Emerald
const PRIORITY_COLORS = {
  Low: '#10b981',
  Medium: '#3b82f6',
  High: '#EF4444',
};

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await analyticsAPI.getStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-black italic text-black uppercase tracking-tighter drop-shadow-[2px_2px_0_#fff]">Analytics Dashboard</h1>
          <p className="text-gray-600 font-bold uppercase tracking-widest text-xs mt-1">Overview of task performance and metrics</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] transition-all">
          <h3 className="text-black text-sm font-black uppercase">Total Tasks</h3>
          <p className="text-4xl font-black text-black mt-2">{stats.totalTasks}</p>
        </div>
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] transition-all">
          <h3 className="text-black text-sm font-black uppercase">Completed Tasks</h3>
          <p className="text-4xl font-black text-[#10B981] mt-2 drop-shadow-[1px_1px_0_#000]">{stats.completedTasks}</p>
        </div>
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] transition-all">
          <h3 className="text-black text-sm font-black uppercase">Completion Rate</h3>
          <p className="text-4xl font-black text-[#8B5CF6] mt-2 drop-shadow-[1px_1px_0_#000]">{stats.completionRate}%</p>
        </div>
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] transition-all">
          <h3 className="text-black text-sm font-black uppercase">Overdue Tasks</h3>
          <p className="text-4xl font-black text-[#EF4444] mt-2 drop-shadow-[1px_1px_0_#000]">{stats.overdueTasks}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_0_#000]">
          <h3 className="text-lg font-black text-black mb-6 uppercase italic">Task Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="#000"
                  strokeWidth={2}
                >
                  {stats.statusDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.name === 'Completed' ? '#10B981' : 
                        entry.name === 'In Progress' ? '#FBBF24' : '#E5E7EB'
                      } 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#000', borderWidth: '2px', color: '#000', boxShadow: '4px 4px 0 0 #000', fontWeight: 'bold' }}
                  itemStyle={{ color: '#000' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontWeight: 'bold', color: '#000' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_0_#000]">
          <h3 className="text-lg font-black text-black mb-6 uppercase italic">Tasks by Priority</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.priorityDistribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#000" tick={{ fill: '#000', fontWeight: 'bold' }} />
                <YAxis stroke="#000" allowDecimals={false} tick={{ fill: '#000', fontWeight: 'bold' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#000', borderWidth: '2px', color: '#000', boxShadow: '4px 4px 0 0 #000' }}
                  itemStyle={{ color: '#000', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" name="Tasks">
                  {stats.priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#6366f1'} stroke="#000" strokeWidth={2} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
