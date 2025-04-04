import React from "react";
import { Box, Typography, Checkbox, TextField } from "@mui/material";
import styles from "./EditRelease.module.css";

const ReleaseReadinessChecklist = ({ readinessData, handleReadinessChange }) => {
  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        Release Readiness: Go/No Go Meeting Approval
      </Typography>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              className={styles.tableHeader}
              style={{ width: "40%" }} // Set width to 40%
            >
              Regression & Staging Exit Criteria
            </th>
            <th
              className={styles.tableHeader}
              style={{ width: "20%" }} // Set width to 20%
            >
              Status 100% Complete
            </th>
            <th
              className={styles.tableHeader}
              style={{ width: "40%" }} // Set width to 40%
            >
              Exceptions
            </th>
          </tr>
        </thead>
        <tbody>
          {readinessData.map((row, index) => (
            <tr key={index} className={styles.tableRow}>
              <td className={styles.tableCell}>{row.criteria}</td>
              <td
                className={styles.tableCell}
                style={{ textAlign: "center" }}
              >
                <Checkbox
                  checked={row.status}
                  onChange={(e) =>
                    handleReadinessChange(index, "status", e.target.checked)
                  }
                />
              </td>
              <td className={styles.tableCell}>
                <TextField
                  fullWidth
                  value={row.exceptions}
                  onChange={(e) =>
                    handleReadinessChange(index, "exceptions", e.target.value)
                  }
                  placeholder="Enter comments"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default ReleaseReadinessChecklist;