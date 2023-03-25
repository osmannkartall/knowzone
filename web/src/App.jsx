import { useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/dashboard/Dashboard';
import PostsByOwner from './pages/PostsByOwner';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';
import { PRIMARY, WHITE } from './constants/colors';
import { AuthProvider, useAuthDispatch } from './contexts/AuthContext';
import { FE_ROUTES } from './constants/routes';
import Login from './pages/Login';
import Register from './pages/Register';
import { PrivateRoute, AuthRoute } from './components/common/CustomRoute';
import { checkUserSession } from './contexts/AuthActions';
import PostsByType from './pages/PostsByType';

const theme = createTheme(({
  palette: {
    primary: {
      main: PRIMARY,
    },
    background: {
      default: WHITE,
    },
  },
}));

function Wrapper() {
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
            <Redirect to={`/${FE_ROUTES.HOME}`} />
          </Route>

          <PrivateRoute path={`/${FE_ROUTES.POSTS}/:type`} redirectPath={`/${FE_ROUTES.LOGIN}`}>
            <Dashboard>
              <PostsByType />
            </Dashboard>
          </PrivateRoute>

          <PrivateRoute path={`/${FE_ROUTES.POSTS}`} redirectPath={`/${FE_ROUTES.LOGIN}`}>
            <Dashboard>
              <PostsByOwner />
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
        position="top-center"
        autoClose={4000}
        draggable={false}
        progressStyle={undefined}
        limit={3}
        style={{ width: '600px' }}
      />
    </>
  );
}

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Wrapper />
        </AuthProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
