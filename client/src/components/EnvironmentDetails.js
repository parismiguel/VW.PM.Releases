import React from "react";
import { Box, Typography, TextField, Checkbox, FormControlLabel } from "@mui/material";

const EnvironmentDetails = ({ environment, release, handleEnvironmentChange, renderSystemsCheckboxes, renderTargetServersCheckboxes }) => {
  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        {environment.charAt(0).toUpperCase() + environment.slice(1)} {/* Capitalize environment name */}
      </Typography>
      <TextField
        fullWidth
        label="Deployment Date"
        type="date"
        name="deployment_date"
        value={release[environment]?.deployment_date || ""}
        onChange={(e) => handleEnvironmentChange(e, environment)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Deployment Time"
        type="time"
        name="deployment_time"
        value={release[environment]?.deployment_time || ""}
        onChange={(e) => handleEnvironmentChange(e, environment)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Deployment Duration (hours)"
        type="number"
        name="deployment_duration"
        value={release[environment]?.deployment_duration || ""}
        onChange={(e) => handleEnvironmentChange(e, environment)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Downtime (hours)"
        type="number"
        name="downtime"
        value={release[environment]?.downtime || ""}
        onChange={(e) => handleEnvironmentChange(e, environment)}
        sx={{ mb: 2 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            name="informed_resources"
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
          />
        }
        label="Informed all resources of the push activities?"
      />
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Systems/Applications Impacted
      </Typography>
      {renderSystemsCheckboxes(environment)}

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Target Servers
      </Typography>
      {renderTargetServersCheckboxes(environment)}
    </Box>
  );
};

export default EnvironmentDetails;