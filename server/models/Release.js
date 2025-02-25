const mongoose = require("mongoose");

const ReleaseSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  release_version: { type: String, required: true },
  release_type: String,
  deployment_date: Date,
  deployment_time: String,
  deployment_duration: String,
  downtime: String,
  resources_responsible: String,
  status: { type: String, default: "Draft" },
  systems_impacted: [
    {
      system_name: String,
      environment: String,
    },
  ],
  target_servers: [{ server_name: String, environment: String }],
  pre_deployment_tasks: [
    {
      description: String,
      owner: String,
      staging_complete: Boolean,
      prod_complete: Boolean,
    },
  ],
  tasks: [
    {
      task_type: String, // e.g., Pre-requisite, Pre-Deployment, etc.
      description: String,
      owner: String,
      status: String,
    },
  ],
  issues: [
    {
      jira_item: String,
      sf_solution: String,
      comments: String,
    },
  ],
  risks: [
    {
      risk: String,
      remediation: String,
    },
  ],
  approvals: [
    {
      team: String,
      primary_approver: String,
      status: String,
      approval_date: Date,
    },
  ],
});

module.exports = mongoose.model("Release", ReleaseSchema);
