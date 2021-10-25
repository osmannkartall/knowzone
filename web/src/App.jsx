import { useEffect, useContext } from 'react';
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
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { FE_ROUTES, BE_ROUTES } from './constants/routes';
import Login from './components/Login';
import Register from './components/Register';

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
  const [, setUser] = useContext(AuthContext);

  // Simulates a log in operation with the credentials stored in user context variable.
  useEffect(() => {
    let mounted = true;

    function login() {
      fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.LOGIN}`, { method: 'POST' })
        .then((res) => res.json())
        .then(
          (result) => {
            if (mounted) {
              console.log(result.message);
              const newUser = {
                username: 'osmannkartall',
                email: 'mail@mail.mail',
                name: 'Osman Kartal',
                bio: 'this is my bio',
                id: '6123673a32e9c02678d5e5c1',
                isLoggedIn: true,
              };
              setUser(newUser);
            }
          },
          (error) => {
            console.log(error.message);
          },
        );
    }

    login();

    return function cleanup() {
      mounted = false;
    };
  }, [setUser]);

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Redirect to={`/${FE_ROUTES.LOGIN}`} />
          </Route>
          <Route path={`/${FE_ROUTES.LOGIN}`}>
            <Login />
          </Route>
          <Route path={`/${FE_ROUTES.REGISTER}`}>
            <Register />
          </Route>
          <Route path={`/${FE_ROUTES.BUG_FIXES}`}>
            <Dashboard><Bugfixes /></Dashboard>
          </Route>
          <Route path={`/${FE_ROUTES.TIPS}`}>
            <Dashboard><Tips /></Dashboard>
          </Route>
          <Route path={`/${FE_ROUTES.YOUR_POSTS}`}>
            <Dashboard><YourPosts /></Dashboard>
          </Route>
          <Route path={`/${FE_ROUTES.SEARCH_RESULTS}`}>
            <Dashboard><SearchResults /></Dashboard>
          </Route>
          <Route exact path={`/${FE_ROUTES.NOT_FOUND}`} component={NotFound} />
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
