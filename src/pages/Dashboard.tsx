import { Typography, Paper, Box } from '@mui/material';

export default function Dashboard() {
  return (
    <Box sx={{ width: '100' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography>Welcome to Cove CRM!</Typography>
      </Paper>
    </Box>
  );
}