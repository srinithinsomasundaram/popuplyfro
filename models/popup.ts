import mongoose from "mongoose"

const popupSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },
    websiteId: { type: mongoose.Types.ObjectId, ref: "Website", required: true, index: true },
    type: {
      type: String,
      enum: ["email_capture", "announcement", "exit_intent", "countdown", "video", "custom"],
      default: "email_capture",
    },
    trigger: {
      type: String,
      enum: ["page_load", "scroll_percentage", "exit_intent", "time_delay", "click"],
      default: "page_load",
    },
    designConfig: { type: mongoose.Schema.Types.Mixed, default: {} },
    displayRules: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ["draft", "active", "paused", "archived"],
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date },
    metrics: {
      views: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
      closes: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
)

// Indexes for performance
popupSchema.index({ websiteId: 1, status: 1 })
popupSchema.index({ userId: 1, createdAt: -1 })
popupSchema.index({ type: 1, status: 1 })

export default mongoose.models.Popup || mongoose.model("Popup", popupSchema)
