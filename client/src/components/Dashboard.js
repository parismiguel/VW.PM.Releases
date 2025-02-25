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
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const Dashboard = () => {
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/api/releases")
      .then((res) => setReleases(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/releases/${id}`);
      setReleases(releases.filter((release) => release._id !== id));
    } catch (err) {
      console.error("Error deleting release:", err);
    }
  };

  return (
    <Container maxWidth='md'>
      <Box mt={4} mb={4}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mb={2}
        >
          <Typography variant='h4'>Uprise Releases</Typography>
          
        </Stack>
        <Button
          variant='contained'
          color='primary'
          component={Link}
          to='/create'
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
                    color='secondary'
                  >
                    Edit
                  </Button>
                  <IconButton
                    edge='end'
                    onClick={() => handleDelete(release._id)}
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
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Dashboard;
