import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import { Link } from 'react-router-dom';
import { PRIMARY } from '../constants/colors';

const useStyles = makeStyles(() => ({
  notFound: {
    maxWidth: '35%',
    width: '100%',
    paddingLeft: '200px',
    lineHeight: 1.4,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  icon: {
    color: PRIMARY,
    fontSize: '185px',
    margin: 0,
    position: 'fixed',
    left: '10%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  title: {
    fontFamily: 'Roboto, sans-serif',
    color: '#292929',
    fontSize: '28px',
    letterSpacing: '2.5px',
    marginTop: 0,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  message: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    marginTop: 0,
    marginBottom: '15px',
    color: '#333',
  },
  button: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
    textDecoration: 'none',
    textTransform: 'uppercase',
    background: '#fff',
    display: 'inline-block',
    padding: '15px 30px',
    borderRadius: '40px',
    color: '#292929',
    fontWeight: 800,
    boxShadow: '0 4px 15px -5px rgba(0, 0, 0, .3)',
    transition: '.2s all',
  },
}));

const NotFound = () => {
  const classes = useStyles();

  return (
    <div className={classes.notFound}>
      <ErrorRoundedIcon className={classes.icon} />
      <h1 className={classes.title}>
        404 - Page not found
      </h1>
      <p className={classes.message}>
        The page you are looking for might have been removed or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button className={classes.button}>
          HOME PAGE
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
