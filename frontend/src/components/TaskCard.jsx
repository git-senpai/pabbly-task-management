import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const priorityColors = {
  Low: "border-green-500/50",
  Medium: "border-blue-500/50",
  High: "border-orange-500/50",
  Urgent: "border-red-500/50",
};

const priorityBadgeColors = {
  Low: "bg-green-500/10 text-green-400 border-green-500/20",
  Medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Urgent: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusBadgeColors = {
  Pending: "bg-slate-700/50 text-slate-300 border-slate-600",
  "In Progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const TaskCard = ({ task, onStatusChange, onDelete, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "Completed";

  return (
    <div
      className={`bg-slate-800/80 rounded-lg shadow-sm border-l-4 ${
        priorityColors[task.priority]
      } p-5 hover:shadow-md hover:bg-slate-800 transition-all h-full flex flex-col border-y border-r border-slate-700/50 backdrop-blur-sm`}
    >
      {/* Header with Title and Menu */}
      <div className="flex justify-between items-start mb-3">
        <Link to={`/tasks/${task._id}`} className="flex-1 pr-2">
          <h3 className="text-base font-semibold text-white hover:text-indigo-400 transition leading-tight">
            {task.title}
          </h3>
        </Link>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-slate-500 hover:text-slate-300 transition p-1"
            title="More options"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-40 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-20 py-1 overflow-hidden">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEdit(task);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center transition"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(task);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center transition"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-slate-400 mb-4 line-clamp-2 grow">
          {task.description}
        </p>
      )}

      {/* Metadata Section */}
      <div className="mt-auto space-y-3">
        {/* Priority and Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
              priorityBadgeColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
              statusBadgeColors[task.status]
            }`}
          >
            {task.status}
          </span>
        </div>

        {/* Due Date and Assigned To */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center">
            <svg
              className="w-3.5 h-3.5 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            <span className={isOverdue ? "text-red-400 font-medium" : ""}>
              {format(new Date(task.dueDate), "MMM dd, yyyy")}
            </span>
          </div>
          {task.assignedTo && (
            <div className="flex items-center">
              <svg
                className="w-3.5 h-3.5 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <span className="font-medium text-slate-400">
                {task.assignedTo.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
