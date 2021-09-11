import { React } from 'react';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import Typography from '@material-ui/core/Typography';

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TagPicker from '../common/TagPicker/TagPicker';
import POST_TYPES from '../constants/post-types';

const MAX_HEIGHT = 498;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  top: {
    maxHeight: MAX_HEIGHT,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  searchButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: theme.spacing(0, 2),
  },
}));

const CONTAINER_SPACING = 4;

const CONTAINER_STYLE = {
  marginTop: 0,
  marginBottom: 10,
  paddingRight: 20,
  paddingLeft: 20,
};

const SearchOptionRow = ({ label, children }) => (
  <Grid container spacing={CONTAINER_SPACING} alignItems="center" style={CONTAINER_STYLE}>
    <Grid item xs={3}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
    </Grid>
    <Grid item xs={9}>
      {children}
    </Grid>
  </Grid>
);

const SearchOptions = ({
  options,
  setTopics,
  handleOptionChange,
  handleDateChange,
  handleResetOnClick,
  handleSearchOnClick,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.top}>
        <SearchOptionRow label="Post Type">
          <Select
            id="search-option-post-type-select"
            name="postType"
            value={options.postType}
            onChange={handleOptionChange('postType')}
            fullWidth
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {Array.from(POST_TYPES).map(([, opt]) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.name}</MenuItem>
            ))}
          </Select>
        </SearchOptionRow>
        {options.postType !== POST_TYPES.get('tip').value ? (
          <>
            <SearchOptionRow label="Error">
              <TextField
                id="search-option-error-text"
                name="error"
                multiline
                maxRows={4}
                value={options.error}
                onChange={handleOptionChange('error')}
                fullWidth
              />
            </SearchOptionRow>
            <SearchOptionRow label="Solution">
              <TextField
                id="search-option-solution-text"
                name="solution"
                value={options.solution}
                onChange={handleOptionChange('solution')}
                fullWidth
              />
            </SearchOptionRow>
          </>
        ) : null}
        <SearchOptionRow label="Description">
          <TextField
            id="search-option-description-text"
            name="description"
            value={options.description}
            onChange={handleOptionChange('description')}
            fullWidth
          />
        </SearchOptionRow>
        <SearchOptionRow label="Topics">
          <TagPicker
            id="search-option-tag-picker"
            name="topics"
            tags={options.topics}
            setTags={setTopics}
            fullWidth
          />
        </SearchOptionRow>
        <SearchOptionRow label="Author">
          <TextField
            id="search-option-author-text"
            name="author"
            value={options.author}
            onChange={handleOptionChange('author')}
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
                  value={options.createdStartDate}
                  placeholder="Enter Date"
                  onChange={handleDateChange('createdStartDate')}
                  maxDate={options.createdEndDate}
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
                  value={options.createdEndDate}
                  placeholder="Enter Date"
                  onChange={handleDateChange('createdEndDate')}
                  minDate={options.createdStartDate}
                  maxDate={Date.now()}
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
                  value={options.modifiedStartDate}
                  placeholder="Enter Date"
                  onChange={handleDateChange('modifiedStartDate')}
                  minDate={options.createdStartDate}
                  maxDate={options.modifiedEndDate}
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
                  value={options.modifiedEndDate}
                  placeholder="Enter Date"
                  onChange={handleDateChange('modifiedEndDate')}
                  minDate={options.modifiedStartDate}
                  maxDate={Date.now()}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
        </SearchOptionRow>
      </div>
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
