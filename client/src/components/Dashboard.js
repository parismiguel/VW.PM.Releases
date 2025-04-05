import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { Link } from "react-router-dom";
import {
  Typography,
  Container,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const Dashboard = () => {
  const [releases, setReleases] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility
  const [releaseToDelete, setReleaseToDelete] = useState(null); // State for the release to delete

  useEffect(() => {
    axiosInstance
      .get("/api/releases")
      .then((res) => {
        // Sort releases by createdAt (newest first)
        const sortedReleases = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReleases(sortedReleases);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleOpenDialog = (id) => {
    setReleaseToDelete(id); // Set the release ID to delete
    setOpenDialog(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
    setReleaseToDelete(null); // Clear the release ID
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/releases/${releaseToDelete}`);
      setReleases(releases.filter((release) => release._id !== releaseToDelete));
      setOpenDialog(false); // Close the dialog after deletion
    } catch (err) {
      console.error("Error deleting release:", err);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4">Uprise Releases</Typography>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/create"
        >
          Create New Release
        </Button>
        <List sx={{ mt: 2 }}>
          {releases.map((release) => (
            <ListItem
              key={release._id}
              secondaryAction={
                <>
                  <Button
                    component={Link}
                    to={`/edit/${release._id}`}
                    color="secondary"
                  >
                    Edit
                  </Button>
                  <IconButton
                    edge="end"
                    onClick={() => handleOpenDialog(release._id)} // Open confirmation dialog
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText>
                <Link to={`/releases/${release._id}`}>
                  {release.product_name} - {release.release_version} (
                  {release.status})
                </Link>
                <Typography variant="body2" color="textSecondary">
                  Created At: {new Date(release.createdAt).toLocaleString()}
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this release? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;