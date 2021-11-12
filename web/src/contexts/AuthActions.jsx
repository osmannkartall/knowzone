import { BE_ROUTES } from '../constants/routes';

export async function login(dispatch, userCredentials) {
  return fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.LOGIN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userCredentials),
    credentials: 'include',
  })
    .then((res) => res.json())
    .then(
      (result) => {
        if (result.status === 'success') {
          // Save user id to local storage for login automatically
          // after browser tab/window is closed.
          localStorage.setItem('knowzone:uid', Buffer.from(result.id).toString('base64'));
          dispatch({
            type: 'LOGIN',
            payload: {
              id: result.id,
              name: result.name,
              username: result.username,
              email: result.email,
              bio: result.bio,
            },
          });
          return { status: 'success', message: result.message };
        }
        return { status: 'fail', message: result.message };
      },
      (error) => {
        console.log(error);
        return { status: 'fail', message: error.message };
      },
    )
    .catch((error) => {
      console.log('>>>>', error);
      return { status: 'fail', message: `Network Error: ${error.message}.` };
    });
}

export async function register(dispatch, userCredentials) {
  return fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.REGISTER}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userCredentials),
    credentials: 'include',
  })
    .then((res) => res.json())
    .then(
      (result) => {
        if (result.status === 'success') {
          // Save user id to local storage for login automatically
          // after browser tab/window is closed.
          localStorage.setItem('knowzone:uid', Buffer.from(result.id).toString('base64'));
          dispatch({
            type: 'LOGIN',
            payload: {
              id: result.id,
              name: result.name,
              username: result.username,
              email: result.email,
              bio: result.bio,
            },
          });
          return { status: 'success', message: result.message };
        }
        return { status: 'fail', message: result.message };
      },
      (error) => {
        console.log(error);
        return { status: 'fail', message: error.message };
      },
    )
    .catch((error) => {
      console.log(error);
      return { status: 'fail', message: `Exception: ${error.message}.` };
    });
}

export async function isUserLoggedIn(dispatch) {
  const uidValue = localStorage.getItem('knowzone:uid');
  if (!uidValue) {
    return { status: 'success', message: 'Not login' };
  }
  const id = Buffer.from(uidValue, 'base64');
  return fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.IS_USER_LOGGED_IN}/${id}`, {
    credentials: 'include',
  })
    .then((res) => res.json())
    .then(
      (result) => {
        if (result.status === 'success') {
          dispatch({
            type: 'LOGIN',
            payload: {
              id: result.id,
              name: result.name,
              username: result.username,
              email: result.email,
              bio: result.bio,
            },
          });
          return { status: 'success', message: result.message };
        }
        return result;
      },
      (error) => {
        console.log(error);
        return { status: 'fail', message: error.message };
      },
    )
    .catch((error) => {
      console.log(error);
      return { status: 'fail', message: `Exception: ${error.message}.` };
    });
}

export async function logout(dispatch) {
  return fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.LOGOUT}`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((res) => res.json())
    .then(
      (result) => {
        if (result.status === 'success') {
          dispatch({ type: 'LOGOUT' });
          // Remove user id from localStorage.
          localStorage.removeItem('knowzone:uid');
          return { status: 'success', message: result.message };
        }
        return { status: 'fail', message: result.message };
      },
      (error) => {
        console.log(error);
        return { status: 'fail', message: error.message };
      },
    )
    .catch((error) => {
      console.log(error);
      return { status: 'fail', message: `Exception: ${error.message}.` };
    });
}
