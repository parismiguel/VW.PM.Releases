import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
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
  preRequisites,
  readiness,
} from "../constants/releaseConstants";
import { validateSemver } from "../utils/validationHelpers";
import CommonInfo from "./CommonInfo";
import EnvironmentDetails from "./EnvironmentDetails";
import PreRequisiteChecklist from "./PreRequisiteChecklist";
import ReleaseReadinessChecklist from "./ReleaseReadinessChecklist";
import PreDeploymentTasks from "./PreDeploymentTasks"; // Import the new component
import Screenshots from "./Screenshots";
import ReleaseActions from "./ReleaseActions";

const EditRelease = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [release, setRelease] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [systemsTabValue, setSystemsTabValue] = useState(0);
  const [semverError, setSemverError] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");

  const [prerequisiteData, setPrerequisiteData] = useState(preRequisites.data);
  const [readinessData, setReadinessData] = useState(readiness.data);
  const [preDeploymentTasks, setPreDeploymentTasks] = useState([
    { description: "Verify database backups", completed: false, notes: "" },
    {
      description: "Ensure staging environment is ready",
      completed: false,
      notes: "",
    },
    {
      description: "Notify stakeholders of deployment schedule",
      completed: false,
      notes: "",
    },
  ]);

  useEffect(() => {
    const fetchRelease = async () => {
      try {
        const data = await getReleaseById(id);

        // Ensure `systems_impacted`, `target_servers`, and `prerequisiteData` are initialized
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
        };

        setRelease(initializedRelease);
        setPrerequisiteData(
          Array.isArray(data.prerequisiteData) &&
            data.prerequisiteData.length > 0
            ? data.prerequisiteData
            : preRequisites.data
        );

        setReadinessData(
          Array.isArray(data.readinessData) && data.readinessData.length > 0
            ? data.readinessData
            : readiness.data
        );
      } catch (error) {
        console.error("Error fetching release:", error);
      }
    };

    fetchRelease();
  }, [id]);

  const handleBack = () => navigate(`/releases/${id}`);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleSystemsTabChange = (event, newValue) =>
    setSystemsTabValue(newValue);

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

  const handleReadinessChange = (index, field, value) => {
    const updatedData = [...readinessData];
    updatedData[index][field] = value;
    setReadinessData(updatedData);
  };

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...preDeploymentTasks];
    updatedTasks[index][field] = value;
    setPreDeploymentTasks(updatedTasks);
  };

  const handleAddTask = () => {
    setPreDeploymentTasks((prevTasks) => [
      ...prevTasks,
      {
        description: "",
        owner: "",
        stagingComplete: false,
        prodComplete: false,
      },
    ]);
  };

  const handleDeleteTask = (index) => {
    setPreDeploymentTasks((prevTasks) =>
      prevTasks.filter((_, i) => i !== index)
    );
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
        prerequisiteData,
        readinessData,
        preDeploymentTasks,
        modifiedBy: "currentUserId", // Replace with the actual user ID or name
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
            variant='scrollable' // Make tabs scrollable
            scrollButtons='auto' // Show scroll buttons automatically when needed
            sx={{
              mt: 2,
              borderBottom: "1px solid #ccc",
            }}
          >
            <Tab label='Common Info' />
            <Tab label='Staging' />
            <Tab label='Production' />
            <Tab label='Pre-requisite' />
            <Tab label='Release Readiness' />
            <Tab label='Pre-Deployment Tasks' />
            <Tab label='Screenshots' />
          </Tabs>

          {tabValue === 0 && (
            <CommonInfo
              release={release}
              handleReleaseChange={handleReleaseChange}
              semverError={semverError}
              productOptions={productOptions}
              releaseTypeOptions={releaseTypeOptions}
              statusOptions={statusOptions}
            />
          )}

          {tabValue === 1 && (
            <EnvironmentDetails
              environment='staging'
              release={release}
              handleEnvironmentChange={handleEnvironmentChange}
              renderSystemsCheckboxes={renderSystemsCheckboxes}
              renderTargetServersCheckboxes={renderTargetServersCheckboxes}
            />
          )}

          {tabValue === 2 && (
            <EnvironmentDetails
              environment='production'
              release={release}
              handleEnvironmentChange={handleEnvironmentChange}
              renderSystemsCheckboxes={renderSystemsCheckboxes}
              renderTargetServersCheckboxes={renderTargetServersCheckboxes}
            />
          )}

          {tabValue === 3 && (
            <PreRequisiteChecklist
              prerequisiteData={prerequisiteData}
              handlePrerequisiteChange={handlePrerequisiteChange}
            />
          )}

          {tabValue === 4 && (
            <ReleaseReadinessChecklist
              readinessData={readinessData}
              handleReadinessChange={handleReadinessChange}
            />
          )}

          {tabValue === 5 && (
            <PreDeploymentTasks
              tasks={preDeploymentTasks}
              handleTaskChange={handleTaskChange}
              handleAddTask={handleAddTask}
              handleDeleteTask={handleDeleteTask}
            />
          )}

          {tabValue === 6 && (
            <Screenshots
              screenshots={screenshots}
              setScreenshots={setScreenshots}
            />
          )}

          <ReleaseActions
            handleSubmit={handleSubmit}
            handleBack={handleBack}
            semverError={semverError}
          />
        </form>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default EditRelease;
