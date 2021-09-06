import React, { useEffect, useContext } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import Dashboard from './components/Dashboard/Dashboard';
import Tips from './components/Tips';
import BugFixes from './components/BugFixes';
import YourPosts from './components/YourPosts';
import SearchResults from './components/SearchResults';
import NotFound from './components/NotFound';
import { PRIMARY, WHITE } from './constants/colors';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { FE_ROUTES, BE_ROUTES } from './constants/routes';

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
  const [user, setUser] = useContext(AuthContext);

  // Simulates a log in operation with the credentials stored in user context variable.
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.LOGIN}`, { method: 'POST' })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log(result.message);

            const newUser = { ...user };
            newUser.isLoggedIn = true;
            // get user id from db later.
            // newUser.id = result.id;
            setUser(newUser);
          },
          (error) => {
            console.log(error.message);
          },
        );
    }

    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to={`/${FE_ROUTES.TIPS}`} />
        </Route>
        <Route path={`/${FE_ROUTES.BUG_FIXES}`}>
          <Dashboard><BugFixes /></Dashboard>
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
        {/* <Dashboard /> */}
        <Route exact path={`/${FE_ROUTES.NOT_FOUND}`} component={NotFound} />
        <Redirect to={`/${FE_ROUTES.NOT_FOUND}`} />
      </Switch>
    </BrowserRouter>
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
