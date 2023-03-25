import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const PREFIX = 'NotFound';

const classes = {
  notFound: `${PREFIX}-notFound`,
  logo: `${PREFIX}-logo`,
  title: `${PREFIX}-title`,
  message: `${PREFIX}-message`,
  button: `${PREFIX}-button`,
};

const Root = styled('div')(() => ({
  [`&.${classes.notFound}`]: {
    maxWidth: '35%',
    width: '100%',
    paddingLeft: '200px',
    lineHeight: 1.4,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },

  [`& .${classes.logo}`]: {
    position: 'fixed',
    left: '10%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },

  [`& .${classes.title}`]: {
    fontFamily: 'Roboto, sans-serif',
    color: '#292929',
    fontSize: '28px',
    letterSpacing: '2.5px',
    marginTop: 0,
    fontWeight: 700,
    textTransform: 'uppercase',
  },

  [`& .${classes.message}`]: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    marginTop: 0,
    marginBottom: '15px',
    color: '#333',
  },

  [`& .${classes.button}`]: {
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

function NotFound() {
  return (
    <Root className={classes.notFound}>
      <img src="/knowzone-logo192.png" alt="knowzone-logo" className={classes.logo} />
      <h1 className={classes.title}>
        404 - Page not found
      </h1>
      <p className={classes.message}>
        The requested URL was not found.
      </p>
      <Link to="/">
        <Button className={classes.button}>
          HOME PAGE
        </Button>
      </Link>
    </Root>
  );
}

export default NotFound;
