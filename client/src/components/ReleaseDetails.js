import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import {
  Typography,
  Container,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Stack,
  Alert,
} from "@mui/material";

const ReleaseDetails = () => {
  const { id } = useParams();
  const [release, setRelease] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/"); // Navigate back to the previous page
  };

  useEffect(() => {
    axiosInstance
      .get(`/api/releases/${id}`)
      .then((res) => setRelease(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit/${id}`); // Navigate to the edit page for this release
  };

  const handleGenerateDocument = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/releases/${id}/document`, {
        responseType: "blob", // Important for file download
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${release.product_name}_${release.release_version}.docx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccess("Document downloaded successfully");
      setTimeout(() => setSuccess(""), 3000); // Clear after 3s
    } catch (err) {
      console.error("Error downloading document:", err);
      alert("Failed to generate document");
    } finally {
      setLoading(false);
    }
  };

  if (!release) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth='md'>
      <Box mt={4} mb={4}>
        <Typography variant='h4' gutterBottom>
          {release.product_name} - {release.release_version}
        </Typography>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant='h6'>Release Information</Typography>
          <Typography>Type: {release.release_type}</Typography>
          <Typography>Status: {release.status}</Typography>
          <Typography>
            Deployment Date:{" "}
            {release.deployment_date
              ? new Date(release.deployment_date).toLocaleDateString()
              : "N/A"}
          </Typography>
          <Typography>Time: {release.deployment_time || "N/A"}</Typography>
          <Typography>
            Duration: {release.deployment_duration || "N/A"}
          </Typography>
          <Typography>Downtime: {release.downtime || "N/A"}</Typography>
          <Typography>
            Resources: {release.resources_responsible || "N/A"}
          </Typography>
        </Paper>

        <Box mt={2}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant='h6'>Systems Impacted</Typography>
            <List>
              {release.systems_impacted.map((system, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${system.system_name} (${system.environment})`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        <Box mt={2}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant='h6'>Tasks</Typography>
            <List>
              {release.tasks.map((task, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${task.task_type}: ${task.description} - ${task.owner} (${task.status})`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        <Box mt={2}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant='h6'>Risks</Typography>
            <List>
              {release.risks.map((risk, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Risk: ${risk.risk} - Remediation: ${risk.remediation}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        <Box mt={2}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant='h6'>Approvals</Typography>
            <List>
              {release.approvals.map((approval, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${approval.team}: ${approval.primary_approver} (${approval.status})`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        <Box mt={4}>
          {success && (
            <Alert severity='success' sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <Stack direction='row' spacing={2} justifyContent='flex-end'>
            <Button
              disabled={loading}
              variant='contained'
              color='primary'
              onClick={handleGenerateDocument}
            >
              {loading ? "Generating..." : "Generate Document"}
            </Button>
            <Button variant='contained' color='secondary' onClick={handleEdit}>
              Edit
            </Button>

            <Button variant='outlined' color='secondary' onClick={handleBack}>
              Back
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default ReleaseDetails;
