import { cn } from '../../utils/cn'

const baseInput =
  'w-full rounded-md border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 transition-colors focus:border-primary'

export function Field({ label, htmlFor, error, hint, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
          {required ? <span className="text-primary"> *</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-ink-soft">{hint}</p>
      ) : null}
    </div>
  )
}

export function Input({ className, invalid, ...props }) {
  return (
    <input
      className={cn(baseInput, invalid && 'border-red-400', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
}

export function Textarea({ className, invalid, ...props }) {
  return (
    <textarea
      className={cn(baseInput, 'min-h-[110px] resize-y', invalid && 'border-red-400', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
}

export function Select({ className, invalid, children, ...props }) {
  return (
    <select
      className={cn(baseInput, 'appearance-none bg-white', invalid && 'border-red-400', className)}
      aria-invalid={invalid || undefined}
      {...props}
    >
      {children}
    </select>
  )
}
