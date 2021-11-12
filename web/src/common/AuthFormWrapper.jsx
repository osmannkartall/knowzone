import { makeStyles, Button } from '@material-ui/core';
import { useState } from 'react';
import { GRAY1, GRAY3 } from '../constants/colors';
import LinearProgressModal from './LinearProgressModal';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    margin: 'auto',
    overflow: 'auto',
    color: GRAY1,
  },
  form: {
    margin: 'auto',
    padding: theme.spacing(2),
    border: `1px solid ${GRAY3}`,
    borderRadius: 4,
    [theme.breakpoints.only('xs')]: {
      border: 'none',
    },
  },
  logoAndTitleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontWeight: '500',
    margin: theme.spacing(3, 0),
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  orText: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(0.5),
    opacity: 0.5,
  },
}));

const AuthFormContainer = ({ title, mainFormAction, otherFormAction, children }) => {
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);
  const classes = useStyles();

  const handleMainFormAction = (event) => {
    event.preventDefault();
    setIsLinearProgressModalOpen(true);
    mainFormAction.handler();
    setIsLinearProgressModalOpen(false);
  };

  return (
    <form onSubmit={handleMainFormAction} noValidate>
      <LinearProgressModal isOpen={isLinearProgressModalOpen}>
        <div className={classes.container}>
          <div className={classes.form}>
            <div className={classes.logoAndTitleContainer}>
              <img src="/knowzone-logo192.png" alt="knowzone-logo" className={classes.logo} />
              <h2 className={classes.title}>{title}</h2>
            </div>
            {children}
            <div className={classes.buttonGroup}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {mainFormAction.title}
              </Button>
              <div className={classes.orText}>or</div>
              <Button
                variant="text"
                color="primary"
                style={{ textTransform: 'none' }}
                onClick={otherFormAction.handler}
              >
                {otherFormAction.title}
              </Button>
            </div>
          </div>
        </div>
      </LinearProgressModal>
    </form>
  );
};

export default AuthFormContainer;
