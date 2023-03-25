import { Route, Redirect } from 'react-router-dom';
import { useAuthState, LOGIN_STATES } from '../../contexts/AuthContext';
import LinearProgressModal from './LinearProgressModal';
import { FE_ROUTES } from '../../constants/routes';

const RouteRenderContent = ({ Success, Terminated }) => {
  const { isLoggedIn } = useAuthState();
  let component;

  if (isLoggedIn === LOGIN_STATES.SUCCESS) {
    component = Success;
  } else if (isLoggedIn === LOGIN_STATES.TERMINATED) {
    component = Terminated;
  } else {
    component = <LinearProgressModal isOpen={isLoggedIn === LOGIN_STATES.WAITING} />;
  }

  return component;
};

function PrivateRoute({ path, redirectPath, children }) {
  return (
    <Route
      exact
      path={path}
      render={
      ({ location }) => (
        <RouteRenderContent
          Success={children}
          Terminated={(
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
}

function AuthRoute({ path, children }) {
  return (
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
          Terminated={children}
        />
      )
    }
    />
  );
}

export { PrivateRoute, AuthRoute };
