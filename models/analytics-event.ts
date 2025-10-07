import mongoose from "mongoose"

const analyticsEventSchema = new mongoose.Schema(
  {
    popupId: { type: mongoose.Types.ObjectId, ref: "Popup", required: true, index: true },
    websiteId: { type: mongoose.Types.ObjectId, ref: "Website", required: true, index: true },
    eventType: { type: String, enum: ["view", "click", "conversion", "close"], required: true, index: true },
    visitorId: { type: String, index: true },
    sessionId: { type: String },
    pageUrl: { type: String },
    referrer: { type: String },
    deviceType: { type: String, enum: ["desktop", "mobile", "tablet"] },
    browser: { type: String },
    country: { type: String },
    city: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

// Compound indexes for analytics queries
analyticsEventSchema.index({ popupId: 1, createdAt: -1 })
analyticsEventSchema.index({ websiteId: 1, eventType: 1, createdAt: -1 })
analyticsEventSchema.index({ visitorId: 1, sessionId: 1 })

export default mongoose.models.AnalyticsEvent || mongoose.model("AnalyticsEvent", analyticsEventSchema)
