import React, { useEffect, useContext } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import Dashboard from './components/Dashboard/Dashboard';
import Tips from './components/Tips';
import BugFixes from './components/BugFixes';
import YourPosts from './components/YourPosts';
import SearchResults from './components/SearchResults';
import { PRIMARY, WHITE } from './constants/colors';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { TIPS, BUG_FIXES, YOUR_POSTS, SEARCH_RESULTS } from './constants/frontend-routes';
import { LOGIN } from './constants/api-routes';

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
      fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${LOGIN}`, { method: 'POST' })
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
          <Redirect to={`/${TIPS}`} />
        </Route>
        <Route path={`/${BUG_FIXES}`}>
          <Dashboard><BugFixes /></Dashboard>
        </Route>
        <Route path={`/${TIPS}`}>
          <Dashboard><Tips /></Dashboard>
        </Route>
        <Route path={`/${YOUR_POSTS}`}>
          <Dashboard><YourPosts /></Dashboard>
        </Route>
        <Route path={`/${SEARCH_RESULTS}`}>
          <Dashboard><SearchResults /></Dashboard>
        </Route>
        {/* <Dashboard /> */}
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
