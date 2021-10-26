import { Route, Redirect } from 'react-router-dom';

const RouteWrapper = ({ children, isLoggedIn, redirectPath, ...rest }) => (
  <Route
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
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
