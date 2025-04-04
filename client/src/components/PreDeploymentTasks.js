import React from "react";
import { Box, Typography, TextField, Checkbox, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const PreDeploymentTasks = ({ tasks, handleTaskChange, handleAddTask, handleDeleteTask }) => {
  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        Pre-Deployment Tasks
      </Typography>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ width: "40%", textAlign: "left", padding: "8px" }}>
              Task
            </th>
            <th style={{ width: "20%", textAlign: "left", padding: "8px" }}>
              Owner
            </th>
            <th style={{ width: "20%", textAlign: "center", padding: "8px" }}>
              Staging Complete
            </th>
            <th style={{ width: "20%", textAlign: "center", padding: "8px" }}>
              Prod Complete
            </th>
            <th style={{ width: "10%", textAlign: "center", padding: "8px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={task.description || ""}
                  onChange={(e) =>
                    handleTaskChange(index, "description", e.target.value)
                  }
                  placeholder="Enter task description"
                />
              </td>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={task.owner || ""}
                  onChange={(e) =>
                    handleTaskChange(index, "owner", e.target.value)
                  }
                  placeholder="Enter owner"
                />
              </td>
              <td style={{ textAlign: "center", padding: "8px" }}>
                <Checkbox
                  checked={task.stagingComplete || false}
                  onChange={(e) =>
                    handleTaskChange(index, "stagingComplete", e.target.checked)
                  }
                />
              </td>
              <td style={{ textAlign: "center", padding: "8px" }}>
                <Checkbox
                  checked={task.prodComplete || false}
                  onChange={(e) =>
                    handleTaskChange(index, "prodComplete", e.target.checked)
                  }
                />
              </td>
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
            </tr>
          ))}
        </tbody>
      </table>
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
    </Box>
  );
};

export default PreDeploymentTasks;