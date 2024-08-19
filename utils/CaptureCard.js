// utils/captureCard.js
import React from 'react';
import { Box, Typography } from '@mui/material';

export const CaptureCard = React.forwardRef(({ frontContent, backContent }, ref) => (
  <Box
    ref={ref}
    sx={{
      width: 500,
      padding: 3,
      backgroundColor: 'white',
      borderRadius: 4,
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <Box sx={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 2 }}>
      <Typography variant="h6" gutterBottom>Question:</Typography>
      <Typography>{frontContent}</Typography>
    </Box>
    <Box>
      <Typography variant="h6" gutterBottom>Answer:</Typography>
      <Typography>{backContent}</Typography>
    </Box>
  </Box>
));

export default CaptureCard;