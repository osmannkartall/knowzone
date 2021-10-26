import { useReducer, createContext, useContext } from 'react';

// Define Reducer
const initalState = {
  username: '',
  email: '',
  name: '',
  bio: '',
  id: '',
  photo: '',
  isLoggedIn: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        ...action.payload.user,
        isLoggedIn: true,
      };
    case 'LOGOUT':
      return { ...initalState };
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

export { AuthProvider, useAuthState, useAuthDispatch };
