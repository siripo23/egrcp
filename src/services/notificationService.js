import notificationsData from '../mocks/notifications.json'
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
export const fetchNotifications = async () => { await delay(300); return notificationsData }
