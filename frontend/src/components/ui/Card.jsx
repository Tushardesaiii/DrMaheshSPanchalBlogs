function Card({ className = '', children }) {
  return <div className={`premium-card ${className}`}>{children}</div>
}

export default Card
