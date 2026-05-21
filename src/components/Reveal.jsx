import { useReveal } from '../hooks/useReveal.js'

export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const { ref, visible } = useReveal()
  const style = { transitionDelay: `${delay}ms` }
  return (
    <Tag
      ref={ref}
      style={style}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  )
}
