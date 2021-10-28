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

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const classes = useStyles();
  const history = useHistory();

  return (
    <AuthFormWrapper
      title="Create your Knowzone account"
      mainFormAction={{
        title: 'Create',
        handler: () => alert(`email: ${email}, username: ${username}, pass: ${password}`),
      }}
      otherFormAction={{
        title: 'Login instead',
        handler: () => history.push(FE_ROUTES.LOGIN),
      }}
    >
      <TextField
        id="email"
        label="Email"
        variant="outlined"
        className={classes.input}
        fullWidth
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
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

export default Register;
