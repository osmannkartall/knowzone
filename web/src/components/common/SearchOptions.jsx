import { makeStyles, Grid, Typography, Button, Divider, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TagPicker from './TagPicker/TagPicker';
import { searchBarHeight } from '../../constants/styles';
import { WHITE } from '../../constants/colors';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'absolute',
    top: searchBarHeight,
    left: 0,
    maxHeight: `calc(80vh - ${theme.spacing(4)}px)`,
    minHeight: 100,
    backgroundColor: WHITE,
    boxShadow: ' 0px 8px 10px 2px rgb(101 119 134 / 20%)',
  },
  topContainer: {
    overflowY: 'auto',
  },
  searchOptionRow: {
    marginBottom: theme.spacing(5),
    padding: theme.spacing(2),
    paddingBottom: 0,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  searchOptionTitle: {
    marginBottom: theme.spacing(1),
  },
  bottomButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: theme.spacing(2),
  },
  datePickerOuterContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  datePickerInnerContainer: {
    marginRight: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
    },
  },
}));

const SearchOptionRow = ({ label, children }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.searchOptionRow}>
      <Grid item xs={12} sm={12} md={3} lg={3} className={classes.searchOptionTitle}>
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={9} lg={9}>
        {children}
      </Grid>
    </Grid>
  );
};

const SearchOptions = ({
  options,
  setTopics,
  handleOptionChange,
  handleDateChange,
  handleResetOnClick,
  handleSearchOnClick,
  handleTopicsNotUniqueError,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.topContainer}>
        <SearchOptionRow label="Type">
          <TextField
            value={options.type}
            onChange={handleOptionChange('type')}
            fullWidth
          />
        </SearchOptionRow>
        <SearchOptionRow label="Topics">
          <TagPicker
            id="search-option-tag-picker"
            name="topics"
            tags={options.topics}
            setTags={setTopics}
            onNotUniqueError={handleTopicsNotUniqueError}
            fullWidth
            unique
          />
        </SearchOptionRow>
        <SearchOptionRow label="Date Created">
          <div className={classes.datePickerOuterContainer}>
            <div className={classes.datePickerInnerContainer}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  disableFuture
                  id="search-option-createdAt-start-date"
                  name="createdAtStartDate"
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  value={options.createdAtStartDate}
                  placeholder="Enter Start Date"
                  onChange={handleDateChange('createdAtStartDate')}
                  maxDate={options.createdAtEndDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  disableFuture
                  id="search-option-createdAt-end-date"
                  name="createdAtEndDate"
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  value={options.createdAtEndDate}
                  placeholder="Enter End Date"
                  onChange={handleDateChange('createdAtEndDate')}
                  minDate={options.createdAtStartDate}
                  maxDate={Date.now()}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>
        </SearchOptionRow>
        <SearchOptionRow label="Date Modified">
          <div className={classes.datePickerOuterContainer}>
            <div className={classes.datePickerInnerContainer}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  disableFuture
                  id="search-option-updatedAt-start-date"
                  name="updatedAtStartDate"
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  value={options.updatedAtStartDate}
                  placeholder="Enter Start Date"
                  onChange={handleDateChange('updatedAtStartDate')}
                  minDate={options.createdAtStartDate}
                  maxDate={options.updatedAtEndDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  disableFuture
                  id="search-option-updatedAt-end-date"
                  name="updatedAtEndDate"
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  value={options.updatedAtEndDate}
                  placeholder="Enter End Date"
                  onChange={handleDateChange('updatedAtEndDate')}
                  minDate={options.updatedAtStartDate}
                  maxDate={Date.now()}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>
        </SearchOptionRow>
      </div>
      <Divider />
      <div className={classes.bottomButtons}>
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
      </div>
    </div>
  );
};

export default SearchOptions;
