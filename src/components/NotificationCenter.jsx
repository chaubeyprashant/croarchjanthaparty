import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useAuth } from '../context/auth-context.js'
import {
  markAllNotificationsRead,
  markNotificationRead,
  subscribeUserNotifications,
} from '../lib/notifications.js'
import './NotificationCenter.css'

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

export function NotificationCenter() {
  const { isAuthenticated, user } = useAuth()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return undefined
    return subscribeUserNotifications(user.id, setItems)
  }, [isAuthenticated, user?.id])

  if (!isAuthenticated) return null

  const visibleItems = isAuthenticated && user?.id ? items : []
  const unread = visibleItems.filter((item) => !item.read).length

  const handleOpen = () => setOpen((current) => !current)

  const handleItemClick = async (item) => {
    if (!item.read) {
      try {
        await markNotificationRead(user.id, item.id)
      } catch {
        /* ignore */
      }
    }
    setOpen(false)
  }

  const handleMarkAll = async () => {
    try {
      const unreadIds = visibleItems.filter((item) => !item.read).map((item) => item.id)
      await markAllNotificationsRead(user.id, unreadIds)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="notif-center">
      <button type="button" className="notif-bell" onClick={handleOpen} aria-label="Notifications">
        <Bell size={18} />
        {unread > 0 && <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>}
      </button>
      {open && (
        <div className="notif-panel bg-paper border-ink">
          <header className="notif-panel-head">
            <strong>Notifications</strong>
            {unread > 0 && (
              <button type="button" className="btn btn-link" onClick={handleMarkAll}>
                Mark all read
              </button>
            )}
          </header>
          <ul className="notif-list">
            {visibleItems.length === 0 && <li className="muted">No notifications yet.</li>}
            {visibleItems.map((item) => (
              <li key={item.id} className={item.read ? '' : 'is-unread'}>
                {item.href ? (
                  <Link to={item.href} onClick={() => handleItemClick(item)}>
                    <strong>{item.title}</strong>
                    <span>{item.body}</span>
                    <small>{timeAgo(item.createdAt)}</small>
                  </Link>
                ) : (
                  <button type="button" onClick={() => handleItemClick(item)}>
                    <strong>{item.title}</strong>
                    <span>{item.body}</span>
                    <small>{timeAgo(item.createdAt)}</small>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
