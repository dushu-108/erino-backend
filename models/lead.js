import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
first_name: String,
last_name: String,
email: { type: String, unique: true },
phone: String,
company: String,
city: String,
state: String,
source: { type: String, enum: ["website", "facebook_ads", "google_ads", "referral", "events", "other"], default: "other" },
status: { type: String, enum: ["new", "contacted", "qualified", "lost", "won"], default: "new" },
score: Number,
lead_value: Number,
last_activity_at: Date,
is_qualified: Boolean,
created_at: { type: Date, default: Date.now },
updated_at: { type: Date, default: Date.now }

});

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
