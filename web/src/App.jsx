import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/dashboard/Dashboard';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';
import { PRIMARY, WHITE } from './constants/colors';
import { AuthProvider, LOGIN_STATES, useAuthDispatch, useAuthState } from './contexts/AuthContext';
import { FE_ROUTES } from './constants/routes';
import Login from './pages/Login';
import Register from './pages/Register';
import { checkUserSession } from './contexts/AuthActions';
import LinearProgressModal from './components/common/LinearProgressModal';
import Home from './pages/Home';
import Posts from './pages/Posts';

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

function AuthRouteComponent({ Success, Terminated }) {
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
}

function ScrollToTop() {
  const { pathname, state } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, state]);

  return null;
}

function Wrapper() {
  const authDispatch = useAuthDispatch();

  useEffect(() => {
    checkUserSession(authDispatch);
  }, [authDispatch]);

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={(
              <AuthRouteComponent
                Success={<Dashboard><Home /></Dashboard>}
                Terminated={<Login />}
              />
              )}
          />
          <Route
            path={`/${FE_ROUTES.LOGIN}`}
            element={(
              <AuthRouteComponent
                Success={<Navigate to={`/${FE_ROUTES.HOME}`} />}
                Terminated={<Login />}
              />
            )}
          />
          <Route
            path={`/${FE_ROUTES.REGISTER}`}
            element={(
              <AuthRouteComponent
                Success={<Navigate to={`/${FE_ROUTES.HOME}`} />}
                Terminated={<Register />}
              />
            )}
          />
          <Route
            path={`/${FE_ROUTES.POSTS}/:type`}
            element={(
              <AuthRouteComponent
                Success={<Dashboard><Posts /></Dashboard>}
                Terminated={<Navigate to={`/${FE_ROUTES.LOGIN}`} />}
              />
            )}
          />
          <Route
            path={`/${FE_ROUTES.SEARCH_RESULTS}`}
            element={(
              <AuthRouteComponent
                Success={<Dashboard><SearchResults /></Dashboard>}
                Terminated={<Navigate to={`/${FE_ROUTES.LOGIN}`} />}
              />
            )}
          />
          <Route path={`/${FE_ROUTES.NOT_FOUND}`} element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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
