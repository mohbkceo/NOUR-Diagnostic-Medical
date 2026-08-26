import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Accordion({ items, className }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null)

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id}>
            <button
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span className="font-medium text-ink">{item.title}</span>
              <ChevronDown
                size={18}
                className={cn('shrink-0 text-ink-soft transition-transform duration-250', isOpen && 'rotate-180')}
              />
            </button>
            {isOpen ? <div className="pb-4 text-ink-soft">{item.content}</div> : null}
          </div>
        )
      })}
    </div>
  )
}
