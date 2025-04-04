import React from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";

const EnvironmentDetails = ({
  environment,
  release,
  handleEnvironmentChange,
  renderSystemsCheckboxes,
  renderTargetServersCheckboxes,
}) => {
  const handleResourcesChange = (event, value) => {
    handleEnvironmentChange(
      {
        target: {
          name: "resources_responsible",
          value,
        },
      },
      environment
    );
  };

  return (
    <Box mt={2}>
      <Typography variant='h6' gutterBottom>
        {environment.charAt(0).toUpperCase() + environment.slice(1)}{" "}
        {/* Capitalize environment name */}
      </Typography>
      <TextField
        fullWidth
        label='Deployment Date'
        type='date'
        name='deployment_date'
        value={release[environment]?.deployment_date || ""}
        onChange={(e) => handleEnvironmentChange(e, environment)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label='Deployment Time'
        type='time'
        name='deployment_time'
        value={release[environment]?.deployment_time || ""}
        onChange={(e) => handleEnvironmentChange(e, environment)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label='Deployment Duration (hours)'
        type='number'
        name='deployment_duration'
        value={release[environment]?.deployment_duration || ""}
        onChange={(e) => handleEnvironmentChange(e, environment)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label='Downtime (hours)'
        type='number'
        name='downtime'
        value={release[environment]?.downtime || ""}
        onChange={(e) => handleEnvironmentChange(e, environment)}
        sx={{ mb: 2 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            name='informed_resources'
            checked={release[environment]?.informed_resources || false}
            onChange={(e) =>
              handleEnvironmentChange(
                {
                  target: {
                    name: "informed_resources",
                    value: e.target.checked,
                  },
                },
                environment
              )
            }
            sx={{
              p: 0, // Remove all padding
            }}
          />
        }
        label='Informed all resources of the push activities?'
        sx={{
          alignItems: "center", // Align the checkbox and label vertically
        }}
      />

      <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
        Resources Responsible
      </Typography>
      <Autocomplete
        multiple
        options={[]} // Replace with predefined options if available
        freeSolo
        value={release[environment]?.resources_responsible || []}
        onChange={handleResourcesChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Resources Responsible'
            placeholder='Add resources'
            sx={{ mb: 2 }}
          />
        )}
      />

      <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
        Systems/Applications Impacted
      </Typography>
      {renderSystemsCheckboxes(environment)}

      <Typography variant='h6' gutterBottom sx={{ mt: 4 }}>
        Target Servers
      </Typography>
      {renderTargetServersCheckboxes(environment)}
    </Box>
  );
};

export default EnvironmentDetails;
