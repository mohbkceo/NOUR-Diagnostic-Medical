import { Star } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Rating({ value = 5, max = 5, className }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} role="img" aria-label={`${value} sur ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < value ? 'fill-primary text-primary' : 'text-line'}
        />
      ))}
    </div>
  )
}
