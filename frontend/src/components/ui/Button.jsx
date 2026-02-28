function Button({ variant = 'primary', className = '', children, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 font-display'
  const styles = {
    primary: 'bg-linear-to-r from-[#d4a574] to-[#a87d4f] text-white hover:shadow-[0_15px_40px_rgba(212,165,116,0.4)] hover:scale-105',
    secondary: 'bg-(--color-secondary) text-white hover:bg-[#1e4a4e] hover:shadow-lg transform hover:-translate-y-1',
    ghost: 'border-2 border-(--color-accent) text-(--color-primary) hover:bg-linear-to-r hover:from-[rgba(212,165,116,0.1)] hover:to-[rgba(212,165,116,0.05)] font-semibold',
    outline: 'border-2 border-(--color-border) text-(--color-primary) hover:border-(--color-accent) hover:bg-(--color-bg)',
  }

  return <button className={`${base} ${styles[variant]} ${className}`} {...props}>{children}</button>
}

export default Button
