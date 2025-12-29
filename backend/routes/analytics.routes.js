import express from 'express';
import Task from '../models/Task.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/analytics/dashboard-stats
// @desc    Get aggregated statistics for dashboard
// @access  Private
router.get('/dashboard-stats', async (req, res) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    // Base match stage for aggregation
    const matchStage = { isDeleted: false };
    
    // If not admin, only match tasks assigned to user or created by user? 
    // Usually analytics might be personal or global for admin. 
    // Let's assume: Admin sees ALL, User sees THEIR assigned tasks.
    if (!isAdmin) {
      matchStage.assignedTo = userId;
    }

    // 1. Status Counts
    const statusStats = await Task.aggregate([
      { $match: matchStage },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Format status stats
    const allowedStatuses = ['Pending', 'In Progress', 'Completed'];
    const statusData = allowedStatuses.map(status => {
      const found = statusStats.find(s => s._id === status);
      return { name: status, value: found ? found.count : 0 };
    });

    // 2. Priority Counts
    const priorityStats = await Task.aggregate([
      { $match: matchStage },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const allowedPriorities = ['Low', 'Medium', 'High', 'Urgent'];
    const priorityData = allowedPriorities.map(priority => {
      const found = priorityStats.find(p => p._id === priority);
      return { name: priority, value: found ? found.count : 0 };
    });

    // 3. Overall numbers
    const totalTasks = await Task.countDocuments(matchStage);
    const completedTasks = await Task.countDocuments({ ...matchStage, status: 'Completed' });
    
    // 4. Overdue Tasks
    const overdueTasks = await Task.countDocuments({
      ...matchStage,
      status: { $ne: 'Completed' },
      dueDate: { $lt: new Date() }
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        completionRate,
        overdueTasks,
        statusDistribution: statusData,
        priorityDistribution: priorityData,
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

export default router;
