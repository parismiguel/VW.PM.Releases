const express = require("express");
const router = express.Router();
const Release = require("../models/Release");
const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const fs = require("fs");
const path = require("path");

// Get all releases
router.get("/", async (req, res) => {
  try {
    const releases = await Release.find();
    res.json(releases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single release by ID
router.get("/:id", async (req, res) => {
  try {
    const release = await Release.findById(req.params.id);
    if (!release) return res.status(404).json({ message: "Release not found" });
    res.json(release);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new release
router.post("/", async (req, res) => {
  try {
    const release = new Release({
      product_name: req.body.product_name,
      release_version: req.body.release_version,
      release_type: req.body.release_type,
      status: req.body.status,
      jira_release_filter: req.body.jira_release_filter,
      staging: req.body.staging,
      production: req.body.production,
      prerequisiteData: req.body.prerequisiteData,
      readinessData: req.body.readinessData,
      preDeploymentTasks: req.body.preDeploymentTasks,
      risks: req.body.risks,
      validationTasks: req.body.validationTasks,
      postDeploymentTasks: req.body.postDeploymentTasks,
      postDeploymentIssues: req.body.postDeploymentIssues,
      knownIssues: req.body.knownIssues, 
      goNoGo: req.body.goNoGo,
      createdBy: req.body.createdBy,
    });
    await release.save();
    res.status(201).json(release);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an existing release
router.put("/:id", async (req, res) => {
  try {
    const release = await Release.findById(req.params.id);
    if (!release) return res.status(404).json({ message: "Release not found" });

    release.product_name = req.body.product_name;
    release.release_version = req.body.release_version;
    release.release_type = req.body.release_type;
    release.status = req.body.status;
    release.jira_release_filter = req.body.jira_release_filter;
    release.staging = req.body.staging;
    release.production = req.body.production;
    release.prerequisiteData = req.body.prerequisiteData;
    release.readinessData = req.body.readinessData;
    release.preDeploymentTasks = req.body.preDeploymentTasks;
    release.risks = req.body.risks;
    release.validationTasks = req.body.validationTasks;
    release.postDeploymentTasks = req.body.postDeploymentTasks; 
    release.postDeploymentIssues = req.body.postDeploymentIssues; 
    release.knownIssues = req.body.knownIssues;
    release.goNoGo = req.body.goNoGo;
    release.modifiedBy = req.body.modifiedBy;

    await release.save();
    res.json(release);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a release
router.delete("/:id", async (req, res) => {
  try {
    const release = await Release.findById(req.params.id);
    if (!release) return res.status(404).json({ message: "Release not found" });
    await Release.deleteOne({ _id: req.params.id });
    res.json({ message: "Release deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate Word document
router.get("/:id/document", async (req, res) => {
  try {
    const release = await Release.findById(req.params.id);
    if (!release) return res.status(404).json({ message: "Release not found" });

    // Load the template file
    const templatePath = path.join(__dirname, "../template.docx");
    if (!fs.existsSync(templatePath)) {
      return res.status(500).json({ message: "Template file not found" });
    }

    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document with data
    doc.render({
      // Common Information
      product_name: release.product_name,
      release_version: release.release_version,
      release_type: release.release_type,
      status: release.status,
      jira_release_filter: release.jira_release_filter || "N/A",

      // Audit Information
      created_at: new Date(release.createdAt).toLocaleString(),
      created_by: release.createdBy || "N/A",
      modified_at: new Date(release.modifiedAt).toLocaleString(),
      modified_by: release.modifiedBy || "N/A",

      // Staging Environment
      staging_deployment_date: release.staging?.deployment_date || "N/A",
      staging_deployment_time: release.staging?.deployment_time || "N/A",
      staging_deployment_duration: release.staging?.deployment_duration || "N/A",
      staging_downtime: release.staging?.downtime || "N/A",
      staging_informed_resources: release.staging?.informed_resources
        ? "Yes"
        : "No",
      staging_systems_impacted: release.staging?.systems_impacted?.join(", ") || "N/A",
      staging_target_servers: release.staging?.target_servers?.join(", ") || "N/A",
      staging_resources_responsible: release.staging?.resources_responsible?.join(", ") || "N/A",

      // Production Environment
      production_deployment_date: release.production?.deployment_date || "N/A",
      production_deployment_time: release.production?.deployment_time || "N/A",
      production_deployment_duration: release.production?.deployment_duration || "N/A",
      production_downtime: release.production?.downtime || "N/A",
      production_informed_resources: release.production?.informed_resources
        ? "Yes"
        : "No",
      production_systems_impacted: release.production?.systems_impacted?.join(", ") || "N/A",
      production_target_servers: release.production?.target_servers?.join(", ") || "N/A",
      production_resources_responsible: release.production?.resources_responsible?.join(", ") || "N/A",

      // Pre-Requisite Checklist
      prerequisite_data: release.prerequisiteData.map((item, index) => ({
        seq: index + 1,
        criteria: item.criteria,
        status: item.status ? "Complete" : "Incomplete",
        exceptions: item.exceptions || "N/A",
      })),

      // Readiness Checklist
      readiness_data: release.readinessData.map((item, index) => ({
        seq: index + 1,
        criteria: item.criteria,
        status: item.status ? "Complete" : "Incomplete",
        exceptions: item.exceptions || "N/A",
      })),

      // Pre-Deployment Tasks
      pre_deployment_tasks: release.preDeploymentTasks.map((task, index) => ({
        seq: index + 1,
        description: task.description,
        owner: task.owner || "N/A",
        staging_complete: task.stagingComplete ? "Yes" : "No",
        prod_complete: task.prodComplete ? "Yes" : "No",
      })),

      // Deployment Risks
      risks: release.risks.map((risk, index) => ({
        seq: index + 1,
        risk: risk.risk,
        remediation: risk.remediation,
      })),

      // Validation Tasks
      validation_tasks: release.validationTasks.map((task, index) => ({
        seq: index + 1,
        repository_name: task.repositoryName || "N/A",
        release_link: task.releaseLink || "N/A",
        resource: task.resource || "N/A",
        begin_end_time: task.beginEndTime || "N/A",
        staging_comments: task.stagingComments || "N/A",
        prod_comments: task.prodComments || "N/A",
      })),

      // Post-Deployment Tasks
      post_deployment_tasks: release.postDeploymentTasks.map((task, index) => ({
        seq: index + 1,
        task: task.task,
        resource: task.resource || "N/A",
        begin_end_time: task.beginEndTime || "N/A",
        staging_comments: task.stagingComments || "N/A",
        prod_comments: task.prodComments || "N/A",
      })),

      // Post-Deployment Issues
      post_deployment_issues: release.postDeploymentIssues.map((issue, index) => ({
        seq: index + 1,
        id: issue.id || "N/A",
        title: issue.title || "N/A",
        sf_solution: issue.sfSolution || "N/A",
        work_item_type: issue.workItemType || "N/A",
        tfs_release: issue.tfsRelease || "N/A",
        comments: issue.comments || "N/A",
      })),

      // Known Issues
      known_issues: release.knownIssues.map((issue, index) => ({
        seq: index + 1,
        jira_item: issue.jiraItem || "N/A",
        sf_solution: issue.sfSolution || "N/A",
        proposed_release: issue.proposedRelease || "N/A",
        comments: issue.comments || "N/A",
      })),

      // Go / No Go
      go_no_go: Object.entries(release.goNoGo).map(([group, roles]) => ({
        group,
        primary_responsible: roles.Primary.responsible || "N/A",
        primary_go: roles.Primary.go ? "Yes" : "No",
        backup_responsible: roles.Backup.responsible || "N/A",
        backup_go: roles.Backup.go ? "Yes" : "No",
      })),
    });

    const buffer = doc.getZip().generate({ type: "nodebuffer" });

    // Set headers and send the document
    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename=${release.product_name}_${release.release_version}.docx`,
    });

    res.send(buffer);
  } catch (err) {
    console.error("Error generating document:", err);
    res.status(500).json({ message: "Error generating document" });
  }
});

module.exports = router;