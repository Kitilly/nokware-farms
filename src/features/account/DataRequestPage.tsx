import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Trash2, CheckCircle2 } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { toast } from '@/components/ui/Toast'

export function DataRequestPage() {
  const navigate = useNavigate()
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleRequestExport() {
    toast.success('Request received', 'We’ll email you a copy of your data within a few days (demo — no email is actually sent).')
  }

  function handleConfirmDelete() {
    setDeleteOpen(false)
    toast.success('Deletion request received', 'Our team will process this request (demo — your account is not actually deleted).')
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-5 pt-4 md:px-8">
        <button type="button" onClick={() => navigate('/account/privacy')} className="mb-3 flex items-center gap-1.5 text-body font-medium text-charcoal-600 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Privacy
        </button>
        <h1 className="text-h1 text-charcoal-900">Request my data</h1>
        <p className="mt-1 text-body-lg text-charcoal-600">You can request a copy of your data, or request that we delete your account.</p>

        <div className="mt-5 space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Download className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-body-lg font-medium text-charcoal-900">Export my data</p>
              <p className="mt-0.5 text-body text-charcoal-600">Get a copy of your profile, orders, and preferences.</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={handleRequestExport}>
                Request export
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-error/30 bg-error-bg/40 p-4">
            <Trash2 className="mt-0.5 h-5 w-5 shrink-0 text-error" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-body-lg font-medium text-charcoal-900">Delete my account</p>
              <p className="mt-0.5 text-body text-charcoal-600">Permanently delete your account and associated data. This can’t be undone.</p>
              <Button size="sm" variant="destructive" className="mt-2" onClick={() => setDeleteOpen(true)}>
                Request deletion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete your account?" description="This is a demo — no account will actually be deleted, but this shows the confirmation flow your request would go through.">
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" fullWidth leadingIcon={<CheckCircle2 className="h-4 w-4" />} onClick={handleConfirmDelete}>
            Confirm request
          </Button>
        </div>
      </Dialog>
    </AppShell>
  )
}
