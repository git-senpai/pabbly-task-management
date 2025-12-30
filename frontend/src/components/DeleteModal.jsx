const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] rounded-none max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <div className="shrink-0 w-12 h-12 bg-red-100 border-2 border-black flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="ml-4 text-xl font-black italic uppercase text-black">{title || 'Confirm Deletion'}</h3>
        </div>

        <p className="text-gray-600 font-bold mb-6 uppercase text-sm">{message || 'Are you sure you want to delete this item? This action cannot be undone.'}</p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 border-black text-black font-black uppercase hover:bg-gray-100 hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all rounded-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#EF4444] text-white font-black uppercase border-2 border-black hover:bg-red-600 hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all active:translate-x-0 active:translate-y-0 active:shadow-none rounded-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

