import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const KnownIssues = ({
  issues,
  handleIssueChange,
  handleAddIssue,
  handleDeleteIssue,
}) => {
  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        Known Issues
      </Typography>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ width: "20%", textAlign: "left", padding: "8px" }}>
              JIRA Item
            </th>
            <th style={{ width: "20%", textAlign: "left", padding: "8px" }}>
              SF Solution #
            </th>
            <th style={{ width: "20%", textAlign: "left", padding: "8px" }}>
              Proposed Release
            </th>
            <th style={{ width: "30%", textAlign: "left", padding: "8px" }}>
              Comments
            </th>
            <th style={{ width: "10%", textAlign: "center", padding: "8px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={issue.jiraItem || ""}
                  onChange={(e) =>
                    handleIssueChange(index, "jiraItem", e.target.value)
                  }
                  placeholder="Enter JIRA item"
                />
              </td>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={issue.sfSolution || ""}
                  onChange={(e) =>
                    handleIssueChange(index, "sfSolution", e.target.value)
                  }
                  placeholder="Enter SF Solution #"
                />
              </td>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={issue.proposedRelease || ""}
                  onChange={(e) =>
                    handleIssueChange(index, "proposedRelease", e.target.value)
                  }
                  placeholder="Enter Proposed Release"
                />
              </td>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={issue.comments || ""}
                  onChange={(e) =>
                    handleIssueChange(index, "comments", e.target.value)
                  }
                  placeholder="Enter Comments"
                />
              </td>
              <td style={{ textAlign: "center", padding: "8px" }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteIssue(index)}
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
          onClick={handleAddIssue}
          startIcon={<AddIcon />}
        >
          Add Issue
        </Button>
      </Box>
    </Box>
  );
};

export default KnownIssues;