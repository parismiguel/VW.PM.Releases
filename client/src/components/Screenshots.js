import React, { useState } from "react";
import { Box, Typography, Dialog } from "@mui/material";
import { useDropzone } from "react-dropzone";

const Screenshots = ({ screenshots, setScreenshots }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDrop = (acceptedFiles) => {
    setScreenshots((prev) => [...prev, ...acceptedFiles]);
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    const files = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }
    if (files.length > 0) {
      setScreenshots((prev) => [...prev, ...files]);
    }
  };

  const handleImageClick = (file) => {
    setSelectedImage(URL.createObjectURL(file));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*", // Accept only image files
  });

  return (
    <Box mt={4} onPaste={handlePaste}>
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
          Drag and drop your screenshots here, click to select files, or paste an image from your clipboard
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
          {screenshots.map((file, index) => (
            <Box
              key={index}
              sx={{
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
              onClick={() => handleImageClick(file)} // Open modal on click
            >
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
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