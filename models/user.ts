import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String }, // new
    avatarUrl: { type: String }, // new
    subscriptionTier: { type: String, enum: ["free", "starter", "growth"], default: "free" },
    subscriptionStatus: { type: String, enum: ["active", "cancelled", "trialing", "past_due"], default: "active" },
    razorpayCustomerId: { type: String },
    refreshTokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
)

const DeviceSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true }, // unique device ID (UUID / push token)
    deviceType: { type: String, enum: ["web", "ios", "android"], default: "web" },
    ip: { type: String },
    userAgent: { type: String },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true, _id: false },
)

const LoginEventSchema = new mongoose.Schema(
  {
    ip: String,
    userAgent: String,
    loggedInAt: { type: Date, default: Date.now },
  },
  { _id: false },
)

userSchema.add({
  // profile
  fullName: { type: String },
  company: { type: String },
  language: { type: String, default: "en" },
  role: { type: String, enum: ["user", "admin"], default: "user" },

  // notification preferences
  notificationPreferences: {
    email: {
      updatesAboutPopups: { type: Boolean, default: true },
      leadNotifications: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: false },
      marketingEmails: { type: Boolean, default: false },
    },
  },

  // activity
  lastSeen: { type: Date, default: Date.now },
  devices: { type: [DeviceSchema], default: [] },
  loginHistory: { type: [LoginEventSchema], default: [] },
})

// Indexes for performance
userSchema.index({ email: 1 })
userSchema.index({ subscriptionTier: 1 })
userSchema.index({ createdAt: -1 })

export default mongoose.models.User || mongoose.model("User", userSchema)
