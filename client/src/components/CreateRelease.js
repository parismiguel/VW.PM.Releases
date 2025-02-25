import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box, Grid2 } from '@mui/material';

const CreateRelease = () => {
  const [formData, setFormData] = useState({
    product_name: 'Uprise',
    release_version: '',
    release_type: '',
    deployment_date: '',
    deployment_time: '',
    deployment_duration: '',
    downtime: '',
    resources_responsible: '',
    status: 'Draft',
    systems_impacted: [],
    tasks: [],
    risks: [],
    approvals: []
  });
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/api/releases', formData);
      navigate(`/releases/${res.data._id}`);
    } catch (err) {
      console.error('Error creating release:', err);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Typography variant="h4" gutterBottom>
          Create New Release
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                required
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Release Version"
                name="release_version"
                value={formData.release_version}
                onChange={handleChange}
                required
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Release Type"
                name="release_type"
                value={formData.release_type}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deployment Date"
                type="date"
                name="deployment_date"
                value={formData.deployment_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deployment Time"
                name="deployment_time"
                value={formData.deployment_time}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deployment Duration"
                name="deployment_duration"
                value={formData.deployment_duration}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Downtime"
                name="downtime"
                value={formData.downtime}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                fullWidth
                label="Resources Responsible"
                name="resources_responsible"
                value={formData.resources_responsible}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              />
            </Grid2>
          </Grid2>
          <Box mt={4}>
           <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Create
            </Button>
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
        </form>
      </Box>
    </Container>
  );
};

export default CreateRelease;