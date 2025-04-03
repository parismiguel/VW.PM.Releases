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

const ReleaseSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  release_version: { type: String, required: true },
  release_type: { type: String, required: true },
  status: { type: String, required: true },
  staging: { type: EnvironmentSchema, required: true }, // Staging environment
  production: { type: EnvironmentSchema, required: true }, // Production environment
});

module.exports = mongoose.model("Release", ReleaseSchema);