import { Badge } from '@/components/ui/badge'
import { ApplicationStatus } from '@/lib/definitions'
import clsx from 'clsx'

const statusToText = new Map<ApplicationStatus, string>([
  ['applied', 'Envoyée'],
  ['pending', 'En attente'],
  ['rejected', 'Refusée'],
  ['accepted', 'Acceptée'],
])

export default function Status({ status }: { status: ApplicationStatus }) {
  return (
    <Badge variant="outline" className={clsx(
      'w-22 text-center text-sm border-2 p-1.5 rounded-lg',
      {
        'bg-gray-200 border-gray-600 text-gray-950': status === 'accepted',
        'bg-yellow-200 border-yellow-600 text-yellow-950': status === 'pending',
        'bg-red-200 border-red-600 text-red-950': status === 'rejected',
        'bg-green-200 border-green-600 text-green-950': status === 'accepted'
      }
    )}>
      {statusToText.get(status)}
    </Badge>
  )
}