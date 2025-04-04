import React from "react";
import { Box, Typography, Checkbox, TextField } from "@mui/material";
import styles from "./EditRelease.module.css";

const PreRequisiteChecklist = ({
  prerequisiteData,
  handlePrerequisiteChange,
}) => {
  return (
    <Box mt={2}>
      <Typography variant='h6' gutterBottom>
        Pre-requisite Checklist
      </Typography>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              className={styles.tableHeader}
              style={{ width: "50%" }} 
            >
              Regression Enter Criteria
            </th>
            <th
              className={styles.tableHeader}
              style={{ width: "10%" }} 
            >
              Status 100% Complete
            </th>
            <th
              className={styles.tableHeader}
              style={{ width: "40%" }} 
            >
              Exceptions. Provide comments if any item is not complete
            </th>
          </tr>
        </thead>
        <tbody>
          {prerequisiteData.map((row, index) => (
            <tr key={index} className={styles.tableRow}>
              <td
                className={styles.tableCell}
                dangerouslySetInnerHTML={{ __html: row.criteria }}
              ></td>
              <td className={styles.tableCell} style={{ textAlign: "center" }}>
                <Checkbox
                  checked={row.status}
                  onChange={(e) =>
                    handlePrerequisiteChange(index, "status", e.target.checked)
                  }
                />
              </td>
              <td className={styles.tableCell}>
                <TextField
                  fullWidth
                  value={row.exceptions}
                  onChange={(e) =>
                    handlePrerequisiteChange(
                      index,
                      "exceptions",
                      e.target.value
                    )
                  }
                  placeholder='Enter comments'
                  className={styles.inputWithPadding}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default PreRequisiteChecklist;
