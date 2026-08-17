import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 px-6">
      <EmptyState
        icon={<Compass className="h-7 w-7 text-charcoal-500" aria-hidden="true" />}
        title="Page not found"
        body="The page you’re looking for doesn’t exist or may have moved."
        action={<Button onClick={() => navigate('/home')}>Go to Home</Button>}
      />
    </div>
  )
}
