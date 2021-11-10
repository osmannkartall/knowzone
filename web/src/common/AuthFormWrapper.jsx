import { makeStyles, Button } from '@material-ui/core';
import { GRAY1, GRAY3 } from '../constants/colors';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    margin: 'auto',
    overflow: 'scroll',
    color: GRAY1,
  },
  form: {
    margin: 'auto',
    padding: theme.spacing(4),
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
  input: {
    marginBottom: theme.spacing(4),
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  orText: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(0.5),
    opacity: 0.5,
  },
}));

const AuthFormContainer = ({ title, mainFormAction, otherFormAction, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.form}>
        <div className={classes.logoAndTitleContainer}>
          <img src="/knowzone-logo192.png" alt="knowzone-logo" className={classes.logo} />
          <h2 className={classes.title}>{title}</h2>
        </div>
        {children}
        <div className={classes.buttonGroup}>
          <Button
            variant="contained"
            color="primary"
            onClick={mainFormAction.handler}
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
  );
};

export default AuthFormContainer;
