function Modal({ isOpen, title, description, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="paper-panel w-full max-w-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="section-title text-lg text-(--color-primary)">{title}</h3>
            {description && <p className="mt-1 text-sm text-(--color-muted)">{description}</p>}
          </div>
          <button onClick={onClose} className="text-sm text-(--color-muted)">
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

export default Modal
