"use client"

const notifications = [
  { icon: "🔥", message: "Rahul from Mumbai just created a popup 2 mins ago" },
  { icon: "🚀", message: "2,450 websites are growing with Popuply today" },
  { icon: "🎉", message: "Popuply Pro just launched! Try now for ₹499/month" },
  { icon: "✨", message: "Priya from Bangalore got 50 leads this week" },
  { icon: "💡", message: "New feature: Advanced targeting options now available" },
]

export function LandingNotification() {
  return null
}

// export function LandingNotification() {
//   const [visible, setVisible] = useState(false)
//   const [currentNotification, setCurrentNotification] = useState(0)

//   useEffect(() => {
//     // Show first notification after 3 seconds
//     const initialTimer = setTimeout(() => {
//       setVisible(true)
//     }, 3000)

//     return () => clearTimeout(initialTimer)
//   }, [])

//   useEffect(() => {
//     if (!visible) return

//     // Auto-hide after 6 seconds
//     const hideTimer = setTimeout(() => {
//       setVisible(false)

//       // Show next notification after 10 seconds
//       setTimeout(() => {
//         setCurrentNotification((prev) => (prev + 1) % notifications.length)
//         setVisible(true)
//       }, 10000)
//     }, 6000)

//     return () => clearTimeout(hideTimer)
//   }, [visible, currentNotification])

//   if (!visible) return null

//   const notification = notifications[currentNotification]

//   return (
//     <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-4 duration-500">
//       <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 pr-12 max-w-sm">
//         <button
//           onClick={() => setVisible(false)}
//           className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
//         >
//           <X className="w-4 h-4" />
//         </button>
//         <div className="flex items-start gap-3">
//           <span className="text-2xl">{notification.icon}</span>
//           <p className="text-sm text-gray-700 leading-relaxed">{notification.message}</p>
//         </div>
//       </div>
//     </div>
//   )
// }
