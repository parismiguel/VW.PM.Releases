import React from "react";
import { Box, Typography, TextField, Checkbox, FormControlLabel } from "@mui/material";

const GoNoGo = ({ goNoGo, handleGoNoGoChange }) => {
  const groups = ["Development", "QA", "Product Management"];

  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        Go / No Go
      </Typography>
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