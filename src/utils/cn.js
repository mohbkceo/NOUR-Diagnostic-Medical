// Tiny className combinator — avoids pulling in the `clsx` dependency for
// something this small. Falsy values are dropped.
export function cn(...values) {
  return values.filter(Boolean).join(' ')
}
