import { useReducer, createContext, useContext } from 'react';

const LOGIN_STATES = Object.freeze({
  SUCCESS: 0,
  FAIL: 1,
  WAITING: 2,
});

const userInfo = {
  username: '',
  email: '',
  name: '',
  bio: '',
  id: '',
  photo: '',
};

// Define Reducer
const initalState = {
  ...userInfo,
  isLoggedIn: LOGIN_STATES.WAITING,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...action.payload,
        isLoggedIn: LOGIN_STATES.SUCCESS,
      };
    case 'LOGOUT':
      return {
        ...userInfo,
        isLoggedIn: LOGIN_STATES.FAIL,
      };
    default:
      throw new Error('Invalid action type.');
  }
};
// End of reducer definition

// Define Context
const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

const useAuthState = () => {
  const authState = useContext(AuthStateContext);
  if (authState === undefined) {
    throw new Error('useAuthState hook must be called in the sub-components of AuthProvider.');
  }
  return authState;
};

const useAuthDispatch = () => {
  const authDispatch = useContext(AuthDispatchContext);
  if (authDispatch === undefined) {
    throw new Error('useAuthDispatch hook must be called in the sub-components of AuthProvider.');
  }
  return authDispatch;
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initalState);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
// End of context definition

export { AuthProvider, useAuthState, useAuthDispatch, LOGIN_STATES };
