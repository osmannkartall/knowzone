import { React, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import Typography from '@material-ui/core/Typography';

import 'date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TagPicker from '../common/TagPicker/TagPicker';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  searchButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: theme.spacing(0, 2),
  },
}));

const CONTAINER_SPACING = 4;

// Avoids overlapping
const CONTAINER_STYLE = {
  marginTop: 0,
  marginBottom: 10,
};

const OPTIONS = ['Tip', 'Bug Fix'];

const SearchOptionRow = ({ label, children }) => (
  <Grid container spacing={CONTAINER_SPACING} alignItems="center" style={CONTAINER_STYLE}>
    <Grid item xs={2}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
    </Grid>
    <Grid item xs={10}>
      {children}
    </Grid>
  </Grid>
);

const SearchOptions = ({ searchText }) => {
  const classes = useStyles();
  const history = useHistory();
  const [values, setValues] = useState({
    option: '',
    error: '',
    solution: '',
    description: '',
    topics: [],
    author: '',
    createdStartDate: null,
    createdEndDate: null,
    modifiedStartDate: null,
    modifiedEndDate: null,
  });

  const handleDateChange = (prop) => (date) => {
    setValues({ ...values, [prop]: date });
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleResetOnClick = () => {
    setValues({
      option: '',
      error: '',
      solution: '',
      description: '',
      topics: [],
      author: '',
      createdStartDate: null,
      createdEndDate: null,
      modifiedStartDate: null,
      modifiedEndDate: null,
    });
  };

  const handleSearchOnClick = () => {
    // Copy state object with spread operator to not mutate itself.
    const tempValues = { ...values };

    Object.entries(values).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && !value.length)) {
        delete tempValues[key];
      }
    });

    const params = new URLSearchParams(tempValues);
    if (searchText) {
      params.append('searchText', searchText);
    }

    history.push({
      pathname: '/search-results',
      search: params.toString(),
    });
  };

  return (
    <div className={classes.root}>
      <SearchOptionRow label="Post Type">
        <Select
          id="search-option-post-select"
          name="option"
          value={values.option}
          onChange={handleChange('option')}
          fullWidth
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {OPTIONS ? OPTIONS.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>) : null}
        </Select>
      </SearchOptionRow>
      {values.option !== 'Tip' ? (
        <>
          <SearchOptionRow label="Error">
            <TextField
              id="search-option-error-text"
              name="error"
              multiline
              maxRows={4}
              value={values.error}
              onChange={handleChange('error')}
              fullWidth
            />
          </SearchOptionRow>
          <SearchOptionRow label="Solution">
            <TextField
              id="search-option-solution-text"
              name="solution"
              value={values.solution}
              onChange={handleChange('solution')}
              fullWidth
            />
          </SearchOptionRow>
        </>
      ) : null}
      <SearchOptionRow label="Description">
        <TextField
          id="search-option-description-text"
          name="description"
          value={values.description}
          onChange={handleChange('description')}
          fullWidth
        />
      </SearchOptionRow>
      <SearchOptionRow label="Topics">
        <TagPicker
          id="search-option-tag-picker"
          name="topics"
          tags={values.topics}
          setTags={(topics) => setValues({ ...values, topics })}
          fullWidth
        />
      </SearchOptionRow>
      <SearchOptionRow label="Author">
        <TextField
          id="search-option-author-text"
          name="author"
          value={values.author}
          onChange={handleChange('author')}
          fullWidth
        />
      </SearchOptionRow>
      <SearchOptionRow label="Date Created">
        <Grid container spacing={CONTAINER_SPACING} justifyContent="space-between">
          <Grid item xs>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                disableFuture
                id="search-option-created-start-date"
                name="createdStartDate"
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                value={values.createdStartDate}
                placeholder="Enter Date"
                onChange={handleDateChange('createdStartDate')}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                disableFuture
                id="search-option-created-end-date"
                name="createdEndDate"
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                value={values.createdEndDate}
                placeholder="Enter Date"
                onChange={handleDateChange('createdEndDate')}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </SearchOptionRow>
      <SearchOptionRow label="Date Modified">
        <Grid container spacing={CONTAINER_SPACING} justifyContent="space-between">
          <Grid item xs>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                disableFuture
                id="search-option-modified-start-date"
                name="modifiedStartDate"
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                value={values.modifiedStartDate}
                placeholder="Enter Date"
                onChange={handleDateChange('modifiedStartDate')}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                disableFuture
                id="search-option-modified-end-date"
                name="modifiedEndDate"
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                value={values.modifiedEndDate}
                placeholder="Enter Date"
                onChange={handleDateChange('modifiedEndDate')}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </SearchOptionRow>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid container spacing={CONTAINER_SPACING} style={CONTAINER_STYLE}>
        <Grid item xs={12} className={classes.searchButtons}>
          <Button
            id="search-option-reset-button"
            name="reset"
            className={classes.resetButton}
            onClick={handleResetOnClick}
          >
            Reset
          </Button>
          <Button
            id="search-option-search-button"
            name="search"
            variant="contained"
            color="primary"
            className={classes.searchButton}
            onClick={handleSearchOnClick}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default SearchOptions;
