import { useEffect, useRef } from 'react';
import { makeStyles, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
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

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required()
    .trim()
    .min(3)
    .max(50),

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

  email: yup
    .string()
    .required()
    .lowercase()
    .min(3)
    .max(254)
    .email('Invalid email format.'),

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

  confirmPassword: yup
    .string()
    .required()
    .min(8)
    .max(128)
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&_.,][\S]*$/,
      'Password should be at least 8 characters and contain at least one '
      + 'letter, one special character "@$!%*#?&_." and one integer.',
    )
    .test('passwords-match', 'Passwords are not the same!', function compare(value) {
      return this.parent.password === value;
    }),

  bio: yup
    .string()
    .max(256),
});

const Register = () => {
  const classes = useStyles();
  const history = useHistory();
  const authDispatch = useAuthDispatch();
  const isMounted = useRef(true);
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleRegister = async (data) => {
    if (isMounted.current) {
      const { name, username, email, password } = data;
      const response = await register(authDispatch, {
        name,
        username,
        email,
        password,
        bio: 'This is a mock bio.',
      });

      if (response.status === 'success') {
        history.push(FE_ROUTES.HOME);
      } else {
        toast.error(response.message);
        console.log('Something bad happened during register!');
      }
    }
  };

  useEffect(() => function cleanup() {
    isMounted.current = false;
  }, []);

  return (
    <AuthFormWrapper
      title="Create your Knowzone account"
      mainFormAction={{
        title: 'Create',
        handler: handleSubmit(handleRegister),
      }}
      otherFormAction={{
        title: 'Login instead',
        handler: () => history.push(FE_ROUTES.LOGIN),
      }}
    >
      <Controller
        render={
          ({ field: { onChange, onBlur, value, name, ref } }) => (
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              className={classes.input}
              required
              error={errors.name !== undefined}
              helperText={errors.name && errors.name.message}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              name={name}
              ref={ref}
            />
          )
        }
        control={control}
        name="name"
        shouldUnregister
      />

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
              id="email"
              label="Email"
              variant="outlined"
              className={classes.input}
              required
              error={errors.email !== undefined}
              helperText={errors.email && errors.email.message}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              name={name}
              ref={ref}
            />
          )
        }
        control={control}
        name="email"
        shouldUnregister
      />

      <Controller
        render={
          ({ field: { onChange, onBlur, value, name, ref } }) => (
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              className={classes.input}
              required
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

      <Controller
        render={
          ({ field: { onChange, onBlur, value, name, ref } }) => (
            <TextField
              id="confirm-password"
              label="Confirm Password"
              variant="outlined"
              type="password"
              className={classes.input}
              required
              error={errors.confirmPassword !== undefined}
              helperText={errors.confirmPassword && errors.confirmPassword.message}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              name={name}
              ref={ref}
            />
          )
        }
        control={control}
        name="confirmPassword"
        shouldUnregister
      />

    </AuthFormWrapper>
  );
};

export default Register;
