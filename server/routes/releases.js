const express = require("express");
const router = express.Router();
const Release = require("../models/Release");
const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");

const fs = require("fs");
const path = require("path");

const generateWordDocument = require("../utils/generateWordDocument");

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

router.get("/validate-version/:version", async (req, res) => {
  try {
    const { version } = req.params;
    const existingRelease = await Release.findOne({ release_version: version });
    if (existingRelease) {
      return res
        .status(400)
        .json({ message: "Release version already exists" });
    }
    res.status(200).json({ message: "Release version is valid" });
  } catch (err) {
    console.error("Error validating release version:", err);
    res.status(500).json({ message: "Error validating release version" });
  }
});

// Create a new release
router.post("/", async (req, res) => {
  const existingRelease = await Release.findOne({
    release_version: req.body.release_version,
  });
  if (existingRelease) {
    return res.status(400).json({ message: "Release version already exists" });
  }

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
    const existingRelease = await Release.findOne({
      release_version: req.body.release_version,
      _id: { $ne: req.params.id }, // Exclude the current release ID
    });

    if (existingRelease) {
      return res
        .status(400)
        .json({ message: "Release version already exists" });
    }

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
      console.error("Template file not found at:", templatePath);
      return res.status(500).json({ message: "Template file not found" });
    }

    const content = fs.readFileSync(templatePath, "binary");
    console.log("Template content length:", content.length);

    const zip = new PizZip(content);
    console.log("Zip content keys:", Object.keys(zip.files));

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: "{{", end: "}}" },
    });

    // Render the document with data
    const data = {
      // Common Information
      productName: release.product_name || "N/A",
      releaseVersion: release.release_version || "N/A",
      releaseType: release.release_type || "N/A",
      status: release.status || "N/A",
      jiraReleaseFilter: release.jira_release_filter || "N/A",

      // Audit Information
      createdAt: new Date(release.createdAt).toLocaleString(),
      createdBy: release.createdBy || "N/A",
      modifiedAt: new Date(release.modifiedAt).toLocaleString(),
      modifiedBy: release.modifiedBy || "N/A",

      // Staging Environment
      stagingDeploymentDate: release.staging?.deployment_date || "N/A",
      stagingDeploymentTime: release.staging?.deployment_time || "N/A",
      stagingDeploymentDuration: release.staging?.deployment_duration || "N/A",
      stagingDowntime: release.staging?.downtime || "N/A",
      stagingInformedResources: release.staging?.informed_resources
        ? "Yes"
        : "No",
      stagingSystemsImpacted:
        release.staging?.systems_impacted?.join(", ") || "N/A",
      stagingTargetServers:
        release.staging?.target_servers?.join(", ") || "N/A",
      stagingResourcesResponsible:
        release.staging?.resources_responsible?.join(", ") || "N/A",

      // Production Environment
      productionDeploymentDate: release.production?.deployment_date || "N/A",
      productionDeploymentTime: release.production?.deployment_time || "N/A",
      productionDeploymentDuration:
        release.production?.deployment_duration || "N/A",
      productionDowntime: release.production?.downtime || "N/A",
      productionInformedResources: release.production?.informed_resources
        ? "Yes"
        : "No",
      productionSystemsImpacted:
        release.production?.systems_impacted?.join(", ") || "N/A",
      productionTargetServers:
        release.production?.target_servers?.join(", ") || "N/A",
      productionResourcesResponsible:
        release.production?.resources_responsible?.join(", ") || "N/A",

      // Pre-Requisite Checklist
      prerequisiteData: release.prerequisiteData.map((item, index) => ({
        seq: index + 1,
        criteria: item.criteria,
        status: item.status ? "Complete" : "Incomplete",
        exceptions: item.exceptions || "N/A",
      })),

      // Readiness Checklist
      readinessData: release.readinessData.map((item, index) => ({
        seq: index + 1,
        criteria: item.criteria,
        status: item.status ? "Complete" : "Incomplete",
        exceptions: item.exceptions || "N/A",
      })),

      // Pre-Deployment Tasks
      preDeploymentTasks: release.preDeploymentTasks.map((task, index) => ({
        seq: index + 1,
        description: task.description,
        owner: task.owner || "N/A",
        stagingComplete: task.stagingComplete ? "Yes" : "No",
        prodComplete: task.prodComplete ? "Yes" : "No",
      })),

      // Deployment Risks
      risks: release.risks.map((risk, index) => ({
        seq: index + 1,
        risk: risk.risk,
        remediation: risk.remediation,
      })),

      // Validation Tasks
      validationTasks: release.validationTasks.map((task, index) => ({
        seq: index + 1,
        repositoryName: task.repositoryName || "N/A",
        releaseLink: task.releaseLink || "N/A",
        resource: task.resource || "N/A",
        beginEndTime: task.beginEndTime || "N/A",
        stagingComments: task.stagingComments || "N/A",
        prodComments: task.prodComments || "N/A",
      })),

      // Post-Deployment Tasks
      postDeploymentTasks: release.postDeploymentTasks.map((task, index) => ({
        seq: index + 1,
        task: task.task,
        resource: task.resource || "N/A",
        beginEndTime: task.beginEndTime || "N/A",
        stagingComments: task.stagingComments || "N/A",
        prodComments: task.prodComments || "N/A",
      })),

      // Post-Deployment Issues
      postDeploymentIssues: release.postDeploymentIssues.map(
        (issue, index) => ({
          seq: index + 1,
          id: issue.id || "N/A",
          title: issue.title || "N/A",
          sfSolution: issue.sfSolution || "N/A",
          workItemType: issue.workItemType || "N/A",
          tfsRelease: issue.tfsRelease || "N/A",
          comments: issue.comments || "N/A",
        })
      ),

      // Known Issues
      knownIssues: release.knownIssues.map((issue, index) => ({
        seq: index + 1,
        jiraItem: issue.jiraItem || "N/A",
        sfSolution: issue.sfSolution || "N/A",
        proposedRelease: issue.proposedRelease || "N/A",
        comments: issue.comments || "N/A",
      })),

      // Go / No Go
      goNoGo: Object.entries(release.goNoGo).map(([group, roles]) => ({
        group,
        primaryResponsible: roles.Primary.responsible || "N/A",
        primaryGo: roles.Primary.go ? "Yes" : "No",
        backupResponsible: roles.Backup.responsible || "N/A",
        backupGo: roles.Backup.go ? "Yes" : "No",
      })),

      screenshots: release.screenshots.map((screenshot, index) => ({
        url: screenshot.url,
      })),
    };

    console.log("Data for template rendering:", JSON.stringify(data, null, 2));

    try {
      doc.render(data);
    } catch (error) {
      console.error("Error rendering document:", error);
      if (error.properties && error.properties.errors) {
        console.error("Template errors:", error.properties.errors);
      }
      return res.status(500).json({ message: "Error rendering document" });
    }

    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    console.log("Generated document buffer size:", buffer.length);

    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename=${release.product_name}_${release.release_version}.docx`,
    });

    res.send(buffer);
  } catch (err) {
    console.error("Error generating document:", err);
    res.status(500).json({ message: "Error generating document" });
  }
});

// New endpoint to generate Word document using `docx`

router.get("/:id/document-new", async (req, res) => {
  try {
    const release = await Release.findById(req.params.id);
    if (!release) return res.status(404).json({ message: "Release not found" });

    // Generate the Word document
    const buffer = await generateWordDocument(release);

    // Send the document as a response
    res.set({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename=${release.product_name}_${release.release_version}_new.docx`,
    });
    res.send(buffer);
  } catch (err) {
    console.error("Error generating document:", err);
    res.status(500).json({ message: "Error generating document" });
  }
});


module.exports = router;
