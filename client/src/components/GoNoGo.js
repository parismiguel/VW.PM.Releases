import React from "react";
import { Box, Typography, TextField, Checkbox, FormControlLabel, Alert } from "@mui/material";

const GoNoGo = ({ goNoGo, handleGoNoGoChange, disabled, validationMessage }) => {
  const groups = ["Development", "QA", "Product Management"];
debugger
  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        Go / No Go
      </Typography>

      {/* Show validation message if checkboxes are disabled */}
      {disabled && validationMessage && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {validationMessage}
        </Alert>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ width: "30%", textAlign: "left", padding: "8px" }}>
              Group
            </th>
            <th style={{ width: "35%", textAlign: "left", padding: "8px" }}>
              Responsible
            </th>
            <th style={{ width: "15%", textAlign: "center", padding: "8px" }}>
              Role
            </th>
            <th style={{ width: "20%", textAlign: "center", padding: "8px" }}>
              Go
            </th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) =>
            ["Primary", "Backup"].map((role) => (
              <tr key={`${group}-${role}`}>
                <td style={{ padding: "8px" }}>{group}</td>
                <td style={{ padding: "8px" }}>
                  <TextField
                    fullWidth
                    value={goNoGo[group]?.[role]?.responsible || ""}
                    onChange={(e) =>
                      handleGoNoGoChange(group, role, "responsible", e.target.value)
                    }
                    placeholder={`Enter ${role} responsible`}
                  />
                </td>
                <td style={{ textAlign: "center", padding: "8px" }}>{role}</td>
                <td style={{ textAlign: "center", padding: "8px" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={goNoGo[group]?.[role]?.go || false}
                        onChange={(e) =>
                          handleGoNoGoChange(group, role, "go", e.target.checked)
                        }
                        disabled={
                          disabled || // Disable if prerequisites or readiness are incomplete
                          !goNoGo[group]?.[role]?.responsible // Disable if "Responsible" is empty
                        }
                      />
                    }
                    label=""
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Box>
  );
};

export default GoNoGo;