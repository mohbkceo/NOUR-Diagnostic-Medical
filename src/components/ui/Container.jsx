import { cn } from '../../utils/cn'

export function Container({ className, children }) {
  return <div className={cn('container-page', className)}>{children}</div>
}
