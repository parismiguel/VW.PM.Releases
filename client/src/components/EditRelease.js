import React, { useEffect, useState, useRef } from "react";
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
import PreDeploymentTasks from "./PreDeploymentTasks";
import DeploymentRisks from "./DeploymentRisks";
import ReleaseActions from "./ReleaseActions";
import DeploymentValidationTasks from "./DeploymentValidationTasks";
import PostDeploymentTasks from "./PostDeploymentTasks";
import PostDeploymentIssues from "./PostDeploymentIssues";
import KnownIssues from "./KnownIssues";
import GoNoGo from "./GoNoGo";
import Screenshots from "./Screenshots";
import usePrompt from "../hooks/usePrompt"; 

const EditRelease = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialStateRef = useRef(null); 

  const [release, setRelease] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [systemsTabValue, setSystemsTabValue] = useState(0);
  const [semverError, setSemverError] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");

  const [prerequisiteData, setPrerequisiteData] = useState(preRequisites.data);
  const [readinessData, setReadinessData] = useState(readiness.data);
  const [preDeploymentTasks, setPreDeploymentTasks] = useState([
    { description: "", completed: false, notes: "" },
  ]);

  const [risks, setRisks] = useState([{ risk: "", remediation: "" }]);

  const [validationTasks, setValidationTasks] = useState([
    {
      repositoryName: "",
      releaseLink: "",
      resource: "",
      beginEndTime: "",
      stagingComments: "",
      prodComments: "",
    },
  ]);

  const [postDeploymentTasks, setPostDeploymentTasks] = useState([
    {
      task: "",
      resource: "",
      beginEndTime: "",
      stagingComments: "",
      prodComments: "",
    },
  ]);

  const [postDeploymentIssues, setPostDeploymentIssues] = useState([
    {
      id: "",
      title: "",
      sfSolution: "",
      workItemType: "",
      tfsRelease: "",
      comments: "",
    },
  ]);

  const [knownIssues, setKnownIssues] = useState([
    {
      jiraItem: "",
      sfSolution: "",
      proposedRelease: "",
      comments: "",
    },
  ]);

  const [goNoGo, setGoNoGo] = useState({
    Development: {
      Primary: { responsible: "", go: false },
      Backup: { responsible: "", go: false },
    },
    QA: {
      Primary: { responsible: "", go: false },
      Backup: { responsible: "", go: false },
    },
    "Product Management": {
      Primary: { responsible: "", go: false },
      Backup: { responsible: "", go: false },
    },
  });

  useEffect(() => {
    const fetchRelease = async () => {
      try {
        const data = await getReleaseById(id);

        console.log("Fetched Release Data:", data);

        // Initialize Go / No Go
        const initializedGoNoGo = {
          Development: {
            Primary: data.goNoGo?.Development?.Primary || {
              responsible: "",
              go: false,
            },
            Backup: data.goNoGo?.Development?.Backup || {
              responsible: "",
              go: false,
            },
          },
          QA: {
            Primary: data.goNoGo?.QA?.Primary || { responsible: "", go: false },
            Backup: data.goNoGo?.QA?.Backup || { responsible: "", go: false },
          },
          "Product Management": {
            Primary: data.goNoGo?.["Product Management"]?.Primary || {
              responsible: "",
              go: false,
            },
            Backup: data.goNoGo?.["Product Management"]?.Backup || {
              responsible: "",
              go: false,
            },
          },
        };

        setGoNoGo(initializedGoNoGo);

        // Initialize Known Issues
        const initializedKnownIssues = Array.isArray(data.knownIssues)
          ? data.knownIssues
          : [
              {
                jiraItem: "",
                sfSolution: "",
                proposedRelease: "",
                comments: "",
              },
            ];
        setKnownIssues(initializedKnownIssues);

        // Initialize Post Deployment Issues
        const initializedPostDeploymentIssues = Array.isArray(
          data.postDeploymentIssues
        )
          ? data.postDeploymentIssues
          : [
              {
                id: "",
                title: "",
                sfSolution: "",
                workItemType: "",
                tfsRelease: "",
                comments: "",
              },
            ];
        setPostDeploymentIssues(initializedPostDeploymentIssues);

        // Initialize Pre-Deployment Tasks
        const initializedPreDeploymentTasks = Array.isArray(
          data.preDeploymentTasks
        )
          ? data.preDeploymentTasks
          : [
              {
                description: "",
                completed: false,
                notes: "",
              },
            ];
        setPreDeploymentTasks(initializedPreDeploymentTasks);

        // Initialize Risks
        const initializedRisks = Array.isArray(data.risks)
          ? data.risks
          : [
              {
                risk: "",
                remediation: "",
              },
            ];
        setRisks(initializedRisks);

        // Initialize Validation Tasks
        const initializedValidationTasks = Array.isArray(data.validationTasks)
          ? data.validationTasks
          : [
              {
                repositoryName: "",
                releaseLink: "",
                resource: "",
                beginEndTime: "",
                stagingComments: "",
                prodComments: "",
              },
            ];
        setValidationTasks(initializedValidationTasks);

        // Initialize Post Deployment Tasks
        const initializedPostDeploymentTasks = Array.isArray(
          data.postDeploymentTasks
        )
          ? data.postDeploymentTasks
          : [
              {
                task: "",
                resource: "",
                beginEndTime: "",
                stagingComments: "",
                prodComments: "",
              },
            ];
        setPostDeploymentTasks(initializedPostDeploymentTasks);

        // Initialize Screenshots
        const initializedScreenshots = Array.isArray(data.screenshots)
          ? data.screenshots
          : [];
        setScreenshots(initializedScreenshots);

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

        // Initialize Release Data
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

        initialStateRef.current = initializedRelease;

      } catch (error) {
        console.error("Error fetching release:", error);
      }
    };

    fetchRelease();
  }, [id]);

  const isFormDirty = () => {
    return JSON.stringify(release) !== JSON.stringify(initialStateRef.current);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormDirty()) {
        e.preventDefault();
        e.returnValue = ""; // Show a confirmation dialog
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [release]);

  usePrompt("You have unsaved changes. Are you sure you want to leave?", isFormDirty());

  const isGoNoGoValid = () => {
    return Object.values(goNoGo).every((group) =>
      Object.values(group).every((role) => role.go === true)
    );
  };

  const arePreRequisitesComplete = () => {
    return prerequisiteData.every((item) => item.status === true);
  };

  const isReleaseReadinessComplete = () => {
    return readinessData.every((item) => item.status === true);
  };

  const isGoNoGoEnabled = () => {
    return arePreRequisitesComplete() && isReleaseReadinessComplete();
  };

  const getGoNoGoValidationMessage = () => {
    if (!arePreRequisitesComplete()) {
      return "Complete all Pre-Requisites to enable Go / No Go checkboxes.";
    }
    if (!isReleaseReadinessComplete()) {
      return "Complete all Release Readiness items to enable Go / No Go checkboxes.";
    }
    return "";
  };

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

    if (name === "status" && value === "Completed") {
      if (!isGoNoGoValid()) {
        toast.error(
          "All Go / No Go checkboxes must be true to set status to Completed."
        );
        return;
      }
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

  const handleRiskChange = (index, field, value) => {
    const updatedRisks = [...risks];
    updatedRisks[index][field] = value;
    setRisks(updatedRisks);
  };

  const handleAddRisk = () => {
    setRisks((prevRisks) => [...prevRisks, { risk: "", remediation: "" }]);
  };

  const handleDeleteRisk = (index) => {
    setRisks((prevRisks) => prevRisks.filter((_, i) => i !== index));
  };

  const handleValidationTaskChange = (index, field, value) => {
    const updatedTasks = [...validationTasks];
    updatedTasks[index][field] = value;
    setValidationTasks(updatedTasks);
  };

  const handleAddValidationTask = () => {
    setValidationTasks((prevTasks) => [
      ...prevTasks,
      {
        repositoryName: "",
        releaseLink: "",
        resource: "",
        beginEndTime: "",
        stagingComments: "",
        prodComments: "",
      },
    ]);
  };

  const handleDeleteValidationTask = (index) => {
    setValidationTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const handlePostDeploymentTaskChange = (index, field, value) => {
    const updatedTasks = [...postDeploymentTasks];
    updatedTasks[index][field] = value;
    setPostDeploymentTasks(updatedTasks);
  };

  const handleAddPostDeploymentTask = () => {
    setPostDeploymentTasks((prevTasks) => [
      ...prevTasks,
      {
        task: "",
        resource: "",
        beginEndTime: "",
        stagingComments: "",
        prodComments: "",
      },
    ]);
  };

  const handleDeletePostDeploymentTask = (index) => {
    setPostDeploymentTasks((prevTasks) =>
      prevTasks.filter((_, i) => i !== index)
    );
  };

  const handleIssueChange = (index, field, value) => {
    const updatedIssues = [...postDeploymentIssues];
    updatedIssues[index][field] = value;
    setPostDeploymentIssues(updatedIssues);
  };

  const handleAddIssue = () => {
    setPostDeploymentIssues((prevIssues) => [
      ...prevIssues,
      {
        id: "",
        title: "",
        sfSolution: "",
        workItemType: "",
        tfsRelease: "",
        comments: "",
      },
    ]);
  };

  const handleDeleteIssue = (index) => {
    setPostDeploymentIssues((prevIssues) =>
      prevIssues.filter((_, i) => i !== index)
    );
  };

  const handleKnownIssueChange = (index, field, value) => {
    const updatedIssues = [...knownIssues];
    updatedIssues[index][field] = value;
    setKnownIssues(updatedIssues);
  };

  const handleAddKnownIssue = () => {
    setKnownIssues((prevIssues) => [
      ...prevIssues,
      {
        jiraItem: "",
        sfSolution: "",
        proposedRelease: "",
        comments: "",
      },
    ]);
  };

  const handleDeleteKnownIssue = (index) => {
    setKnownIssues((prevIssues) => prevIssues.filter((_, i) => i !== index));
  };

  const handleGoNoGoChange = (group, role, field, value) => {
    setGoNoGo((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [role]: {
          ...prev[group][role],
          [field]: value,
        },
      },
    }));
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
        risks,
        validationTasks,
        postDeploymentTasks,
        postDeploymentIssues,
        knownIssues,
        goNoGo,
        modifiedBy: "currentUserId", // Replace with the actual user ID or name
      };

      await updateRelease(id, updatedRelease);
      toast.success("Release updated successfully!");
      
      initialStateRef.current = updatedRelease; 

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
            variant='scrollable'
            scrollButtons='auto'
            sx={{
              mt: 2,
              borderBottom: "1px solid #ccc",
              display: "flex",
              flexWrap: "wrap", // Allow tabs to wrap into multiple rows
              "& .MuiTabs-flexContainer": {
                flexWrap: "wrap", // Ensure the tab container wraps
              },
            }}
          >
            <Tab label='Common Info' />
            <Tab label='Staging' />
            <Tab label='Production' />
            <Tab label='Pre-requisite' />
            <Tab label='Release Readiness' />
            <Tab label='Pre-Deployment Tasks' />
            <Tab label='Deployment Risks' />
            <Tab label='Deployment / Validation Tasks' />
            <Tab label='Post Deployment Tasks' />
            <Tab label='Post Deployment Issues' />
            <Tab label='Known Issues' />
            <Tab label='Go / No Go' />
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
            <DeploymentRisks
              risks={risks}
              handleRiskChange={handleRiskChange}
              handleAddRisk={handleAddRisk}
              handleDeleteRisk={handleDeleteRisk}
            />
          )}

          {tabValue === 7 && (
            <DeploymentValidationTasks
              tasks={validationTasks}
              handleTaskChange={handleValidationTaskChange}
              handleAddTask={handleAddValidationTask}
              handleDeleteTask={handleDeleteValidationTask}
            />
          )}

          {tabValue === 8 && (
            <PostDeploymentTasks
              tasks={postDeploymentTasks}
              handleTaskChange={handlePostDeploymentTaskChange}
              handleAddTask={handleAddPostDeploymentTask}
              handleDeleteTask={handleDeletePostDeploymentTask}
            />
          )}

          {tabValue === 9 && (
            <PostDeploymentIssues
              issues={postDeploymentIssues}
              handleIssueChange={handleIssueChange}
              handleAddIssue={handleAddIssue}
              handleDeleteIssue={handleDeleteIssue}
            />
          )}

          {tabValue === 10 && (
            <KnownIssues
              issues={knownIssues}
              handleIssueChange={handleKnownIssueChange}
              handleAddIssue={handleAddKnownIssue}
              handleDeleteIssue={handleDeleteKnownIssue}
            />
          )}

          {tabValue === 11 && (
            <GoNoGo
              goNoGo={goNoGo}
              handleGoNoGoChange={handleGoNoGoChange}
              disabled={!isGoNoGoEnabled()}
              validationMessage={getGoNoGoValidationMessage()}
            />
          )}

          {tabValue === 12 && (
            <Screenshots
              screenshots={screenshots}
              setScreenshots={setScreenshots}
              releaseId={id}
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
