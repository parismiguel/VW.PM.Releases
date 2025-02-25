import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid2,
  IconButton, Checkbox, Tabs, Tab
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const EditRelease = () => {
  const { id } = useParams();
  const [release, setRelease] = useState(null);
  const [newSystem, setNewSystem] = useState({
    system_name: "",
    environment: "",
  });
  const [newTask, setNewTask] = useState({
    task_type: "",
    description: "",
    owner: "",
    status: "",
  });
  const [newPreTask, setNewPreTask] = useState({
    description: "",
    owner: "",
    staging_complete: false,
    prod_complete: false,
  });
  const [newRisk, setNewRisk] = useState({ risk: "", remediation: "" });
  const [newApproval, setNewApproval] = useState({
    team: "",
    primary_approver: "",
    status: "",
  });
  const [newServer, setNewServer] = useState({
    server_name: "",
    environment: "",
  });
  const [newIssue, setNewIssue] = useState({
    jira_item: "",
    sf_solution: "",
    comments: "",
  });

  const [tabValue, setTabValue] = useState(0); // State for active tab

  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`/api/releases/${id}`)
      .then((res) => setRelease(res.data))
      .catch((err) => console.error(err));
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
    setRelease({
      ...release,
      systems_impacted: [...release.systems_impacted, newSystem],
    });
    setNewSystem({ system_name: "", environment: "" });
  };
  const deleteSystem = (index) => {
    setRelease({
      ...release,
      systems_impacted: release.systems_impacted.filter((_, i) => i !== index),
    });
  };

  // Handle Tasks
  const handleTaskChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };
  const addTask = () => {
    setRelease({ ...release, tasks: [...release.tasks, newTask] });
    setNewTask({ task_type: "", description: "", owner: "", status: "" });
  };
  const deleteTask = (index) => {
    setRelease({
      ...release,
      tasks: release.tasks.filter((_, i) => i !== index),
    });
  };

  // Pre-Deployment Tasks
  const handlePreTaskChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPreTask({
      ...newPreTask,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const addPreTask = () => {
    setRelease({
      ...release,
      pre_deployment_tasks: [...release.pre_deployment_tasks, newPreTask],
    });
    setNewPreTask({
      description: "",
      owner: "",
      staging_complete: false,
      prod_complete: false,
    });
  };
  const deletePreTask = (index) => {
    setRelease({
      ...release,
      pre_deployment_tasks: release.pre_deployment_tasks.filter(
        (_, i) => i !== index
      ),
    });
  };

  // Handle Risks
  const handleRiskChange = (e) => {
    setNewRisk({ ...newRisk, [e.target.name]: e.target.value });
  };
  const addRisk = () => {
    setRelease({ ...release, risks: [...release.risks, newRisk] });
    setNewRisk({ risk: "", remediation: "" });
  };
  const deleteRisk = (index) => {
    setRelease({
      ...release,
      risks: release.risks.filter((_, i) => i !== index),
    });
  };

  // Handle Approvals
  const handleApprovalChange = (e) => {
    setNewApproval({ ...newApproval, [e.target.name]: e.target.value });
  };
  const addApproval = () => {
    setRelease({
      ...release,
      approvals: [
        ...release.approvals,
        { ...newApproval, approval_date: new Date() },
      ],
    });
    setNewApproval({ team: "", primary_approver: "", status: "" });
  };
  const deleteApproval = (index) => {
    setRelease({
      ...release,
      approvals: release.approvals.filter((_, i) => i !== index),
    });
  };

  // Target Servers
  const handleServerChange = (e) =>
    setNewServer({ ...newServer, [e.target.name]: e.target.value });
  const addServer = () => {
    setRelease({
      ...release,
      target_servers: [...release.target_servers, newServer],
    });
    setNewServer({ server_name: "", environment: "" });
  };
  const deleteServer = (index) => {
    setRelease({
      ...release,
      target_servers: release.target_servers.filter((_, i) => i !== index),
    });
  };

  // Issues
  const handleIssueChange = (e) =>
    setNewIssue({ ...newIssue, [e.target.name]: e.target.value });
  const addIssue = () => {
    setRelease({ ...release, issues: [...release.issues, newIssue] });
    setNewIssue({ jira_item: "", sf_solution: "", comments: "" });
  };
  const deleteIssue = (index) => {
    setRelease({
      ...release,
      issues: release.issues.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/releases/${id}`, release);
      navigate(`/releases/${id}`);
    } catch (err) {
      console.error("Error updating release:", err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!release) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Typography variant="h4" gutterBottom>
          Edit Release: {release.release_version}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="edit release tabs">
            <Tab label="Release Info" />
            <Tab label="Systems & Servers" />
            <Tab label="Tasks" />
            <Tab label="Issues & Risks" />
            <Tab label="Approvals" />
          </Tabs>

          {/* Tab 0: Release Info */}
          {tabValue === 0 && (
            <Box mt={2}>
              <Grid2 container spacing={2}>
                <Grid2 item xs={12}>
                  <TextField fullWidth label="Product Name" name="product_name" value={release.product_name} onChange={handleChange} />
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <TextField fullWidth label="Release Version" name="release_version" value={release.release_version} onChange={handleChange} />
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <TextField fullWidth label="Release Type" name="release_type" value={release.release_type} onChange={handleChange} />
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <TextField fullWidth label="Deployment Date" type="date" name="deployment_date" value={release.deployment_date ? release.deployment_date.split('T')[0] : ''} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <TextField fullWidth label="Deployment Time" name="deployment_time" value={release.deployment_time} onChange={handleChange} />
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <TextField fullWidth label="Deployment Duration" name="deployment_duration" value={release.deployment_duration} onChange={handleChange} />
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <TextField fullWidth label="Downtime" name="downtime" value={release.downtime} onChange={handleChange} />
                </Grid2>
                <Grid2 item xs={12}>
                  <TextField fullWidth label="Resources Responsible" name="resources_responsible" value={release.resources_responsible} onChange={handleChange} />
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                  <TextField fullWidth label="Status" name="status" value={release.status} onChange={handleChange} />
                </Grid2>
              </Grid2>
            </Box>
          )}

          {/* Tab 1: Systems & Servers */}
          {tabValue === 1 && (
            <Box mt={2}>
              <Typography variant="h6">Systems Impacted</Typography>
              <Paper elevation={1} sx={{ p: 2 }}>
                <List>
                  {release.systems_impacted.map((system, index) => (
                    <ListItem key={index} secondaryAction={<IconButton edge="end" onClick={() => deleteSystem(index)}><DeleteIcon /></IconButton>}>
                      <ListItemText primary={`${system.system_name} (${system.environment})`} />
                    </ListItem>
                  ))}
                </List>
                <Grid2 container spacing={2}>
                  <Grid2 item xs={5}><TextField fullWidth label="System Name" name="system_name" value={newSystem.system_name} onChange={handleSystemChange} /></Grid2>
                  <Grid2 item xs={5}><TextField fullWidth label="Environment" name="environment" value={newSystem.environment} onChange={handleSystemChange} /></Grid2>
                  <Grid2 item xs={2}><Button variant="contained" startIcon={<AddIcon />} onClick={addSystem}>Add</Button></Grid2>
                </Grid2>
              </Paper>

              <Typography variant="h6" sx={{ mt: 2 }}>Target Servers</Typography>
              <Paper elevation={1} sx={{ p: 2 }}>
                <List>
                  {release.target_servers.map((server, index) => (
                    <ListItem key={index} secondaryAction={<IconButton edge="end" onClick={() => deleteServer(index)}><DeleteIcon /></IconButton>}>
                      <ListItemText primary={`${server.server_name} (${server.environment})`} />
                    </ListItem>
                  ))}
                </List>
                <Grid2 container spacing={2}>
                  <Grid2 item xs={5}><TextField fullWidth label="Server Name" name="server_name" value={newServer.server_name} onChange={handleServerChange} /></Grid2>
                  <Grid2 item xs={5}><TextField fullWidth label="Environment" name="environment" value={newServer.environment} onChange={handleServerChange} /></Grid2>
                  <Grid2 item xs={2}><Button variant="contained" startIcon={<AddIcon />} onClick={addServer}>Add</Button></Grid2>
                </Grid2>
              </Paper>
            </Box>
          )}

          {/* Tab 2: Tasks */}
          {tabValue === 2 && (
            <Box mt={2}>
              <Typography variant="h6">Tasks</Typography>
              <Paper elevation={1} sx={{ p: 2 }}>
                <List>
                  {release.tasks.map((task, index) => (
                    <ListItem key={index} secondaryAction={<IconButton edge="end" onClick={() => deleteTask(index)}><DeleteIcon /></IconButton>}>
                      <ListItemText primary={`${task.task_type}: ${task.description} - ${task.owner} (${task.status})`} />
                    </ListItem>
                  ))}
                </List>
                <Grid2 container spacing={2}>
                  <Grid2 item xs={3}><TextField fullWidth label="Task Type" name="task_type" value={newTask.task_type} onChange={handleTaskChange} /></Grid2>
                  <Grid2 item xs={3}><TextField fullWidth label="Description" name="description" value={newTask.description} onChange={handleTaskChange} /></Grid2>
                  <Grid2 item xs={3}><TextField fullWidth label="Owner" name="owner" value={newTask.owner} onChange={handleTaskChange} /></Grid2>
                  <Grid2 item xs={2}><TextField fullWidth label="Status" name="status" value={newTask.status} onChange={handleTaskChange} /></Grid2>
                  <Grid2 item xs={1}><Button variant="contained" startIcon={<AddIcon />} onClick={addTask}>Add</Button></Grid2>
                </Grid2>
              </Paper>

              <Typography variant="h6" sx={{ mt: 2 }}>Pre-Deployment Tasks</Typography>
              <Paper elevation={1} sx={{ p: 2 }}>
                <List>
                  {release.pre_deployment_tasks.map((task, index) => (
                    <ListItem key={index} secondaryAction={<IconButton edge="end" onClick={() => deletePreTask(index)}><DeleteIcon /></IconButton>}>
                      <ListItemText primary={`${task.description} - ${task.owner} (Staging: ${task.staging_complete ? 'Yes' : 'No'}, Prod: ${task.prod_complete ? 'Yes' : 'No'})`} />
                    </ListItem>
                  ))}
                </List>
                <Grid2 container spacing={2}>
                  <Grid2 item xs={4}><TextField fullWidth label="Description" name="description" value={newPreTask.description} onChange={handlePreTaskChange} /></Grid2>
                  <Grid2 item xs={4}><TextField fullWidth label="Owner" name="owner" value={newPreTask.owner} onChange={handlePreTaskChange} /></Grid2>
                  <Grid2 item xs={1}><Checkbox name="staging_complete" checked={newPreTask.staging_complete} onChange={handlePreTaskChange} /> Staging</Grid2>
                  <Grid2 item xs={1}><Checkbox name="prod_complete" checked={newPreTask.prod_complete} onChange={handlePreTaskChange} /> Prod</Grid2>
                  <Grid2 item xs={2}><Button variant="contained" startIcon={<AddIcon />} onClick={addPreTask}>Add</Button></Grid2>
                </Grid2>
              </Paper>
            </Box>
          )}

          {/* Tab 3: Issues & Risks */}
          {tabValue === 3 && (
            <Box mt={2}>
              <Typography variant="h6">Known Issues</Typography>
              <Paper elevation={1} sx={{ p: 2 }}>
                <List>
                  {release.issues.map((issue, index) => (
                    <ListItem key={index} secondaryAction={<IconButton edge="end" onClick={() => deleteIssue(index)}><DeleteIcon /></IconButton>}>
                      <ListItemText primary={`JIRA: ${issue.jira_item}, SF: ${issue.sf_solution}, Comments: ${issue.comments}`} />
                    </ListItem>
                  ))}
                </List>
                <Grid2 container spacing={2}>
                  <Grid2 item xs={3}><TextField fullWidth label="JIRA Item" name="jira_item" value={newIssue.jira_item} onChange={handleIssueChange} /></Grid2>
                  <Grid2 item xs={3}><TextField fullWidth label="SF Solution" name="sf_solution" value={newIssue.sf_solution} onChange={handleIssueChange} /></Grid2>
                  <Grid2 item xs={4}><TextField fullWidth label="Comments" name="comments" value={newIssue.comments} onChange={handleIssueChange} /></Grid2>
                  <Grid2 item xs={2}><Button variant="contained" startIcon={<AddIcon />} onClick={addIssue}>Add</Button></Grid2>
                </Grid2>
              </Paper>

              <Typography variant="h6" sx={{ mt: 2 }}>Risks</Typography>
              <Paper elevation={1} sx={{ p: 2 }}>
                <List>
                  {release.risks.map((risk, index) => (
                    <ListItem key={index} secondaryAction={<IconButton edge="end" onClick={() => deleteRisk(index)}><DeleteIcon /></IconButton>}>
                      <ListItemText primary={`Risk: ${risk.risk} - Remediation: ${risk.remediation}`} />
                    </ListItem>
                  ))}
                </List>
                <Grid2 container spacing={2}>
                  <Grid2 item xs={5}><TextField fullWidth label="Risk" name="risk" value={newRisk.risk} onChange={handleRiskChange} /></Grid2>
                  <Grid2 item xs={5}><TextField fullWidth label="Remediation" name="remediation" value={newRisk.remediation} onChange={handleRiskChange} /></Grid2>
                  <Grid2 item xs={2}><Button variant="contained" startIcon={<AddIcon />} onClick={addRisk}>Add</Button></Grid2>
                </Grid2>
              </Paper>
            </Box>
          )}

          {/* Tab 4: Approvals */}
          {tabValue === 4 && (
            <Box mt={2}>
              <Typography variant="h6">Approvals</Typography>
              <Paper elevation={1} sx={{ p: 2 }}>
                <List>
                  {release.approvals.map((approval, index) => (
                    <ListItem key={index} secondaryAction={<IconButton edge="end" onClick={() => deleteApproval(index)}><DeleteIcon /></IconButton>}>
                      <ListItemText primary={`${approval.team}: ${approval.primary_approver} (${approval.status})`} />
                    </ListItem>
                  ))}
                </List>
                <Grid2 container spacing={2}>
                  <Grid2 item xs={4}><TextField fullWidth label="Team" name="team" value={newApproval.team} onChange={handleApprovalChange} /></Grid2>
                  <Grid2 item xs={4}><TextField fullWidth label="Primary Approver" name="primary_approver" value={newApproval.primary_approver} onChange={handleApprovalChange} /></Grid2>
                  <Grid2 item xs={2}><TextField fullWidth label="Status" name="status" value={newApproval.status} onChange={handleApprovalChange} /></Grid2>
                  <Grid2 item xs={2}><Button variant="contained" startIcon={<AddIcon />} onClick={addApproval}>Add</Button></Grid2>
                </Grid2>
              </Paper>
            </Box>
          )}

          <Box mt={4}>
            <Button variant="contained" color="primary" type="submit">
              Update Release
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default EditRelease;
