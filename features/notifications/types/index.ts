export type NotificationType =
  | 'joinRequested'
  | 'joinAccepted'
  | 'joinRejected'
  | 'matchUpdated'
  | 'matchCancelled'
  | 'validationWindowOpened'

export interface Notification {
  id: string
  type: NotificationType
  matchId: string | null
  message: string
  isRead: boolean
  createdAt: string
}
