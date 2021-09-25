import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import { sidebarWidth, topbarHeight } from '../../constants/styles';

const useStyles = makeStyles((theme) => ({
  content: {
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
  contentWhenNoSidebar: {
    [theme.breakpoints.up('sm')]: {
      left: 0,
      width: '100%',
    },
  },
}));

const Content = ({ isSidebarOpen, children }) => {
  const classes = useStyles();

  return (
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
  );
};

export default Content;
