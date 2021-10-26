import { BE_ROUTES } from '../constants/routes';

async function login(dispatch) {
  return fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.LOGIN}`, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then(
      (result) => {
        const user = {
          username: 'osmannkartall',
          email: 'mail@mail.mail',
          name: 'Osman Kartal',
          bio: 'this is my bio',
          id: '6123673a32e9c02678d5e5c1',
          isLoggedIn: true,
        };
        dispatch({ type: 'LOGIN', payload: { user } });
        return true;
      },
      (error) => {
        console.log(error.message);
        return false;
      },
    )
    .catch((error) => {
      console.log(error);
      return false;
    });
}

export { login };
