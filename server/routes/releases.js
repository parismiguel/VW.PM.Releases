const express = require('express');
const router = express.Router();
const Release = require('../models/Release');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const fs = require('fs');
const path = require('path');

// Get all releases
router.get('/', async (req, res) => {
  try {
    const releases = await Release.find();
    res.json(releases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single release by ID
router.get('/:id', async (req, res) => {
  try {
    const release = await Release.findById(req.params.id);
    if (!release) return res.status(404).json({ message: 'Release not found' });
    res.json(release);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new release
router.post('/', async (req, res) => {
  try {
    const release = new Release(req.body);
    await release.save();
    res.status(201).json(release);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an existing release
router.put('/:id', async (req, res) => {
  try {
    const release = await Release.findById(req.params.id);
    if (!release) return res.status(404).json({ message: 'Release not found' });
    Object.assign(release, req.body);
    await release.save();
    res.json(release);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a release
router.delete('/:id', async (req, res) => {
  try {
    const release = await Release.findById(req.params.id);
    if (!release) return res.status(404).json({ message: 'Release not found' });
    await Release.deleteOne({ _id: req.params.id });
    res.json({ message: 'Release deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate Word document
router.get('/:id/document', async (req, res) => {
  try {
    const release = await Release.findById(req.params.id);
    if (!release) return res.status(404).json({ message: 'Release not found' });

    const templatePath = path.join(__dirname, '../template.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    doc.setData({
      product_name: release.product_name,
      release_version: release.release_version,
      release_type: release.release_type,
      deployment_date: release.deployment_date ? release.deployment_date.toISOString().split('T')[0] : '',
      deployment_time: release.deployment_time || '',
      deployment_duration: release.deployment_duration || '',
      downtime: release.downtime || '',
      resources_responsible: release.resources_responsible || '',
      status: release.status,
      systems_impacted: release.systems_impacted.map(s => ({
        system_name: s.system_name,
        environment: s.environment
      })),
      target_servers: release.target_servers.map(s => ({
        server_name: s.server_name,
        environment: s.environment
      })),
      tasks: release.tasks.map(t => ({
        task_type: t.task_type,
        description: t.description,
        owner: t.owner,
        status: t.status
      })),
      issues: release.issues.map(i => ({
        jira_item: i.jira_item,
        sf_solution: i.sf_solution,
        comments: i.comments
      })),
      risks: release.risks.map(r => ({
        risk: r.risk,
        remediation: r.remediation
      })),
      approvals: release.approvals.map(a => ({
        team: a.team,
        primary_approver: a.primary_approver,
        status: a.status,
        approval_date: a.approval_date ? a.approval_date.toISOString().split('T')[0] : ''
      }))
    });

    doc.render();
    const buf = doc.getZip().generate({ type: 'nodebuffer' });

    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.set('Content-Disposition', `attachment; filename=${release.product_name}_${release.release_version}.docx`);
    res.send(buf);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;