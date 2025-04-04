import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";

const CommonInfo = ({ release, handleReleaseChange, semverError, productOptions, releaseTypeOptions, statusOptions }) => {
  return (
    <Box mt={2}>
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel id="product-name-label">Product Name</InputLabel>
        <Select
          labelId="product-name-label"
          name="product_name"
          value={release.product_name || ""}
          onChange={handleReleaseChange}
          label="Product Name"
          required
        >
          {productOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Release Version"
        name="release_version"
        value={release.release_version}
        onChange={handleReleaseChange}
        error={!!semverError}
        helperText={semverError}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel id="release-type-label">Release Type</InputLabel>
        <Select
          labelId="release-type-label"
          name="release_type"
          value={release.release_type || ""}
          onChange={handleReleaseChange}
          label="Release Type"
          required
        >
          {releaseTypeOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          name="status"
          value={release.status || ""}
          onChange={handleReleaseChange}
          label="Status"
          required
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="JIRA Release Filter"
        name="jira_release_filter"
        value={release.jira_release_filter || ""}
        onChange={handleReleaseChange}
        placeholder="Enter JIRA Release Filter URL"
        sx={{ mb: 2 }}
      />
    </Box>
  );
};

export default CommonInfo;