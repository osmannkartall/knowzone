import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { toast } from 'react-toastify';
import { FE_ROUTES } from '../constants/routes';
import AuthFormWrapper from '../components/auth/AuthFormWrapper';
import { useAuthDispatch } from '../contexts/AuthContext';
import { register } from '../contexts/AuthActions';

const PREFIX = 'Register';

const classes = {
  input: `${PREFIX}-input`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.input}`]: {
    display: 'flex',
    width: 450,
    marginBottom: theme.spacing(3),
  },
}));

const registerSchema = Joi.object({
  username: Joi.string()
    .required()
    .min(1)
    .max(15)
    .lowercase()
    .regex(/^@?([a-z0-9_])*$/)
    .messages({
      'string.pattern.base': 'Username should start with alphanumeric characters and can include underscore.',
    }),

  password: Joi.string()
    .required()
    .min(8)
    .max(128),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Passwords are not the same!' }),

  name: Joi.string()
    .required()
    .trim()
    .min(3)
    .max(50),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .min(3)
    .max(254)
    .required()
    .messages({ 'string.email': 'Invalid email format.' }),

  bio: Joi.string().max(256),
});

function Register() {
  const navigate = useNavigate();
  const authDispatch = useAuthDispatch();
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: joiResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleRegister = async (data) => {
    const { name, username, email, password } = data;
    const response = await register(authDispatch, {
      name,
      username,
      email,
      password,
      bio: 'This is a mock bio.',
    });

    if (response.status === 'success') {
      navigate(`/${FE_ROUTES.HOME}`);
    } else {
      toast.error(response.message);
      console.log('Something bad happened during register!');
    }
  };

  return (
    <Root>
      <AuthFormWrapper
        title="Create your Knowzone account"
        mainFormAction={{
          title: 'Create',
          handler: handleSubmit(handleRegister),
        }}
        otherFormAction={{
          title: 'Login instead',
          handler: () => navigate(`/${FE_ROUTES.LOGIN}`),
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
    </Root>
  );
}

export default Register;
