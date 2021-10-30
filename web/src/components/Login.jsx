import { makeStyles, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { FE_ROUTES } from '../constants/routes';
import AuthFormWrapper from '../common/AuthFormWrapper';
import { useAuthDispatch } from '../contexts/AuthContext';
import { login } from '../contexts/AuthActions';

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
  const authDispatch = useAuthDispatch();
  const isMounted = useRef(true);

  const handleLogin = useCallback(async () => {
    if (isMounted.current) {
      const response = await login(authDispatch, { username, password });
      console.log(response);
      if (response.status === 'success') {
        toast.info(response.message);
        history.push(FE_ROUTES.TIPS);
      } else {
        toast.error(response.message);
        console.log('Something bad happened during login!');
      }
    }
  }, [authDispatch, username, password, history]);

  useEffect(() => function cleanup() {
    isMounted.current = false;
  }, []);

  return (
    <AuthFormWrapper
      title="Login to your Knowzone account"
      mainFormAction={{
        title: 'Login',
        handler: handleLogin,
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
