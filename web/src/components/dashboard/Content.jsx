import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { sidebarWidth } from '../../constants/styles';
import { WHITE } from '../../constants/colors';

const PREFIX = 'Content';

const classes = {
  content: `${PREFIX}-content`,
  contentWhenNoSidebar: `${PREFIX}-contentWhenNoSidebar`,
};

const Root = styled('div')(({ theme, $isSidebarOpen }) => ({
  width: $isSidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%',
  backgroundColor: WHITE,
  [`& .${classes.contentWhenNoSidebar}`]: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: 0,
      width: '100%',
    },
  },
}));

function Content({ isSidebarOpen, children }) {
  return (
    <Root $isSidebarOpen={isSidebarOpen}>
      <Grid container>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          {children}
        </Grid>
      </Grid>
    </Root>
  );
}

export default Content;
