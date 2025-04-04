import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const DeploymentRisks = ({ risks, handleRiskChange, handleAddRisk, handleDeleteRisk }) => {
  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        Deployment Risks & Remediation Plan
      </Typography>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ width: "10%", textAlign: "center", padding: "8px" }}>Seq#</th>
            <th style={{ width: "45%", textAlign: "left", padding: "8px" }}>Risk(s)</th>
            <th style={{ width: "45%", textAlign: "left", padding: "8px" }}>Remediation</th>
            <th style={{ width: "10%", textAlign: "center", padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {risks.map((risk, index) => (
            <tr key={index}>
              <td style={{ textAlign: "center", padding: "8px" }}>{index + 1}</td>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={risk.risk || ""}
                  onChange={(e) => handleRiskChange(index, "risk", e.target.value)}
                  placeholder="Enter risk"
                />
              </td>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={risk.remediation || ""}
                  onChange={(e) => handleRiskChange(index, "remediation", e.target.value)}
                  placeholder="Enter remediation plan"
                />
              </td>
              <td style={{ textAlign: "center", padding: "8px" }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteRisk(index)}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Box mt={2} textAlign="right">
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddRisk}
          startIcon={<AddIcon />}
        >
          Add Risk
        </Button>
      </Box>
    </Box>
  );
};

export default DeploymentRisks;