import { useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard/Dashboard';
import Tips from './components/Tips';
import Bugfixes from './components/Bugfixes';
import YourPosts from './components/YourPosts';
import SearchResults from './components/SearchResults';
import NotFound from './components/NotFound';
import { PRIMARY, WHITE } from './constants/colors';
import { AuthProvider, useAuthDispatch } from './contexts/AuthContext';
import { FE_ROUTES } from './constants/routes';
import Login from './components/Login';
import Register from './components/Register';
import { PrivateRoute, AuthRoute } from './common/CustomRoute';
import { checkUserSession } from './contexts/AuthActions';

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY,
    },
    background: {
      default: WHITE,
    },
  },
});

const Wrapper = () => {
  const authDispatch = useAuthDispatch();

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      checkUserSession(authDispatch);
    }
    return function cleanup() {
      isMounted = false;
    };
  }, [authDispatch]);

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Redirect to={`/${FE_ROUTES.TIPS}`} />
          </Route>

          <PrivateRoute path={`/${FE_ROUTES.TIPS}`} redirectPath={`/${FE_ROUTES.LOGIN}`}>
            <Dashboard>
              <Tips />
            </Dashboard>
          </PrivateRoute>

          <PrivateRoute path={`/${FE_ROUTES.BUG_FIXES}`} redirectPath={`/${FE_ROUTES.LOGIN}`}>
            <Dashboard>
              <Bugfixes />
            </Dashboard>
          </PrivateRoute>

          <PrivateRoute path={`/${FE_ROUTES.YOUR_POSTS}`} redirectPath={`/${FE_ROUTES.LOGIN}`}>
            <Dashboard>
              <YourPosts />
            </Dashboard>
          </PrivateRoute>

          <PrivateRoute path={`/${FE_ROUTES.SEARCH_RESULTS}`} redirectPath={`/${FE_ROUTES.LOGIN}`}>
            <Dashboard>
              <SearchResults />
            </Dashboard>
          </PrivateRoute>

          <AuthRoute path={`/${FE_ROUTES.LOGIN}`}>
            <Login />
          </AuthRoute>

          <AuthRoute path={`/${FE_ROUTES.REGISTER}`}>
            <Register />
          </AuthRoute>

          <Route exact path={`/${FE_ROUTES.NOT_FOUND}`}>
            <NotFound />
          </Route>
          <Redirect to={`/${FE_ROUTES.NOT_FOUND}`} />
        </Switch>
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        draggable={false}
        progressStyle={undefined}
      />
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Wrapper />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
