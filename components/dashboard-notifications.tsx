"use client"

import { useState } from "react"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const mockNotifications = [
  {
    id: 1,
    icon: "👋",
    message: "Don't forget to install your embed code",
    time: "5m ago",
    type: "setup_guide",
    unread: true,
  },
  {
    id: 2,
    icon: "🎉",
    message: "You just got 1 new subscriber!",
    time: "1h ago",
    type: "lead_collected",
    unread: true,
  },
  {
    id: 3,
    icon: "⚡",
    message: "Unlock custom branding with Pro",
    time: "2h ago",
    type: "pro_upgrade",
    unread: false,
  },
  {
    id: 4,
    icon: "📊",
    message: "Your popup has a 10% conversion rate this week",
    time: "1d ago",
    type: "analytics",
    unread: false,
  },
]

export function DashboardNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => n.unread).length

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  return (
    <>
      <Button variant="ghost" size="icon" className="relative rounded-xl" onClick={() => setIsOpen(true)}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-semibold">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={() => setIsOpen(false)} />}

      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xl">Notifications</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-xl hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-[#3A8DFF] hover:text-[#2d7ce6] text-sm px-0"
              >
                Mark all as read
              </Button>
            )}
          </div>

          {/* Notifications list */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                    notification.unread ? "bg-blue-50/50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{notification.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                    {notification.unread && <div className="w-2 h-2 rounded-full bg-[#3A8DFF] mt-1.5" />}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button variant="ghost" className="w-full text-[#3A8DFF] hover:text-[#2d7ce6] text-sm">
              View all notifications
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
