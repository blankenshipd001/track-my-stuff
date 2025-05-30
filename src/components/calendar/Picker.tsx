import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import dayjs from "dayjs";

interface PickerProps {
  currentMonth: dayjs.Dayjs;
  back: () => void;
  forward: () => void;
}

const Picker = ({back, forward, currentMonth}: PickerProps) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
      <IconButton onClick={back} color="inherit">
        <ArrowBack />
      </IconButton>
      <Typography variant="h6">{currentMonth.format("MMMM YYYY")}</Typography>
      <IconButton onClick={forward} color="inherit">
        <ArrowForward />
      </IconButton>
    </Box>
  );
};

export default Picker;