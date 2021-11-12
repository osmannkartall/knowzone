import { Route, Redirect } from 'react-router-dom';

const RouteWrapper = ({ exact, path, isLoggedIn, redirectPath, children }) => (
  <Route
    exact={exact}
    path={path}
    render={
      ({ location }) => (
        isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: redirectPath,
              state: { from: location },
            }}
          />
        )
      )
    }
  />
);

export default RouteWrapper;
