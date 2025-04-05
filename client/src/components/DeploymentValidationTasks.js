import React, { useState } from "react";
import { Box, Typography, TextField, Button, Link, Switch, FormControlLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const DeploymentValidationTasks = ({
  tasks,
  handleTaskChange,
  handleAddTask,
  handleDeleteTask,
}) => {
  const [readOnly, setReadOnly] = useState(false); // State to toggle read-only mode

  const handleToggleReadOnly = () => {
    setReadOnly((prev) => !prev); // Toggle the read-only state
  };

  return (
    <Box mt={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" gutterBottom>
          Deployment / Validation Tasks
        </Typography>
        <FormControlLabel
          control={<Switch checked={readOnly} onChange={handleToggleReadOnly} />}
          label="Read-Only Mode"
        />
      </Box>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ width: "5%", textAlign: "center", padding: "8px" }}>Seq#</th>
            <th style={{ width: "20%", textAlign: "left", padding: "8px" }}>Repository Name</th>
            <th style={{ width: "20%", textAlign: "left", padding: "8px" }}>Release Link</th>
            <th style={{ width: "15%", textAlign: "left", padding: "8px" }}>Resource</th>
            <th style={{ width: "15%", textAlign: "center", padding: "8px" }}>Begin / End Time</th>
            <th style={{ width: "15%", textAlign: "left", padding: "8px" }}>Staging Comments</th>
            <th style={{ width: "15%", textAlign: "left", padding: "8px" }}>Prod Comments</th>
            {!readOnly && (
              <th style={{ width: "5%", textAlign: "center", padding: "8px" }}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td style={{ textAlign: "center", padding: "8px" }}>{index + 1}</td>
              <td style={{ padding: "8px" }}>
                {readOnly ? (
                  <Typography>{task.repositoryName || "N/A"}</Typography>
                ) : (
                  <TextField
                    fullWidth
                    value={task.repositoryName || ""}
                    onChange={(e) =>
                      handleTaskChange(index, "repositoryName", e.target.value)
                    }
                    placeholder="Enter repository name"
                  />
                )}
              </td>
              <td style={{ padding: "8px" }}>
                {readOnly ? (
                  <Link
                    href={task.releaseLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {task.releaseLink || "N/A"}
                  </Link>
                ) : (
                  <TextField
                    fullWidth
                    value={task.releaseLink || ""}
                    onChange={(e) =>
                      handleTaskChange(index, "releaseLink", e.target.value)
                    }
                    placeholder="Enter release link"
                  />
                )}
              </td>
              <td style={{ padding: "8px" }}>
                {readOnly ? (
                  <Typography>{task.resource || "N/A"}</Typography>
                ) : (
                  <TextField
                    fullWidth
                    value={task.resource || ""}
                    onChange={(e) =>
                      handleTaskChange(index, "resource", e.target.value)
                    }
                    placeholder="Enter resource"
                  />
                )}
              </td>
              <td style={{ padding: "8px" }}>
                {readOnly ? (
                  <Typography>{task.beginEndTime || "N/A"}</Typography>
                ) : (
                  <TextField
                    fullWidth
                    value={task.beginEndTime || ""}
                    onChange={(e) =>
                      handleTaskChange(index, "beginEndTime", e.target.value)
                    }
                    placeholder="Enter begin/end time"
                  />
                )}
              </td>
              <td style={{ padding: "8px" }}>
                {readOnly ? (
                  <Typography>{task.stagingComments || "N/A"}</Typography>
                ) : (
                  <TextField
                    fullWidth
                    value={task.stagingComments || ""}
                    onChange={(e) =>
                      handleTaskChange(index, "stagingComments", e.target.value)
                    }
                    placeholder="Enter staging comments"
                  />
                )}
              </td>
              <td style={{ padding: "8px" }}>
                {readOnly ? (
                  <Typography>{task.prodComments || "N/A"}</Typography>
                ) : (
                  <TextField
                    fullWidth
                    value={task.prodComments || ""}
                    onChange={(e) =>
                      handleTaskChange(index, "prodComments", e.target.value)
                    }
                    placeholder="Enter prod comments"
                  />
                )}
              </td>
              {!readOnly && (
                <td style={{ textAlign: "center", padding: "8px" }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteTask(index)}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!readOnly && (
        <Box mt={2} textAlign="right">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTask}
            startIcon={<AddIcon />}
          >
            Add Task
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DeploymentValidationTasks;