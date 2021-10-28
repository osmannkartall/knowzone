import { makeStyles, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { FE_ROUTES } from '../constants/routes';
import AuthFormWrapper from '../common/AuthFormWrapper';

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: theme.spacing(4),
  },
}));

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const classes = useStyles();
  const history = useHistory();

  return (
    <AuthFormWrapper
      title="Login to your Knowzone accout"
      mainFormAction={{
        title: 'Login',
        handler: () => alert(`username: ${username}, pass: ${password}`),
      }}
      otherFormAction={{
        title: 'Create a new account',
        handler: () => history.push(FE_ROUTES.REGISTER),
      }}
    >
      <TextField
        id="username"
        label="Username"
        variant="outlined"
        className={classes.input}
        fullWidth
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        id="password"
        label="Password"
        variant="outlined"
        className={classes.input}
        fullWidth
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
    </AuthFormWrapper>
  );
};

export default Login;
