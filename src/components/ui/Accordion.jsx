import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

export function Accordion({ items, className }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  return (
    <div className={cn("w-full", className)}>
      {items.map((item, index) => {
        const isOpen = openId === item.id;

        return (
          <div
            key={item.id}
            className={cn(
              "relative transition-colors duration-200",
              index !== 0 && "border-t border-slate-200/70",
              isOpen && "bg-blue-50/35",
            )}
          >
            <button
              type="button"
              className="
                flex
                w-full
                items-center
                justify-between
                gap-5
                px-5
                py-5
                text-left
                outline-none
                sm:px-6
                sm:py-5.5
                focus-visible:ring-2
                focus-visible:ring-inset
                focus-visible:ring-blue-500/50
              "
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span
                className={cn(
                  "text-sm font-medium tracking-[-0.01em] transition-colors sm:text-base",
                  isOpen ? "text-blue-700" : "text-slate-800",
                )}
              >
                {item.title}
              </span>

              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                  isOpen
                    ? "border-blue-200 bg-white/70 text-blue-600"
                    : "border-transparent bg-slate-100/70 text-slate-500",
                )}
              >
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={cn(
                    "transition-transform duration-250",
                    isOpen && "rotate-180",
                  )}
                />
              </span>
            </button>

            <div
              id={`accordion-content-${item.id}`}
              hidden={!isOpen}
              className="px-5 pb-5 sm:px-6 sm:pb-6"
            >
              <div
                className="
                  max-w-2xl
                  pr-10
                  text-sm
                  leading-6
                  text-slate-500
                  sm:text-[15px]
                "
              >
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
