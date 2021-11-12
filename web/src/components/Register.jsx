import { useState, useEffect, useCallback, useRef } from 'react';
import { makeStyles, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FE_ROUTES } from '../constants/routes';
import AuthFormWrapper from '../common/AuthFormWrapper';
import { useAuthDispatch } from '../contexts/AuthContext';
import { register } from '../contexts/AuthActions';

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'flex',
    width: 450,
    marginBottom: theme.spacing(3),
  },
}));

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const classes = useStyles();
  const history = useHistory();
  const authDispatch = useAuthDispatch();
  const isMounted = useRef(true);

  const handleRegister = useCallback(async () => {
    if (isMounted.current) {
      const response = await register(authDispatch, {
        name,
        username,
        email,
        password,
        bio: 'This is mock bio',
      });

      if (response.status === 'success') {
        toast.info(`${response.message}. Redirecting to login page...`);
        history.push(FE_ROUTES.LOGIN);
      } else {
        toast.error(response.message);
        console.log('Something bad happened during register!');
      }
    }
  }, [authDispatch, name, username, email, password, history]);

  useEffect(() => function cleanup() {
    isMounted.current = false;
  }, []);

  return (
    <AuthFormWrapper
      title="Create your Knowzone account"
      mainFormAction={{
        title: 'Create',
        handler: handleRegister,
      }}
      otherFormAction={{
        title: 'Login instead',
        handler: () => history.push(FE_ROUTES.LOGIN),
      }}
    >
      <TextField
        id="name"
        label="Name"
        variant="outlined"
        className={classes.input}
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        id="username"
        label="Username"
        variant="outlined"
        className={classes.input}
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        id="email"
        label="Email"
        variant="outlined"
        className={classes.input}
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        id="password"
        label="Password"
        variant="outlined"
        className={classes.input}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
    </AuthFormWrapper>
  );
};

export default Register;
