const mongoose = require("mongoose");

const EnvironmentSchema = new mongoose.Schema({
  deployment_date: { type: String }, // ISO date string
  deployment_time: { type: String }, // Time string
  deployment_duration: { type: Number }, // Duration in hours
  downtime: { type: Number }, // Downtime in hours
  informed_resources: { type: Boolean }, // Yes/No
  systems_impacted: { type: [String] }, // List of impacted systems
  target_servers: { type: [String] }, // List of target servers
  resources_responsible: { type: [String] }, // Array of tags
});

const PrerequisiteSchema = new mongoose.Schema({
  criteria: { type: String, required: true }, // Prerequisite criteria description
  status: { type: Boolean, required: true }, // Status (true/false)
  exceptions: { type: String }, // Comments or exceptions
});

const ReadinessSchema = new mongoose.Schema({
  criteria: { type: String, required: true }, // Readiness criteria description
  status: { type: Boolean, required: true }, // Status (true/false)
  exceptions: { type: String }, // Comments or exceptions
});

const ReleaseSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    release_version: { type: String, required: true },
    release_type: { type: String, required: true },
    status: { type: String, required: true },
    staging: { type: EnvironmentSchema, required: true },
    production: { type: EnvironmentSchema, required: true },
    prerequisiteData: [PrerequisiteSchema],
    readinessData: [ReadinessSchema],
    jira_release_filter: { type: String },
    createdBy: { type: String, required: true },
    modifiedBy: { type: String },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "modifiedAt" }, // Automatically manage createdAt and modifiedAt
  }
);

module.exports = mongoose.model("Release", ReleaseSchema);
