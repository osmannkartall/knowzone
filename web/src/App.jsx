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
      fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/login`, { method: 'POST' })
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
          <Redirect to="/tips" />
        </Route>
        <Route exact path="/bug-fixes">
          <Dashboard><BugFixes /></Dashboard>
        </Route>
        <Route exact path="/tips">
          <Dashboard><Tips /></Dashboard>
        </Route>
        <Route exact path="/your-posts">
          <Dashboard><YourPosts /></Dashboard>
        </Route>
        <Route exact path="/search-results">
          <Dashboard><SearchResults /></Dashboard>
        </Route>
        {/* <Dashboard /> */}
        <Route exact path="/404" component={NotFound} />
        <Redirect to="/404" />
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
