import { BE_ROUTES } from '../constants/routes';

const saveUidForAutoLogin = (uid) => {
  localStorage.setItem('knowzone:uid', uid);
};

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
          saveUidForAutoLogin(result.id);
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
          saveUidForAutoLogin(result.id);
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

export async function checkUserSession(dispatch) {
  const uidValue = localStorage.getItem('knowzone:uid');
  if (!uidValue) {
    dispatch({ type: 'LOGOUT' });
    return { status: 'success', message: 'Not login' };
  }

  const id = uidValue;
  return fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.CHECK_USER_SESSION}/${id}`, {
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
        dispatch({ type: 'LOGOUT' });
        return result;
      },
      (error) => {
        console.log(error);
        dispatch({ type: 'LOGOUT' });
        return { status: 'fail', message: error.message };
      },
    )
    .catch((error) => {
      console.log(error);
      dispatch({ type: 'LOGOUT' });
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
