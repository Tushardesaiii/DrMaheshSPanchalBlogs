function Badge({ className = '', children }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-(--color-bg) px-3 py-1 text-xs font-medium text-(--color-primary) ${className}`}>
      {children}
    </span>
  )
}

export default Badge
