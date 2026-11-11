type ModalType = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalType> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    </>
  );
};
