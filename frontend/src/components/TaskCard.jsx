import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const priorityColors = {
  Low: "border-[#10B981]",
  Medium: "border-[#3B82F6]",
  High: "border-[#EF4444]",
};

const priorityBadgeColors = {
  Low: "bg-[#10B981] text-black border-black",
  Medium: "bg-[#3B82F6] text-white border-black",
  High: "bg-[#EF4444] text-white border-black",
};

const statusBadgeColors = {
  Pending: "bg-gray-200 text-black border-black",
  "In Progress": "bg-[#FCD34D] text-black border-black font-black",
  Completed: "bg-[#6EE7B7] text-black border-black font-black",
};

const TaskCard = ({ task, onStatusChange, onDelete, onEdit, compact = false }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "Completed";

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on interactive elements
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
      return;
    }
    navigate(`/tasks/${task._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white relative border-2 border-black shadow-[4px_4px_0_0_#000] ${
        compact ? 'p-3' : 'p-5'
      } hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] transition-all h-full flex flex-col group cursor-pointer`}
    >
      {/* Priority Stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-3 h-full border-r-2 border-black ${priorityColors[task.priority].replace('border-', 'bg-')}`}></div>

      {/* Header with Title and Menu */}
      <div className="flex justify-between items-start mb-3 pl-4">
        <div className="flex-1 pr-2">
          <h3 className="text-lg font-black text-black hover:text-[#8B5CF6] transition leading-tight underline decoration-2 decoration-black hover:decoration-[#8B5CF6] underline-offset-2 uppercase">
            {task.title}
          </h3>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-black hover:bg-black hover:text-white transition p-1 border-2 border-transparent hover:border-black rounded-none"
            title="More options"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
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
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 mt-1 w-48 bg-white border-2 border-black shadow-[4px_4px_0_0_#000] z-20 py-2">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEdit(task);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-black uppercase text-black hover:bg-gray-100 flex items-center transition border-l-4 border-transparent hover:border-black"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    EDIT TASK
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
                    className="w-full text-left px-4 py-2 text-sm font-black uppercase text-[#EF4444] hover:bg-red-50 flex items-center transition border-l-4 border-transparent hover:border-[#EF4444]"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    DELETE TASK
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 font-bold mb-4 line-clamp-2 grow pl-4 border-l-2 border-gray-300 ml-1">
          {task.description}
        </p>
      )}

      {/* Metadata Section */}
      <div className={`mt-auto space-y-3 pl-4`}>
        {/* Priority and Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`${compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'} font-black uppercase border-2 ${
              priorityBadgeColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
          <span
            className={`${compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'} font-black uppercase border-2 ${
              statusBadgeColors[task.status]
            }`}
          >
            {task.status}
          </span>
        </div>

        {/* Due Date and Assigned To */}
        <div className="flex items-center justify-between text-xs text-black font-black uppercase">
          <div className="flex items-center">
            <svg
              className="w-3.5 h-3.5 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
            <span className={isOverdue ? "text-red-600 bg-red-100 px-1 border-2 border-red-500" : ""}>
              {format(new Date(task.dueDate), "MMM dd")}
            </span>
          </div>
          {task.assignedTo && task.assignedTo.length > 0 && (
            <div className="flex items-center">
              <span className="font-black text-gray-500">
                {Array.isArray(task.assignedTo) && task.assignedTo.length > 1
                  ? `${task.assignedTo.length} USERS`
                  : Array.isArray(task.assignedTo) 
                    ? task.assignedTo[0]?.name.toUpperCase().split(' ')[0]
                    : task.assignedTo?.name.toUpperCase().split(' ')[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
