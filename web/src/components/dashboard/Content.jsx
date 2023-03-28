import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { sidebarWidth, topbarHeight } from '../../constants/styles';

const PREFIX = 'Content';

const classes = {
  content: `${PREFIX}-content`,
  contentWhenNoSidebar: `${PREFIX}-contentWhenNoSidebar`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.content}`]: {
    width: `calc(100% - ${sidebarWidth}px)`,
    position: 'fixed',
    top: topbarHeight,
    left: sidebarWidth,
    [theme.breakpoints.only('xs')]: {
      left: 0,
      width: '100%',
      zIndex: -1,
    },
    height: `calc(100% - ${topbarHeight}px)`,
    overflowY: 'auto',
  },

  [`& .${classes.contentWhenNoSidebar}`]: {
    [theme.breakpoints.up('sm')]: {
      left: 0,
      width: '100%',
    },
  },
}));

function Content({ isSidebarOpen, children }) {
  return (
    <Root>
      <div className={
      isSidebarOpen
        ? classes.content
        : `${classes.content} ${classes.contentWhenNoSidebar}`
      }
      >
        <Grid container>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            {children}
          </Grid>
          {/* TODO: This section will be used to display data such as trending posts. */}
        </Grid>
      </div>
    </Root>
  );
}

export default Content;
