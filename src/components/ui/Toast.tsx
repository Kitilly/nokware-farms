import * as RadixToast from '@radix-ui/react-toast'
import { create } from 'zustand'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastStoreState {
  toasts: ToastItem[]
  push: (toast: Omit<ToastItem, 'id'>) => void
  dismiss: (id: string) => void
}

const useToastStore = create<ToastStoreState>((set) => ({
  toasts: [],
  push: (item) =>
    set((state) => ({
      toasts: [...state.toasts, { ...item, id: `toast_${Date.now()}_${Math.round(Math.random() * 1000)}` }],
    })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export const toast = {
  success: (title: string, description?: string) => useToastStore.getState().push({ title, description, variant: 'success' }),
  error: (title: string, description?: string) => useToastStore.getState().push({ title, description, variant: 'error' }),
  info: (title: string, description?: string) => useToastStore.getState().push({ title, description, variant: 'info' }),
}

const variantIcon: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const variantClasses: Record<ToastVariant, string> = {
  success: 'border-success/30 text-success',
  error: 'border-error/30 text-error',
  info: 'border-info/30 text-info',
}

export function Toaster() {
  const { toasts, dismiss } = useToastStore()

  return (
    <RadixToast.Provider swipeDirection="right" duration={4000}>
      {toasts.map((t) => {
        const Icon = variantIcon[t.variant]
        return (
          <RadixToast.Root
            key={t.id}
            onOpenChange={(open) => !open && dismiss(t.id)}
            className={cn(
              'flex items-start gap-2.5 rounded-lg border bg-cream-50 p-3.5 shadow-md',
              'data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
              variantClasses[t.variant],
            )}
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <RadixToast.Title className="text-body-lg font-medium text-charcoal-900">{t.title}</RadixToast.Title>
              {t.description && (
                <RadixToast.Description className="mt-0.5 text-body text-charcoal-600">{t.description}</RadixToast.Description>
              )}
            </div>
            <RadixToast.Close aria-label="Dismiss" className="shrink-0 text-charcoal-400 hover:text-charcoal-600">
              <X className="h-4 w-4" aria-hidden="true" />
            </RadixToast.Close>
          </RadixToast.Root>
        )
      })}
      <RadixToast.Viewport className="fixed bottom-20 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 outline-none md:bottom-6 md:left-auto md:right-6 md:translate-x-0" />
    </RadixToast.Provider>
  )
}
