import React, { useState, useEffect } from "react";
import { Box, Typography, Dialog, IconButton } from "@mui/material";
import { useDropzone } from "react-dropzone";
import axiosInstance from "../axiosConfig";
import DeleteIcon from "@mui/icons-material/Delete";

const Screenshots = ({ screenshots, setScreenshots, releaseId }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch screenshots from the database when the component mounts
  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/releases/${releaseId}/screenshots`
        );
        setScreenshots(response.data);
      } catch (err) {
        console.error("Error fetching screenshots:", err);
      }
    };

    fetchScreenshots();
  }, [releaseId, setScreenshots]);

  const handleDrop = async (acceptedFiles) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => formData.append("screenshots", file));

    try {
      const response = await axiosInstance.post(
        `/api/releases/${releaseId}/screenshots`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setScreenshots(response.data);
    } catch (err) {
      console.error("Error uploading screenshots:", err);
    }
  };

  const handlePaste = async (event) => {
    const clipboardItems = event.clipboardData.items;
    const formData = new FormData();

    for (const item of clipboardItems) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        formData.append("screenshots", file);
      }
    }

    if (formData.has("screenshots")) {
      try {
        const response = await axiosInstance.post(
          `/api/releases/${releaseId}/screenshots`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setScreenshots(response.data);
      } catch (err) {
        console.error("Error uploading pasted image:", err);
      }
    }
  };

  const handleDelete = async (filename) => {
    try {
      const response = await axiosInstance.delete(
        `/api/releases/${releaseId}/screenshots/${filename}`
      );
      setScreenshots(response.data);
    } catch (err) {
      console.error("Error deleting screenshot:", err);
    }
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*",
  });

  return (
    <Box
      mt={4}
      onPaste={handlePaste} // Add the paste event listener
    >
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
          Drag and drop your screenshots here, click to select files, or paste
          images from the clipboard
        </Typography>
      </Box>
      <Box mt={2}>
        <Typography variant="subtitle1">Uploaded Screenshots:</Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            mt: 2,
          }}
        >
          {screenshots.map((screenshot, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                border: "1px solid #ccc",
                borderRadius: "8px",
                overflow: "hidden",
                width: "150px",
                height: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <img
                src={screenshot.url}
                alt={screenshot.filename}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
                onClick={() => handleImageClick(screenshot.url)}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
                onClick={() => handleDelete(screenshot.filename)}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Modal for Enlarged Image */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Enlarged"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default Screenshots;