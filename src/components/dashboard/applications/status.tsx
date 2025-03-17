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
    <div className={clsx(
      'w-22 text-center text-xs border-2 p-1.5 rounded-lg capitalize',
      {
        'bg-gray-200 border-gray-600': status === 'accepted',
        'bg-yellow-200 border-yellow-600': status === 'pending',
        'bg-red-200 border-red-600': status === 'rejected',
        'bg-green-200 border-green-600': status === 'accepted'
      }
    )}>
      {statusToText.get(status)}
    </div>
  )
}