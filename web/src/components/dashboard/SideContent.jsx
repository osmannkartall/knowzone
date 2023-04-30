import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
}));

function SideContent({ children }) {
  return (
    <BoxWrapper sx={{ width: '30%' }}>
      {children}
    </BoxWrapper>
  );
}

export default SideContent;
