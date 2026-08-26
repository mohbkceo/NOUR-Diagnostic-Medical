import { cn } from "../../utils/cn";

const variants = {
  primary: `
    bg-blue-600
    text-white
    shadow-xs
    hover:bg-blue-700
    active:bg-blue-800
  `,
  outline: `
    border border-white/80
    bg-white/55
    text-slate-700
    backdrop-blur-xl
    hover:bg-white/80
    hover:text-blue-700
  `,
  ghost: `
    text-blue-600
    hover:bg-blue-50/70
    hover:text-blue-700
  `,
  deep: `
    bg-slate-950
    text-white
    shadow-xs
    hover:bg-slate-900
  `,
};

const sizes = {
  sm: "min-h-9 px-4 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  type,
  ...props
}) {
  return (
    <Tag
      type={Tag === "button" ? (type ?? "button") : undefined}
      className={cn(
        `
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-full
          font-medium
          tracking-[-0.01em]
          outline-none
          select-none
          transition-all
          duration-200
          ease-out
          active:scale-[0.98]
          focus-visible:ring-2
          focus-visible:ring-blue-500/40
          focus-visible:ring-offset-2
          disabled:pointer-events-none
          disabled:cursor-not-allowed
          disabled:opacity-50
        `,
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
