import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(0, 3),
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
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        draggable={false}
        progressStyle={undefined}
      />
    </div>
  );
};

export default Dashboard;
