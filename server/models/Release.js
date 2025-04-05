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
  criteria: { type: String }, // Prerequisite criteria description
  status: { type: Boolean}, // Status (true/false)
  exceptions: { type: String }, // Comments or exceptions
});

const ReadinessSchema = new mongoose.Schema({
  criteria: { type: String }, // Readiness criteria description
  status: { type: Boolean }, // Status (true/false)
  exceptions: { type: String }, // Comments or exceptions
});

const PreDeploymentTaskSchema = new mongoose.Schema({
  description: { type: String },
  owner: { type: String },
  stagingComplete: { type: Boolean, default: false },
  prodComplete: { type: Boolean, default: false },
});

const RiskSchema = new mongoose.Schema({
  risk: { type: String },
  remediation: { type: String },
});

const ValidationTaskSchema = new mongoose.Schema({
  repositoryName: { type: String },
  releaseLink: { type: String },
  resource: { type: String },
  beginEndTime: { type: String },
  stagingComments: { type: String },
  prodComments: { type: String },
});

const PostDeploymentTaskSchema = new mongoose.Schema({
  task: { type: String },
  resource: { type: String },
  beginEndTime: { type: String },
  stagingComments: { type: String },
  prodComments: { type: String },
});

const PostDeploymentIssueSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String },
  sfSolution: { type: String },
  workItemType: { type: String },
  tfsRelease: { type: String },
  comments: { type: String },
});

const KnownIssueSchema = new mongoose.Schema({
  jiraItem: { type: String },
  sfSolution: { type: String },
  proposedRelease: { type: String },
  comments: { type: String },
});

const GoNoGoSchema = new mongoose.Schema({
  responsible: { type: String },
  go: { type: Boolean },
});

const ScreenshotSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
});


const ReleaseSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    release_version: { type: String, required: true },
    release_type: { type: String, required: true },
    status: { type: String, required: true },
    jira_release_filter: { type: String },
    staging: { type: EnvironmentSchema },
    production: { type: EnvironmentSchema },
    prerequisiteData: [PrerequisiteSchema],
    readinessData: [ReadinessSchema],
    preDeploymentTasks: [PreDeploymentTaskSchema],
    risks: [RiskSchema],
    validationTasks: [ValidationTaskSchema],
    postDeploymentTasks: [PostDeploymentTaskSchema], 
    postDeploymentIssues: [PostDeploymentIssueSchema], 
    knownIssues: [KnownIssueSchema], 
    goNoGo: {
      Development: { Primary: GoNoGoSchema, Backup: GoNoGoSchema },
      QA: { Primary: GoNoGoSchema, Backup: GoNoGoSchema },
      "Product Management": { Primary: GoNoGoSchema, Backup: GoNoGoSchema },
    },
    screenshots: [ScreenshotSchema],
    createdBy: { type: String, required: true },
    modifiedBy: { type: String },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "modifiedAt" }, // Automatically manage createdAt and modifiedAt
  }
);

module.exports = mongoose.model("Release", ReleaseSchema);
