function Card({ className = '', children }) {
  return <div className={`paper-panel p-6 ${className}`}>{children}</div>
}

export default Card
