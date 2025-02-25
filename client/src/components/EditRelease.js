import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button, TextField, Typography, Container, Box, List, ListItem, ListItemText,
  Paper, Grid2, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const EditRelease = () => {
  const { id } = useParams();
  const [release, setRelease] = useState(null);
  const [newSystem, setNewSystem] = useState({ system_name: '', environment: '' });
  const [newTask, setNewTask] = useState({ task_type: '', description: '', owner: '', status: '' });
  const [newRisk, setNewRisk] = useState({ risk: '', remediation: '' });
  const [newApproval, setNewApproval] = useState({ team: '', primary_approver: '', status: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get(`/api/releases/${id}`)
      .then(res => setRelease(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleChange = (e) => {
    setRelease({ ...release, [e.target.name]: e.target.value });
  };

  // Handle Systems Impacted
  const handleSystemChange = (e) => {
    setNewSystem({ ...newSystem, [e.target.name]: e.target.value });
  };
  const addSystem = () => {
    setRelease({ ...release, systems_impacted: [...release.systems_impacted, newSystem] });
    setNewSystem({ system_name: '', environment: '' });
  };
  const deleteSystem = (index) => {
    setRelease({ ...release, systems_impacted: release.systems_impacted.filter((_, i) => i !== index) });
  };

  // Handle Tasks
  const handleTaskChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };
  const addTask = () => {
    setRelease({ ...release, tasks: [...release.tasks, newTask] });
    setNewTask({ task_type: '', description: '', owner: '', status: '' });
  };
  const deleteTask = (index) => {
    setRelease({ ...release, tasks: release.tasks.filter((_, i) => i !== index) });
  };

  // Handle Risks
  const handleRiskChange = (e) => {
    setNewRisk({ ...newRisk, [e.target.name]: e.target.value });
  };
  const addRisk = () => {
    setRelease({ ...release, risks: [...release.risks, newRisk] });
    setNewRisk({ risk: '', remediation: '' });
  };
  const deleteRisk = (index) => {
    setRelease({ ...release, risks: release.risks.filter((_, i) => i !== index) });
  };

  // Handle Approvals
  const handleApprovalChange = (e) => {
    setNewApproval({ ...newApproval, [e.target.name]: e.target.value });
  };
  const addApproval = () => {
    setRelease({ ...release, approvals: [...release.approvals, { ...newApproval, approval_date: new Date() }] });
    setNewApproval({ team: '', primary_approver: '', status: '' });
  };
  const deleteApproval = (index) => {
    setRelease({ ...release, approvals: release.approvals.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/releases/${id}`, release);
      navigate(`/releases/${id}`);
    } catch (err) {
      console.error('Error updating release:', err);
    }
  };

  if (!release) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Typography variant="h4" gutterBottom>
          Edit Release: {release.release_version}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="product_name"
                value={release.product_name}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Release Version"
                name="release_version"
                value={release.release_version}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Release Type"
                name="release_type"
                value={release.release_type}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deployment Date"
                type="date"
                name="deployment_date"
                value={release.deployment_date ? release.deployment_date.split('T')[0] : ''}
                onChange={handleChange}
                inputLabel={{ shrink: true }}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deployment Time"
                name="deployment_time"
                value={release.deployment_time}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deployment Duration"
                name="deployment_duration"
                value={release.deployment_duration}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Downtime"
                name="downtime"
                value={release.downtime}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                fullWidth
                label="Resources Responsible"
                name="resources_responsible"
                value={release.resources_responsible}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Status"
                name="status"
                value={release.status}
                onChange={handleChange}
              />
            </Grid2>
          </Grid2>

          {/* Systems Impacted */}
          <Box mt={4}>
            <Typography variant="h6">Systems Impacted</Typography>
            <Paper elevation={1} sx={{ p: 2 }}>
              <List>
                {release.systems_impacted.map((system, index) => (
                  <ListItem key={index} secondaryAction={
                    <IconButton edge="end" onClick={() => deleteSystem(index)}>
                      <DeleteIcon />
                    </IconButton>
                  }>
                    <ListItemText primary={`${system.system_name} (${system.environment})`} />
                  </ListItem>
                ))}
              </List>
              <Grid2 container spacing={2}>
                <Grid2 item xs={5}>
                  <TextField
                    fullWidth
                    label="System Name"
                    name="system_name"
                    value={newSystem.system_name}
                    onChange={handleSystemChange}
                  />
                </Grid2>
                <Grid2 item xs={5}>
                  <TextField
                    fullWidth
                    label="Environment"
                    name="environment"
                    value={newSystem.environment}
                    onChange={handleSystemChange}
                  />
                </Grid2>
                <Grid2 item xs={2}>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={addSystem}>
                    Add
                  </Button>
                </Grid2>
              </Grid2>
            </Paper>
          </Box>

          {/* Tasks */}
          <Box mt={4}>
            <Typography variant="h6">Tasks</Typography>
            <Paper elevation={1} sx={{ p: 2 }}>
              <List>
                {release.tasks.map((task, index) => (
                  <ListItem key={index} secondaryAction={
                    <IconButton edge="end" onClick={() => deleteTask(index)}>
                      <DeleteIcon />
                    </IconButton>
                  }>
                    <ListItemText primary={`${task.task_type}: ${task.description} - ${task.owner} (${task.status})`} />
                  </ListItem>
                ))}
              </List>
              <Grid2 container spacing={2}>
                <Grid2 item xs={3}>
                  <TextField
                    fullWidth
                    label="Task Type"
                    name="task_type"
                    value={newTask.task_type}
                    onChange={handleTaskChange}
                  />
                </Grid2>
                <Grid2 item xs={3}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={newTask.description}
                    onChange={handleTaskChange}
                  />
                </Grid2>
                <Grid2 item xs={3}>
                  <TextField
                    fullWidth
                    label="Owner"
                    name="owner"
                    value={newTask.owner}
                    onChange={handleTaskChange}
                  />
                </Grid2>
                <Grid2 item xs={2}>
                  <TextField
                    fullWidth
                    label="Status"
                    name="status"
                    value={newTask.status}
                    onChange={handleTaskChange}
                  />
                </Grid2>
                <Grid2 item xs={1}>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={addTask}>
                    Add
                  </Button>
                </Grid2>
              </Grid2>
            </Paper>
          </Box>

          {/* Risks */}
          <Box mt={4}>
            <Typography variant="h6">Risks</Typography>
            <Paper elevation={1} sx={{ p: 2 }}>
              <List>
                {release.risks.map((risk, index) => (
                  <ListItem key={index} secondaryAction={
                    <IconButton edge="end" onClick={() => deleteRisk(index)}>
                      <DeleteIcon />
                    </IconButton>
                  }>
                    <ListItemText primary={`Risk: ${risk.risk} - Remediation: ${risk.remediation}`} />
                  </ListItem>
                ))}
              </List>
              <Grid2 container spacing={2}>
                <Grid2 item xs={5}>
                  <TextField
                    fullWidth
                    label="Risk"
                    name="risk"
                    value={newRisk.risk}
                    onChange={handleRiskChange}
                  />
                </Grid2>
                <Grid2 item xs={5}>
                  <TextField
                    fullWidth
                    label="Remediation"
                    name="remediation"
                    value={newRisk.remediation}
                    onChange={handleRiskChange}
                  />
                </Grid2>
                <Grid2 item xs={2}>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={addRisk}>
                    Add
                  </Button>
                </Grid2>
              </Grid2>
            </Paper>
          </Box>

          {/* Approvals */}
          <Box mt={4}>
            <Typography variant="h6">Approvals</Typography>
            <Paper elevation={1} sx={{ p: 2 }}>
              <List>
                {release.approvals.map((approval, index) => (
                  <ListItem key={index} secondaryAction={
                    <IconButton edge="end" onClick={() => deleteApproval(index)}>
                      <DeleteIcon />
                    </IconButton>
                  }>
                    <ListItemText primary={`${approval.team}: ${approval.primary_approver} (${approval.status})`} />
                  </ListItem>
                ))}
              </List>
              <Grid2 container spacing={2}>
                <Grid2 item xs={4}>
                  <TextField
                    fullWidth
                    label="Team"
                    name="team"
                    value={newApproval.team}
                    onChange={handleApprovalChange}
                  />
                </Grid2>
                <Grid2 item xs={4}>
                  <TextField
                    fullWidth
                    label="Primary Approver"
                    name="primary_approver"
                    value={newApproval.primary_approver}
                    onChange={handleApprovalChange}
                  />
                </Grid2>
                <Grid2 item xs={2}>
                  <TextField
                    fullWidth
                    label="Status"
                    name="status"
                    value={newApproval.status}
                    onChange={handleApprovalChange}
                  />
                </Grid2>
                <Grid2 item xs={2}>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={addApproval}>
                    Add
                  </Button>
                </Grid2>
              </Grid2>
            </Paper>
          </Box>

          <Box mt={4}>
            <Button variant="contained" color="primary" type="submit">
              Update Release
            </Button>
          </Box>
        </form>

        <Button
              fullWidth
              variant="outlined"
              color="secondary"
              sx={{ mt: 1 }}
              onClick={handleBack}
            >
              Back
            </Button>
      </Box>
    </Container>
  );
};

export default EditRelease;