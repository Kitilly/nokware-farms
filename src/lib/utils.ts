import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge only knows Tailwind's default theme out of the box, so our
// custom @theme tokens (index.css) — a bespoke font-size scale and named
// color families — have to be taught to it explicitly. Without this, e.g.
// `text-cream-50 text-body-lg` gets misread as two conflicting font-size
// utilities and the color class silently gets dropped.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        'forest',
        'cream',
        'sage',
        'brown',
        'terracotta',
        'charcoal',
        'border',
        'border-strong',
        'success',
        'success-bg',
        'warning',
        'warning-bg',
        'error',
        'error-bg',
        'info',
        'info-bg',
      ],
    },
    classGroups: {
      'font-size': [{ text: ['display', 'h1', 'h2', 'h3', 'body-lg', 'body', 'caption', 'label'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
