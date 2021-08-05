import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

const Dashboard = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Topbar />
      <Sidebar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
};

export default Dashboard;
