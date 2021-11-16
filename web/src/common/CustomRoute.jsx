import { Route, Redirect } from 'react-router-dom';
import { useAuthState, LOGIN_STATES } from '../contexts/AuthContext';
import LinearProgressModal from './LinearProgressModal';
import { FE_ROUTES } from '../constants/routes';

const RouteRenderContent = ({ Success, Fail }) => {
  const { isLoggedIn } = useAuthState();
  let component;

  if (isLoggedIn === LOGIN_STATES.SUCCESS) {
    component = Success;
  } else if (isLoggedIn === LOGIN_STATES.FAIL) {
    component = Fail;
  } else {
    component = <LinearProgressModal isOpen={isLoggedIn === LOGIN_STATES.WAITING} />;
  }

  return component;
};

const PrivateRoute = ({ path, redirectPath, children }) => (
  <Route
    exact
    path={path}
    render={
      ({ location }) => (
        <RouteRenderContent
          Success={children}
          Fail={(
            <Redirect
              to={{
                pathname: redirectPath,
                state: { from: location },
              }}
            />
          )}
        />
      )
    }
  />
);

const AuthRoute = ({ path, children }) => (
  <Route
    exact
    path={path}
    render={
      ({ location }) => (
        <RouteRenderContent
          Success={(
            <Redirect
              to={{
                pathname: `/${FE_ROUTES.HOME}`,
                state: { from: location },
              }}
            />
          )}
          Fail={children}
        />
      )
    }
  />
);

export { PrivateRoute, AuthRoute };
