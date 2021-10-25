import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import { FilledInput } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  inputRow: {
    backgroundColor: 'rgba(255, 255, 255, .15)',
    display: '-webkit-flex',
    marginBottom: '20px',
  },
  icon: {
    padding: theme.spacing(1.5),
    backgroundColor: 'rgba(0, 0, 0, 0.09)',
  },
  loginForm: {
    padding: theme.spacing(2),
    // backgroundColor: 'rgba(123, 64, 97, .15)',
  },
  input: {
    '& .MuiFilledInput-input': {
      padding: theme.spacing(1.76),
    },
    '& .MuiInputBase-input': {
      fontSize: 20,
    },
  },
  root: {
    '& .MuiFilledInput-root': {
      'border-top-left-radius': 0,
      'border-top-right-radius': 0,
    },
  },
}));

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const classes = useStyles();

  return (
    <div className={classes.loginForm}>
      <div className={classes.inputRow}>
        <div className={classes.icon}>
          <PersonIcon />
        </div>
        <div className={classes.root}>
          <FilledInput
            className={classes.input}
            placeholder="Username"
            disableUnderline
            required
          />
        </div>
      </div>
      <div className={classes.inputRow}>
        <div className={classes.icon}>
          <LockIcon />
        </div>
        <div className={classes.root}>
          <FilledInput
            className={classes.input}
            placeholder="Password"
            type="password"
            disableUnderline
            required
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
