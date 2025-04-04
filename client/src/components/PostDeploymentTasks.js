import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const PostDeploymentTasks = ({
  tasks,
  handleTaskChange,
  handleAddTask,
  handleDeleteTask,
}) => {
  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        Post Deployment Tasks
      </Typography>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ width: "5%", textAlign: "center", padding: "8px" }}>
              Seq#
            </th>
            <th style={{ width: "30%", textAlign: "left", padding: "8px" }}>
              Task(s)
            </th>
            <th style={{ width: "15%", textAlign: "left", padding: "8px" }}>
              Resource
            </th>
            <th style={{ width: "15%", textAlign: "center", padding: "8px" }}>
              Begin / End Time (Central)
            </th>
            <th style={{ width: "15%", textAlign: "left", padding: "8px" }}>
              Staging Comments
            </th>
            <th style={{ width: "15%", textAlign: "left", padding: "8px" }}>
              Prod Comments
            </th>
            <th style={{ width: "5%", textAlign: "center", padding: "8px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td style={{ textAlign: "center", padding: "8px" }}>
                {index + 1}
              </td>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={task.task || ""}
                  onChange={(e) => handleTaskChange(index, "task", e.target.value)}
                  placeholder="Enter task"
                />
              </td>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={task.resource || ""}
                  onChange={(e) =>
                    handleTaskChange(index, "resource", e.target.value)
                  }
                  placeholder="Enter resource"
                />
              </td>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={task.beginEndTime || ""}
                  onChange={(e) =>
                    handleTaskChange(index, "beginEndTime", e.target.value)
                  }
                  placeholder="Enter begin/end time"
                />
              </td>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={task.stagingComments || ""}
                  onChange={(e) =>
                    handleTaskChange(index, "stagingComments", e.target.value)
                  }
                  placeholder="Enter staging comments"
                />
              </td>
              <td style={{ padding: "8px" }}>
                <TextField
                  fullWidth
                  value={task.prodComments || ""}
                  onChange={(e) =>
                    handleTaskChange(index, "prodComments", e.target.value)
                  }
                  placeholder="Enter prod comments"
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

export default PostDeploymentTasks;