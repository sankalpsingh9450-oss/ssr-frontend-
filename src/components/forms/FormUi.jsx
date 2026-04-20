export function getInputClass(hasError) {
  return `form-input ${hasError ? 'field-input--error' : ''}`
}

export function FieldError({ message, id }) {
  if (!message) return null
  return (
    <p id={id} className="field-error">
      {message}
    </p>
  )
}

export function FieldHint({ children }) {
  if (!children) return null
  return <p className="field-hint">{children}</p>
}

export function FormSuccessState({ title, message, actionLabel = 'Done', onAction }) {
  return (
    <div className="ui-panel text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)] text-3xl font-bold text-white">✓</div>
      <h3 className="mt-4 text-2xl font-semibold text-[var(--color-primary)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{message}</p>
      {onAction ? (
        <button type="button" className="ui-btn ui-btn-primary mt-6" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
