import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/login"); // Redirect to the login page
  };

  return (
    <Container maxWidth="sm">
      <Box
        mt={8}
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
      >
        <Typography variant="h4" color="error" gutterBottom>
          An Error Occurred
        </Typography>
        <Typography variant="body1" gutterBottom>
          Something went wrong during the login process. Please try again.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoBack}
          sx={{ mt: 3 }}
        >
          Go to Login
        </Button>
      </Box>
    </Container>
  );
};

export default Error;