import { BE_ROUTES } from '../constants/routes';

export async function login(dispatch, userCredentials) {
  return fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.LOGIN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userCredentials),
  })
    .then((res) => res.json())
    .then(
      (result) => {
        dispatch({
          type: 'LOGIN',
          payload: {
            id: result.id,
            username: result.username,
            name: result.name,
          },
        });
        return { status: 'success', message: result.message };
      },
      (error) => {
        console.log(error);
        return { status: 'fail', message: error.message };
      },
    )
    .catch((error) => {
      console.log(error);
      return { status: 'fail', message: `Network Error: ${error.message}.` };
    });
}

export async function register(dispatch, userCredentials) {
  return fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.REGISTER}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userCredentials),
  })
    .then((res) => res.json())
    .then(
      (result) => {
        console.log(result);
        return { status: 'success', message: result.message };
      },
      (error) => {
        console.log(error);
        return { status: 'fail', message: error.message };
      },
    )
    .catch((error) => {
      console.log(error);
      return { status: 'fail', message: `Network Error: ${error.message}.` };
    });
}

export async function logout(dispatch, userCredentials) {
  return null;
}
