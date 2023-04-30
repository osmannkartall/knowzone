import { Box } from '@mui/material';

function MainContent({ children }) {
  return (
    <Box sx={{ width: '100%' }}>
      {children}
    </Box>
  );
}

export default MainContent;
