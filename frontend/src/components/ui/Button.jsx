function Button({ variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-colors'
  const styles = {
    primary: 'bg-(--color-primary) text-white hover:bg-[#0f172a]',
    secondary: 'bg-(--color-secondary) text-white hover:bg-[#24494d]',
    ghost: 'border border-(--color-border) text-(--color-primary) hover:bg-(--color-bg)',
  }

  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />
}

export default Button
