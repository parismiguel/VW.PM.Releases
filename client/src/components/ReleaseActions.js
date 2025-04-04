import React from "react";
import { Button, Stack } from "@mui/material";

const ReleaseActions = ({ handleSubmit, handleBack, semverError }) => {
  return (
    <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={!!semverError}
        onClick={handleSubmit}
      >
        Update Release
      </Button>
      <Button variant="outlined" color="secondary" onClick={handleBack}>
        Back
      </Button>
    </Stack>
  );
};

export default ReleaseActions;