import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import Dashboard from './components/Dashboard/Dashboard';
import Tips from './components/Tips';
import BugFixes from './components/BugFixes';
import YourPosts from './components/YourPosts';
import SearchResults from './components/SearchResults';
import { PRIMARY, WHITE } from './constants/colors';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Redirect to="/tips" />
          </Route>
          <Route path="/bug-fixes">
            <Dashboard><BugFixes /></Dashboard>
          </Route>
          <Route path="/tips">
            <Dashboard><Tips /></Dashboard>
          </Route>
          <Route path="/your-posts">
            <Dashboard><YourPosts /></Dashboard>
          </Route>
          <Route path="/search-results">
            <Dashboard><SearchResults /></Dashboard>
          </Route>
        </Switch>
      </BrowserRouter>
      {/* <Dashboard /> */}
    </ThemeProvider>
  );
}

export default App;
