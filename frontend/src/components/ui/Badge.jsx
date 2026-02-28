function Badge({ className = '', children, variant = 'default' }) {
  const styles = {
    default: 'bg-linear-to-r from-[rgba(212,165,116,0.15)] to-[rgba(168,125,79,0.1)] text-[#a87d4f] border border-[rgba(212,165,116,0.3)]',
    primary: 'bg-[rgba(15,23,42,0.08)] text-(--color-primary) border border-(--color-border)',
    accent: 'bg-linear-to-r from-[#d4a574] to-[#a87d4f] text-white',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold ${styles[variant]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
