import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Task from '../models/Task.model.js';
import User from '../models/User.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks with pagination, filtering, and sorting
// @access  Private (Users see only their tasks, Admins see all)
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent']),
    query('status').optional().isIn(['Pending', 'In Progress', 'Completed']),
    query('sortBy').optional().isIn(['latest', 'dueDate', 'priority']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Build query
      const query = { isDeleted: false };

      // Users see only their tasks, admins see all
      if (req.user.role !== 'admin') {
        query.assignedTo = req.user._id;
      }

      // Filter by priority
      if (req.query.priority) {
        query.priority = req.query.priority;
      }

      // Filter by status
      if (req.query.status) {
        query.status = req.query.status;
      }

      // Filter by due date range
      if (req.query.startDate || req.query.endDate) {
        query.dueDate = {};
        if (req.query.startDate) {
          query.dueDate.$gte = new Date(req.query.startDate);
        }
        if (req.query.endDate) {
          query.dueDate.$lte = new Date(req.query.endDate);
        }
      }

      // Build sort
      let sort = {};
      switch (req.query.sortBy) {
        case 'dueDate':
          sort = { dueDate: 1 };
          break;
        case 'priority':
          const priorityOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
          sort = { priority: -1 };
          break;
        case 'latest':
        default:
          sort = { createdAt: -1 };
          break;
      }

      const tasks = await Task.find(query)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Task.countDocuments(query);

      res.json({
        success: true,
        data: tasks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }
);

// @route   GET /api/tasks/:id
// @desc    Get single task by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('statusHistory.changedBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check authorization: users can only see their assigned tasks
    if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task',
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private (Admin only for assigning, or self-assignment)
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('dueDate').isISO8601().withMessage('Please provide a valid due date'),
    body('priority').isIn(['Low', 'Medium', 'High', 'Urgent']).withMessage('Invalid priority'),
    body('assignedTo').isArray().withMessage('Please provide an array of user IDs'),
    body('assignedTo.*').isMongoId().withMessage('Invalid user ID'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { title, description, dueDate, priority, assignedTo } = req.body;

      // Check if all assigned users exist
      const assignedUsers = await User.find({ _id: { $in: assignedTo }, isDeleted: false });
      if (assignedUsers.length !== assignedTo.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more assigned users not found',
        });
      }

      // Non-admin users can only assign tasks to themselves (and strictly themselves)
      if (req.user.role !== 'admin') {
        const tryingToAssignOthers = assignedTo.some(id => id !== req.user._id.toString());
         if (tryingToAssignOthers) {
          return res.status(403).json({
            success: false,
            message: 'You can only assign tasks to yourself',
          });
         }
      }

      const task = await Task.create({
        title,
        description,
        dueDate,
        priority,
        assignedTo,
        createdBy: req.user._id,
        statusHistory: [{
          status: 'Pending',
          changedAt: new Date(),
          changedBy: req.user._id,
        }],
      });

      const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

      res.status(201).json({
        success: true,
        data: populatedTask,
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }
);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim(),
    body('dueDate').optional().isISO8601().withMessage('Please provide a valid due date'),
    body('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent']).withMessage('Invalid priority'),
    body('assignedTo').optional().isArray().withMessage('Please provide an array of user IDs'),
    body('assignedTo.*').optional().isMongoId().withMessage('Invalid user ID'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      let task = await Task.findOne({
        _id: req.params.id,
        isDeleted: false,
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      // Check authorization: users can only update their assigned tasks
      // Since assignedTo is array, we check if user ID is in the array
      const isAssigned = task.assignedTo.some(id => id.toString() === req.user._id.toString());
      if (req.user.role !== 'admin' && !isAssigned) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this task',
        });
      }

      const { title, description, dueDate, priority, assignedTo } = req.body;

      // Check if assigned users exist (if being changed)
      if (assignedTo) {
         const assignedUsers = await User.find({ _id: { $in: assignedTo }, isDeleted: false });
         if (assignedUsers.length !== assignedTo.length) {
          return res.status(400).json({
            success: false,
            message: 'One or more assigned users not found',
          });
        }

        // Non-admin users can only assign tasks to themselves
        if (req.user.role !== 'admin') {
           const tryingToAssignOthers = assignedTo.some(id => id !== req.user._id.toString());
           if (tryingToAssignOthers) {
            return res.status(403).json({
              success: false,
              message: 'You can only assign tasks to yourself',
            });
           }
        }
      }

      // Update task
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (dueDate) task.dueDate = dueDate;
      if (priority) task.priority = priority;
      if (assignedTo) task.assignedTo = assignedTo;

      await task.save();

      const updatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

      res.json({
        success: true,
        data: updatedTask,
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }
);

// @route   PATCH /api/tasks/:id/status
// @desc    Update task status
// @access  Private
router.patch(
  '/:id/status',
  [
    body('status').isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const task = await Task.findOne({
        _id: req.params.id,
        isDeleted: false,
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }

      // Check authorization: users can only update their assigned tasks
      if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this task',
        });
      }

      const oldStatus = task.status;
      task.status = req.body.status;

      // Add to status history if status changed
      if (oldStatus !== task.status) {
        task.statusHistory.push({
          status: task.status,
          changedAt: new Date(),
          changedBy: req.user._id,
        });
      }

      await task.save();

      const updatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .populate('statusHistory.changedBy', 'name email');

      res.json({
        success: true,
        data: updatedTask,
      });
    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }
);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task (soft delete)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check authorization: users can only delete their assigned tasks
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    // Hard delete
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

export default router;

