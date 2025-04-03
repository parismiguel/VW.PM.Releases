import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getReleaseById, updateRelease } from "../services/releaseService";
import {
  productOptions,
  releaseTypeOptions,
  statusOptions,
  systemsImpacted,
  targetServers,
  preRequisites
} from "../constants/releaseConstants";

const EditRelease = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [release, setRelease] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [systemsTabValue, setSystemsTabValue] = useState(0);
  const [semverError, setSemverError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [prerequisiteData, setPrerequisiteData] = useState(preRequisites.data);

  useEffect(() => {
    const fetchRelease = async () => {
      try {
        const data = await getReleaseById(id);

        // Ensure `systems_impacted` and `target_servers` are initialized
        const initializedRelease = {
          ...data,
          staging: {
            ...data.staging,
            systems_impacted: data.staging?.systems_impacted || [],
            target_servers: data.staging?.target_servers || [],
          },
          production: {
            ...data.production,
            systems_impacted: data.production?.systems_impacted || [],
            target_servers: data.production?.target_servers || [],
          },
          prerequisiteData: data.prerequisiteData || prerequisiteData, // Initialize prerequisite data
        };

        setRelease(initializedRelease);
      } catch (error) {
        console.error("Error fetching release:", error);
      }
    };

    fetchRelease();
  }, [id, prerequisiteData]);

  const handleBack = () => navigate(`/releases/${id}`);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleSystemsTabChange = (event, newValue) =>
    setSystemsTabValue(newValue);

  const validateSemver = (value) => {
    const semverRegex = /^\d+\.\d+\.\d+\.\d+$/;
    if (!semverRegex.test(value)) {
      return "Release version must follow the semver format (e.g., 3.1.186.0).";
    }
    return "";
  };

  const handleReleaseChange = (e) => {
    const { name, value } = e.target;

    if (name === "release_version") {
      const error = validateSemver(value);
      setSemverError(error);
    }

    setRelease({ ...release, [name]: value });
  };

  const handleEnvironmentChange = (e, environment) => {
    const { name, value } = e.target;
    setRelease({
      ...release,
      [environment]: {
        ...release[environment],
        [name]: value,
      },
    });
  };

  const handleCheckboxChange = (e, environment) => {
    const { name, checked } = e.target;
    const updatedSystems = checked
      ? [...(release[environment]?.systems_impacted || []), name]
      : release[environment]?.systems_impacted.filter(
          (system) => system !== name
        );

    setRelease({
      ...release,
      [environment]: {
        ...release[environment],
        systems_impacted: updatedSystems,
      },
    });
  };

  const handleTargetServersChange = (e, environment) => {
    const normalizedEnvironment = environment.toLowerCase(); // Normalize casing

    if (!release || !release[normalizedEnvironment]) return;

    const { name, checked } = e.target;
    const updatedServers = checked
      ? [...(release[normalizedEnvironment]?.target_servers || []), name]
      : release[normalizedEnvironment]?.target_servers.filter(
          (server) => server !== name
        );

    console.log("Environment:", normalizedEnvironment);
    console.log("Updated Servers:", updatedServers);

    setRelease((prevRelease) => ({
      ...prevRelease,
      [normalizedEnvironment]: {
        ...prevRelease[normalizedEnvironment],
        target_servers: updatedServers,
      },
    }));
  };

  const handlePrerequisiteChange = (index, field, value) => {
    const updatedData = [...prerequisiteData];
    updatedData[index][field] = value;
    setPrerequisiteData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateSemver(release.release_version);
    if (error) {
      setSemverError(error);
      setAlertMessage(error);
      return;
    }

    try {
      const updatedRelease = {
        ...release,
        prerequisiteData, // Include prerequisite data in the release object
      };
      await updateRelease(id, updatedRelease);
      toast.success("Release updated successfully!");
    } catch (error) {
      console.error("Error updating release:", error);
      setAlertMessage("An error occurred while updating the release.");
    }
  };

  if (!release) return <Typography>Loading...</Typography>;

  const renderSystemsCheckboxes = (environment) => {
    return (
      <>
        <Tabs
          value={systemsTabValue}
          onChange={handleSystemsTabChange}
          aria-label='systems tabs'
          sx={{ mt: 2 }}
        >
          {Object.keys(systemsImpacted).map((category, index) => (
            <Tab key={category} label={category} />
          ))}
        </Tabs>
        {Object.entries(systemsImpacted).map(
          ([category, systems], index) =>
            systemsTabValue === index && (
              <Box key={category} mt={2}>
                <Typography variant='subtitle1'>{category}</Typography>
                <FormGroup>
                  {systems.map((system) => (
                    <FormControlLabel
                      key={system}
                      control={
                        <Checkbox
                          name={system}
                          checked={
                            release[environment]?.systems_impacted?.includes(
                              system
                            ) || false
                          }
                          onChange={(e) => handleCheckboxChange(e, environment)}
                        />
                      }
                      label={system}
                    />
                  ))}
                </FormGroup>
              </Box>
            )
        )}
      </>
    );
  };

  const renderTargetServersCheckboxes = (environment) => {
    const normalizedEnvironment = environment.toLowerCase(); // Normalize casing

    // Safeguard: Ensure targetServers[normalizedEnvironment] exists
    if (!targetServers[normalizedEnvironment]) {
      console.error(
        `Target servers not found for environment: ${normalizedEnvironment}`
      );
      return (
        <Typography>
          No target servers available for this environment.
        </Typography>
      );
    }

    return (
      <>
        <Tabs
          value={systemsTabValue}
          onChange={handleSystemsTabChange}
          aria-label='target servers tabs'
          sx={{ mt: 2 }}
        >
          {Object.keys(targetServers[normalizedEnvironment]).map(
            (category, index) => (
              <Tab key={category} label={category} />
            )
          )}
        </Tabs>
        {Object.entries(targetServers[normalizedEnvironment]).map(
          ([category, servers], index) =>
            systemsTabValue === index && (
              <Box key={category} mt={2}>
                <Typography variant='subtitle1'>{category}</Typography>
                <FormGroup>
                  {servers.map((server) => (
                    <FormControlLabel
                      key={server}
                      control={
                        <Checkbox
                          name={server}
                          checked={
                            release[
                              normalizedEnvironment
                            ]?.target_servers?.includes(server) || false
                          }
                          onChange={(e) =>
                            handleTargetServersChange(e, normalizedEnvironment)
                          }
                        />
                      }
                      label={server}
                    />
                  ))}
                </FormGroup>
              </Box>
            )
        )}
      </>
    );
  };

  return (
    <Container maxWidth='md'>
      <Box mt={4} mb={4}>
        <Typography variant='h4' gutterBottom>
          Edit Release: {release.release_version}
        </Typography>

        {alertMessage && (
          <Alert
            severity='error'
            onClose={() => setAlertMessage("")}
            sx={{ mb: 2 }}
          >
            {alertMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label='edit release tabs'
          >
            <Tab label='Common Info' />
            <Tab label='Staging' />
            <Tab label='Production' />
            <Tab label='Pre-requisite' /> {/* New tab */}
          </Tabs>

          {tabValue === 0 && (
            <Box mt={2}>
              <FormControl fullWidth variant='outlined' sx={{ mb: 2 }}>
                <InputLabel id='product-name-label'>Product Name</InputLabel>
                <Select
                  labelId='product-name-label'
                  name='product_name'
                  value={release.product_name || ""}
                  onChange={handleReleaseChange}
                  label='Product Name'
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
                label='Release Version'
                name='release_version'
                value={release.release_version}
                onChange={handleReleaseChange}
                error={!!semverError}
                helperText={semverError}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth variant='outlined' sx={{ mb: 2 }}>
                <InputLabel id='release-type-label'>Release Type</InputLabel>
                <Select
                  labelId='release-type-label'
                  name='release_type'
                  value={release.release_type || ""}
                  onChange={handleReleaseChange}
                  label='Release Type'
                  required
                >
                  {releaseTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth variant='outlined' sx={{ mb: 2 }}>
                <InputLabel id='status-label'>Status</InputLabel>
                <Select
                  labelId='status-label'
                  name='status'
                  value={release.status || ""}
                  onChange={handleReleaseChange}
                  label='Status'
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
          )}

          {tabValue === 1 && (
            <Box mt={2}>
              <Typography variant='h6' gutterBottom>
                Staging
              </Typography>
              <TextField
                fullWidth
                label='Deployment Date'
                type='date'
                name='deployment_date'
                value={release.staging?.deployment_date || ""}
                onChange={(e) => handleEnvironmentChange(e, "staging")}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label='Deployment Time'
                type='time'
                name='deployment_time'
                value={release.staging?.deployment_time || ""}
                onChange={(e) => handleEnvironmentChange(e, "staging")}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label='Deployment Duration (hours)'
                type='number'
                name='deployment_duration'
                value={release.staging?.deployment_duration || ""}
                onChange={(e) => handleEnvironmentChange(e, "staging")}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label='Downtime (hours)'
                type='number'
                name='downtime'
                value={release.staging?.downtime || ""}
                onChange={(e) => handleEnvironmentChange(e, "staging")}
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name='informed_resources'
                    checked={release.staging?.informed_resources || false}
                    onChange={(e) =>
                      handleEnvironmentChange(
                        {
                          target: {
                            name: "informed_resources",
                            value: e.target.checked,
                          },
                        },
                        "staging"
                      )
                    }
                  />
                }
                label='Informed all resources of the push activities?'
              />
              <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
                Systems/Applications Impacted
              </Typography>
              {renderSystemsCheckboxes("staging")}

              <Typography variant='h6' gutterBottom sx={{ mt: 4 }}>
                Target Servers
              </Typography>
              {renderTargetServersCheckboxes("Staging")}
            </Box>
          )}

          {tabValue === 2 && (
            <Box mt={2}>
              <Typography variant='h6' gutterBottom>
                Production
              </Typography>
              <TextField
                fullWidth
                label='Deployment Date'
                type='date'
                name='deployment_date'
                value={release.production?.deployment_date || ""}
                onChange={(e) => handleEnvironmentChange(e, "production")}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label='Deployment Time'
                type='time'
                name='deployment_time'
                value={release.production?.deployment_time || ""}
                onChange={(e) => handleEnvironmentChange(e, "production")}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label='Deployment Duration (hours)'
                type='number'
                name='deployment_duration'
                value={release.production?.deployment_duration || ""}
                onChange={(e) => handleEnvironmentChange(e, "production")}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label='Downtime (hours)'
                type='number'
                name='downtime'
                value={release.production?.downtime || ""}
                onChange={(e) => handleEnvironmentChange(e, "production")}
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name='informed_resources'
                    checked={release.production?.informed_resources || false}
                    onChange={(e) =>
                      handleEnvironmentChange(
                        {
                          target: {
                            name: "informed_resources",
                            value: e.target.checked,
                          },
                        },
                        "production"
                      )
                    }
                  />
                }
                label='Informed all resources of the push activities?'
              />
              <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
                Systems/Applications Impacted
              </Typography>
              {renderSystemsCheckboxes("production")}

              <Typography variant='h6' gutterBottom sx={{ mt: 4 }}>
                Target Servers
              </Typography>
              {renderTargetServersCheckboxes("Production")}
            </Box>
          )}

          {tabValue === 3 && ( // Pre-requisite tab
            <Box mt={2}>
              <Typography variant='h6' gutterBottom>
                Pre-requisite Checklist
              </Typography>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        width: "20%", // Stretch this column
                        wordWrap: "break-word", // Enable word wrapping
                        textAlign: "left", // Align text to the left
                      }}
                    >
                      Regression Enter Criteria
                    </th>
                    <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                      Status 100% Complete
                    </th>
                    <th
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        width: "50%", // Stretch this column
                        wordWrap: "break-word", // Enable word wrapping
                        textAlign: "left", // Align text to the left
                      }}
                    >
                      Exceptions. Provide comments if any item is not complete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prerequisiteData.map((row, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        {row.criteria}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        <Checkbox
                          checked={row.status}
                          onChange={(e) =>
                            handlePrerequisiteChange(
                              index,
                              "status",
                              e.target.checked
                            )
                          }
                        />
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                        <TextField
                          fullWidth
                          value={row.exceptions}
                          onChange={(e) =>
                            handlePrerequisiteChange(
                              index,
                              "exceptions",
                              e.target.value
                            )
                          }
                          placeholder='Enter comments'
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}

          <Stack direction='row' spacing={2} justifyContent='flex-end' mt={4}>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              disabled={!!semverError}
            >
              Update Release
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleBack}>
              Back
            </Button>
          </Stack>
        </form>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default EditRelease;
