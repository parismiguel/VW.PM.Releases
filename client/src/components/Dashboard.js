import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { Link } from "react-router-dom";
import {
  Typography,
  Container,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Dashboard = () => {
  const [releases, setReleases] = useState([]);
  const [filteredReleases, setFilteredReleases] = useState([]);
  const [hideCompleted, setHideCompleted] = useState(true); // Hide completed releases by default
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [releaseToDelete, setReleaseToDelete] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/api/releases")
      .then((res) => {
        const sortedReleases = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReleases(sortedReleases);
        setFilteredReleases(
          sortedReleases.filter((release) =>
            hideCompleted ? release.status !== "Completed" : true
          )
        );
      })
      .catch((err) => console.error(err));
  }, [hideCompleted]);

  const handleOpenDialog = (id) => {
    setReleaseToDelete(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReleaseToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/releases/${releaseToDelete}`);
      const updatedReleases = releases.filter(
        (release) => release._id !== releaseToDelete
      );
      setReleases(updatedReleases);
      setFilteredReleases(
        updatedReleases.filter((release) =>
          hideCompleted ? release.status !== "Completed" : true
        )
      );
      setOpenDialog(false);
    } catch (err) {
      console.error("Error deleting release:", err);
    }
  };

  const handleHideCompletedChange = (event) => {
    setHideCompleted(event.target.checked);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
          <Button
            variant='contained'
            color='primary'
            component={Link}
            to='/create'
          >
            Create New Release
          </Button>
        </Stack>

        <FormControlLabel
          control={
            <Switch
              checked={hideCompleted}
              onChange={handleHideCompletedChange}
              color='primary'
            />
          }
          label='Hide Completed'
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReleases
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((release) => (
                  <TableRow key={release._id}>
                    <TableCell>
                      <Link to={`/releases/${release._id}`}>
                        {release.product_name}
                      </Link>
                    </TableCell>
                    <TableCell>{release.release_version}</TableCell>
                    <TableCell>{release.status}</TableCell>
                    <TableCell>
                      {new Date(release.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        component={Link}
                        to={`/edit/${release._id}`}
                        color='secondary'
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge='end'
                        onClick={() => handleOpenDialog(release._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredReleases.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this release? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleDelete} color='primary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
