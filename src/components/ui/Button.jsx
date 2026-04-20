import { Link } from 'react-router-dom'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export default function Button({
  as = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  to,
  href,
  type = 'button',
  ...props
}) {
  const classes = classNames(
    'ui-btn',
    variant === 'primary' && 'ui-btn-primary',
    variant === 'secondary' && 'ui-btn-secondary',
    variant === 'tertiary' && 'ui-btn-tertiary',
    size === 'sm' && 'ui-btn-sm',
    size === 'lg' && 'ui-btn-lg',
    className
  )

  if (as === 'link' || to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (as === 'a' || href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
