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
import { AuthProvider, useAuthDispatch, useAuthState } from './contexts/AuthContext';
import { FE_ROUTES } from './constants/routes';
import Login from './components/Login';
import Register from './components/Register';
import RouteWrapper from './components/RouteWrapper';
import { isAuthenticated } from './contexts/AuthActions';

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
  const { isLoggedIn } = useAuthState();
  const authDispatch = useAuthDispatch();

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      isAuthenticated(authDispatch);
    }
    return function cleanup() {
      isMounted = false;
    };
  }, [authDispatch]);

  return (
    <>
      <BrowserRouter>
        <Switch>
          <RouteWrapper
            path={`/${FE_ROUTES.LOGIN}`}
            isLoggedIn={!isLoggedIn}
            redirectPath={`/${FE_ROUTES.TIPS}`}
          >
            <Login />
          </RouteWrapper>

          <RouteWrapper
            path={`/${FE_ROUTES.REGISTER}`}
            isLoggedIn={!isLoggedIn}
            redirectPath={`/${FE_ROUTES.TIPS}`}
          >
            <Register />
          </RouteWrapper>

          <RouteWrapper
            path={`/${FE_ROUTES.TIPS}`}
            isLoggedIn={isLoggedIn}
            redirectPath={`/${FE_ROUTES.LOGIN}`}
          >
            <Dashboard>
              <Tips />
            </Dashboard>
          </RouteWrapper>

          <RouteWrapper
            path={`/${FE_ROUTES.BUG_FIXES}`}
            isLoggedIn={isLoggedIn}
            redirectPath={`/${FE_ROUTES.LOGIN}`}
          >
            <Dashboard>
              <Bugfixes />
            </Dashboard>
          </RouteWrapper>

          <RouteWrapper
            path={`/${FE_ROUTES.YOUR_POSTS}`}
            isLoggedIn={isLoggedIn}
            redirectPath={`/${FE_ROUTES.LOGIN}`}
          >
            <Dashboard>
              <YourPosts />
            </Dashboard>
          </RouteWrapper>

          <RouteWrapper
            path={`/${FE_ROUTES.SEARCH_RESULTS}`}
            isLoggedIn={isLoggedIn}
            redirectPath={`/${FE_ROUTES.LOGIN}`}
          >
            <Dashboard>
              <SearchResults />
            </Dashboard>
          </RouteWrapper>

          <RouteWrapper
            exact
            path="/"
            isLoggedIn={!isLoggedIn}
            redirectPath={`/${FE_ROUTES.TIPS}`}
          >
            <Login />
          </RouteWrapper>

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
