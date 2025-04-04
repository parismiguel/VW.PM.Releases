import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const PostDeploymentIssues = ({
  issues,
  handleIssueChange,
  handleAddIssue,
  handleDeleteIssue,
}) => {
  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        Post Deployment Issues Addressed
      </Typography>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ width: "10%", textAlign: "center", padding: "8px" }}>
              ID
            </th>
            <th style={{ width: "20%", textAlign: "left", padding: "8px" }}>
              Title
            </th>
            <th style={{ width: "15%", textAlign: "left", padding: "8px" }}>
              SF Solution #
            </th>
            <th style={{ width: "15%", textAlign: "left", padding: "8px" }}>
              Work Item Type
            </th>
            <th style={{ width: "20%", textAlign: "left", padding: "8px" }}>
              TFS Release
            </th>
            <th style={{ width: "20%", textAlign: "left", padding: "8px" }}>
              Comments
            </th>
            <th style={{ width: "5%", textAlign: "center", padding: "8px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue, index) => (
            <tr key={index}>
              <td style={{ textAlign: "center", padding: "8px" }}>
                <TextField
                  fullWidth
                  value={issue.id || ""}
                  onChange={(e) => handleIssueChange(index, "id", e.target.value)}
                  placeholder="Enter ID"
                />
              </td>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={issue.title || ""}
                  onChange={(e) => handleIssueChange(index, "title", e.target.value)}
                  placeholder="Enter title"
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
                  value={issue.workItemType || ""}
                  onChange={(e) =>
                    handleIssueChange(index, "workItemType", e.target.value)
                  }
                  placeholder="Enter Work Item Type"
                />
              </td>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={issue.tfsRelease || ""}
                  onChange={(e) =>
                    handleIssueChange(index, "tfsRelease", e.target.value)
                  }
                  placeholder="Enter TFS Release"
                />
              </td>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={issue.comments || ""}
                  onChange={(e) =>
                    handleIssueChange(index, "comments", e.target.value)
                  }
                  placeholder="Enter comments"
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

export default PostDeploymentIssues;