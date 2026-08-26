import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Modal / drawer surface built on the glass material — used for the mobile
 * menu, service detail overlay, and admin drawers. Traps Escape-to-close
 * and locks body scroll while open.
 */
export function GlassSheet({ open, onClose, side = 'bottom', title, children, className }) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  const positionClasses = {
    bottom: 'inset-x-0 bottom-0 rounded-t-lg rounded-b-none max-h-[85vh]',
    right: 'inset-y-0 right-0 h-full w-full max-w-md rounded-none',
    center: 'inset-0 m-auto h-fit max-h-[85vh] w-[min(92vw,560px)]',
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <button
        aria-label="Fermer"
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          'glass-surface absolute overflow-y-auto p-5 sm:p-6 animate-fade-up',
          positionClasses[side],
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          {title ? <h2 className="text-lg font-semibold text-ink">{title}</h2> : <span />}
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-full p-2 text-ink-soft hover:bg-ink/5"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
