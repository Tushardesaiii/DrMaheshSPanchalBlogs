function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-full border border-(--color-border) bg-white px-4 py-2 text-sm text-(--color-text) focus:border-(--color-primary) focus:outline-none ${className}`}
      {...props}
    />
  )
}

export default Input
