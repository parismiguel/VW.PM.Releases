import React from "react";
import { Box, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";

const Screenshots = ({ screenshots, setScreenshots }) => {
  const handleDrop = (acceptedFiles) => {
    setScreenshots((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*", // Accept only image files
  });

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Upload Screenshots
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #ccc",
          borderRadius: "8px",
          padding: "16px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          Drag and drop your screenshots here, or click to select files
        </Typography>
      </Box>
      <Box mt={2}>
        <Typography variant="subtitle1">Uploaded Screenshots:</Typography>
        <ul>
          {screenshots.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </Box>
    </Box>
  );
};

export default Screenshots;