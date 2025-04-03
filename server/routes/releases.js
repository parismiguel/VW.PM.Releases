const express = require("express");
const router = express.Router();
const Release = require("../models/Release");

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
      staging: {
        deployment_date: req.body.staging.deployment_date,
        deployment_time: req.body.staging.deployment_time,
        deployment_duration: req.body.staging.deployment_duration,
        downtime: req.body.staging.downtime,
        informed_resources: req.body.staging.informed_resources,
        systems_impacted: req.body.staging.systems_impacted,
        target_servers: req.body.staging.target_servers,
        resources_responsible: req.body.staging.resources_responsible,
      },
      production: {
        deployment_date: req.body.production.deployment_date,
        deployment_time: req.body.production.deployment_time,
        deployment_duration: req.body.production.deployment_duration,
        downtime: req.body.production.downtime,
        informed_resources: req.body.production.informed_resources,
        systems_impacted: req.body.production.systems_impacted,
        target_servers: req.body.production.target_servers,
        resources_responsible: req.body.production.resources_responsible,
      },
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
    release.staging = {
      deployment_date: req.body.staging.deployment_date,
      deployment_time: req.body.staging.deployment_time,
      deployment_duration: req.body.staging.deployment_duration,
      downtime: req.body.staging.downtime,
      informed_resources: req.body.staging.informed_resources,
      systems_impacted: req.body.staging.systems_impacted,
      target_servers: req.body.staging.target_servers,
      resources_responsible: req.body.staging.resources_responsible,
    };
    release.production = {
      deployment_date: req.body.production.deployment_date,
      deployment_time: req.body.production.deployment_time,
      deployment_duration: req.body.production.deployment_duration,
      downtime: req.body.production.downtime,
      informed_resources: req.body.production.informed_resources,
      systems_impacted: req.body.production.systems_impacted,
      target_servers: req.body.production.target_servers,
      resources_responsible: req.body.production.resources_responsible,
    };

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

    // Set data for the template
    doc.setData({
      product_name: release.product_name,
      release_version: release.release_version,
      release_type: release.release_type,
      status: release.status,
      staging_deployment_date: release.staging?.deployment_date || "N/A",
      staging_resources_responsible: release.staging?.resources_responsible?.join(", ") || "N/A",
      production_deployment_date: release.production?.deployment_date || "N/A",
      production_resources_responsible: release.production?.resources_responsible?.join(", ") || "N/A",
    });

    // Render the document
    try {
      doc.render();
    } catch (error) {
      console.error("Error rendering document:", error);
      return res.status(500).json({ message: "Error rendering document" });
    }

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