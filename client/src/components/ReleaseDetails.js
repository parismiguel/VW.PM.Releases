import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import {
  Typography,
  Container,
  Box,
  Button,
  Paper,
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
      debugger
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
          <Typography variant='h6'>Common Information</Typography>
          <Typography>Type: {release.release_type}</Typography>
          <Typography>Status: {release.status}</Typography>
          <Typography>
            JIRA Release Filter:{" "}
            {release.jira_release_filter ? (
              <a
                href={release.jira_release_filter}
                target='_blank'
                rel='noopener noreferrer'
              >
                {release.jira_release_filter}
              </a>
            ) : (
              "N/A"
            )}
          </Typography>
        </Paper>

        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant='h6'>Audit Information</Typography>
          <Typography>
            Created At: {new Date(release.createdAt).toLocaleString()}
          </Typography>
          <Typography>Created By: {release.createdBy || "N/A"}</Typography>
          <Typography>
            Last Modified At: {new Date(release.modifiedAt).toLocaleString()}
          </Typography>
          <Typography>
            Last Modified By: {release.modifiedBy || "N/A"}
          </Typography>
        </Paper>

        {/* Staging Environment */}
        <Box mt={2}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant='h6'>Staging</Typography>
            <Typography>
              Deployment Date:{" "}
              {release.staging?.deployment_date
                ? new Date(release.staging.deployment_date).toLocaleDateString()
                : "N/A"}
            </Typography>
            <Typography>
              Resources Responsible:{" "}
              {release.staging?.resources_responsible?.join(", ") || "N/A"}
            </Typography>
          </Paper>
        </Box>

        {/* Production Environment */}
        <Box mt={2}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant='h6'>Production</Typography>
            <Typography>
              Deployment Date:{" "}
              {release.production?.deployment_date
                ? new Date(
                    release.production.deployment_date
                  ).toLocaleDateString()
                : "N/A"}
            </Typography>
            <Typography>
              Resources Responsible:{" "}
              {release.production?.resources_responsible?.join(", ") || "N/A"}
            </Typography>
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
