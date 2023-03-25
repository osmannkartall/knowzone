import { useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FE_ROUTES } from '../constants/routes';
import AuthFormWrapper from '../components/common/AuthFormWrapper';
import { useAuthDispatch } from '../contexts/AuthContext';
import { login } from '../contexts/AuthActions';

const PREFIX = 'Login';

const classes = {
  input: `${PREFIX}-input`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.input}`]: {
    display: 'flex',
    width: 450,
    marginBottom: theme.spacing(2),
  },
}));

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .lowercase()
    .min(1)
    .max(15)
    .matches(
      /^@?([a-z0-9_])*$/,
      'Username should start with alphanumeric characters and can include underscore.',
    ),

  password: yup
    .string()
    .required()
    .min(8)
    .max(128)
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&_.,][\S]*$/,
      'Password should be at least 8 characters and contain at least one '
      + 'letter, one special character "@$!%*#?&_." and one integer.',
    ),
});

function Login() {
  const history = useHistory();
  const authDispatch = useAuthDispatch();
  const isMounted = useRef(true);
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleLogin = async (data) => {
    if (isMounted.current) {
      const response = await login(authDispatch, data);
      console.log(response);
      if (response.status === 'success') {
        history.push(FE_ROUTES.HOME);
      } else {
        toast.error(response.message);
        console.log('Something bad happened during login!');
      }
    }
  };

  useEffect(() => (function cleanup() {
    isMounted.current = false;
  }), []);

  return (
    <Root>
      <AuthFormWrapper
        title="Login to your Knowzone account"
        mainFormAction={{
          title: 'Login',
          handler: handleSubmit(handleLogin),
        }}
        otherFormAction={{
          title: 'Create a new account',
          handler: () => history.push(FE_ROUTES.REGISTER),
        }}
      >
        <Controller
          render={
          ({ field: { onChange, onBlur, value, name, ref } }) => (
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              className={classes.input}
              required
              error={errors.username !== undefined}
              helperText={errors.username && errors.username.message}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              name={name}
              ref={ref}
            />
          )
        }
          control={control}
          name="username"
          shouldUnregister
        />

        <Controller
          render={
          ({ field: { onChange, onBlur, value, name, ref } }) => (
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              className={classes.input}
              required
              type="password"
              error={errors.password !== undefined}
              helperText={errors.password && errors.password.message}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              name={name}
              ref={ref}
            />
          )
        }
          control={control}
          name="password"
          shouldUnregister
        />
      </AuthFormWrapper>
    </Root>
  );
}

export default Login;
