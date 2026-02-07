import React from "react";

const ConfirmAction = ({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isLoading = false,
  setOpenConfirm
}) => {

  return (
    <div className="w-[98vw] h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xs bg-zinc-900 p-6 text-white shadow-lg">
        
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-1.5 text-md text-zinc-400">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setOpenConfirm(false)}
            className="rounded-xs px-4 py-2.5 text-md font-semibold cursor-pointer bg-zinc-700 hover:bg-zinc-600">
            {cancelText}
          </button>

          <button
            disabled={isLoading}
            onClick={onConfirm}
            className="rounded-xs px-4 py-2.5 text-md font-semibold cursor-pointer bg-[#f88f37] hover:bg-[#fdba50] disabled:opacity-50">
            {isLoading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAction;
