export default function Modal({ isOpen, onClose, title, children, footer, width = "35%" }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`bg-white rounded-lg w-[${width}] 2xl:w-[25%] shadow-lg relative pb-10 pt-5`}>
        <div className="flex justify-between items-center mb-8 ">
          {title && (
            <h2 className="mt-2 text-2xl w-fit font-semibold">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 w-fit hover:text-gray-800 cursor-pointer absolute top-4 right-4"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col items-center">{children}</div>
        {footer && <div className="mt-4 flex justify-end">{footer}</div>}
      </div>
    </div>
  );
}
