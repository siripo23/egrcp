import notificationReducer, { markAsRead, markAllAsRead } from '../store/slices/notificationSlice'

const mockNotifications = [
  { id: 'n1', title: 'Alert 1', read: false, priority: 'high' },
  { id: 'n2', title: 'Alert 2', read: false, priority: 'medium' },
  { id: 'n3', title: 'Alert 3', read: true, priority: 'low' },
]

const stateWithNotifications = { notifications: mockNotifications, unreadCount: 2, loading: false, error: null }

describe('notificationSlice', () => {
  it('should mark a single notification as read', () => {
    const state = notificationReducer(stateWithNotifications, markAsRead('n1'))
    expect(state.notifications.find(n => n.id === 'n1').read).toBe(true)
    expect(state.unreadCount).toBe(1)
  })

  it('should not decrease count for already-read notification', () => {
    const state = notificationReducer(stateWithNotifications, markAsRead('n3'))
    expect(state.unreadCount).toBe(2)
  })

  it('should mark all notifications as read', () => {
    const state = notificationReducer(stateWithNotifications, markAllAsRead())
    expect(state.notifications.every(n => n.read)).toBe(true)
    expect(state.unreadCount).toBe(0)
  })

  it('should handle fetchNotifications.fulfilled', () => {
    const action = { type: 'notification/fetchAll/fulfilled', payload: mockNotifications }
    const state = notificationReducer(undefined, action)
    expect(state.notifications).toHaveLength(3)
    expect(state.unreadCount).toBe(2)
  })

  it('should handle fetchNotifications.pending', () => {
    const action = { type: 'notification/fetchAll/pending' }
    const state = notificationReducer(undefined, action)
    expect(state.loading).toBe(true)
  })
})
