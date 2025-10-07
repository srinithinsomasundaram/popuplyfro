import mongoose from "mongoose"

const websiteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },

    // Core website info
    domain: { type: String, required: true, index: true },
    websiteKey: { type: String, required: true, unique: true }, // used in embed data attribute
    name: { type: String }, // friendly label for dashboard
    faviconUrl: { type: String }, // for dashboard UI

    // Verification + status
    status: {
      type: String,
      enum: ["pending", "active", "paused", "deleted"],
      default: "pending",
      index: true,
    },
    verifiedAt: { type: Date },
    lastChecked: { type: Date }, // when domain verification was last checked

    // Popups relation (optional convenience for population/use)
    popups: [{ type: mongoose.Types.ObjectId, ref: "Popup" }],

    // Settings
    settings: {
      embedScriptEnabled: { type: Boolean, default: true },
      autoPublish: { type: Boolean, default: false },
      language: { type: String, default: "en" },
    },

    // Analytics snapshot (can be maintained by cron/aggregation)
    stats: {
      totalViews: { type: Number, default: 0 },
      totalConversions: { type: Number, default: 0 },
      last30Days: {
        views: { type: Number, default: 0 },
        conversions: { type: Number, default: 0 },
      },
    },

    // Metadata
    createdBy: { type: String }, // optional: email or userId string
    previousKeys: [{ type: String }], // track rotated keys
    deletedAt: { type: Date }, // soft delete timestamp
  },
  { timestamps: true },
)

// Indexes for performance
websiteSchema.index({ userId: 1, status: 1 })
websiteSchema.index({ websiteKey: 1 })

export default mongoose.models.Website || mongoose.model("Website", websiteSchema)
