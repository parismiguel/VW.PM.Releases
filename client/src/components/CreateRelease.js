import React, { useState } from "react";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";

const CreateRelease = () => {
  const [formData, setFormData] = useState({
    product_name: "Uprise",
    release_version: "",
    release_type: "",
    status: "Planned",
    staging: {
      deployment_date: "",
      resources_responsible: [],
    },
    production: {
      deployment_date: "",
      resources_responsible: [],
    },
    createdBy: "currentUserId", // Replace with the actual user ID or name
    modifiedBy: "currentUserId", // Set the same value as createdBy during creation
  });

  const navigate = useNavigate();

  const productOptions = ["Uprise", "Ordering Platform", "Support Tools"];
  const releaseTypeOptions = ["Scheduled Release", "Hotfix", "Beta Release"];
  const statusOptions = ["Planned", "In Progress", "Completed"];

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEnvironmentChange = (e, environment) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [environment]: {
        ...formData[environment],
        [name]: value,
      },
    });
  };

  const handleTagsChange = (event, value, environment) => {
    setFormData({
      ...formData,
      [environment]: {
        ...formData[environment],
        resources_responsible: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.release_version) {
      alert("Release Version is required");
      return;
    }

    try {
      const res = await axiosInstance.post("/api/releases", formData);
      navigate(`/releases/${res.data._id}`);
    } catch (err) {
      console.error("Error creating release:", err);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Typography variant="h4" gutterBottom>
          Create New Release
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Common Information */}
          <Box mt={2}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel id="product-name-label">Product Name</InputLabel>
              <Select
                labelId="product-name-label"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                label="Product Name"
                required
              >
                {productOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Release Version"
              name="release_version"
              value={formData.release_version}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel id="release-type-label">Release Type</InputLabel>
              <Select
                labelId="release-type-label"
                name="release_type"
                value={formData.release_type}
                onChange={handleChange}
                label="Release Type"
                required
              >
                {releaseTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
                required
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Staging Environment */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Staging
            </Typography>
            <TextField
              fullWidth
              label="Deployment Date"
              type="date"
              name="deployment_date"
              value={formData.staging.deployment_date}
              onChange={(e) => handleEnvironmentChange(e, "staging")}
              focused
              sx={{ mb: 2 }}
            />
            <Autocomplete
              multiple
              options={[]}
              freeSolo
              value={formData.staging.resources_responsible}
              onChange={(event, value) => handleTagsChange(event, value, "staging")}
              renderInput={(params) => (
                <TextField {...params} label="Resources Responsible" sx={{ mb: 2 }} />
              )}
            />
          </Box>

          {/* Production Environment */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Production
            </Typography>
            <TextField
              fullWidth
              label="Deployment Date"
              type="date"
              name="deployment_date"
              value={formData.production.deployment_date}
              onChange={(e) => handleEnvironmentChange(e, "production")}
              focused
              sx={{ mb: 2 }}
            />
            <Autocomplete
              multiple
              options={[]}
              freeSolo
              value={formData.production.resources_responsible}
              onChange={(event, value) => handleTagsChange(event, value, "production")}
              renderInput={(params) => (
                <TextField {...params} label="Resources Responsible" sx={{ mb: 2 }} />
              )}
            />
          </Box>

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleBack}>
              Back
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default CreateRelease;