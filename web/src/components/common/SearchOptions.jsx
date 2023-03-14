import {
  makeStyles,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  Divider,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import TagPicker from './TagPicker/TagPicker';
import POST_TYPES from '../../constants/post-types';
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
        <SearchOptionRow label="Post Type">
          <Select
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
            onNotUniqueError={handleTopicsNotUniqueError}
            fullWidth
            unique
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
          <div className={classes.datePickerOuterContainer}>
            <div className={classes.datePickerInnerContainer}>
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
                  placeholder="Enter Start Date"
                  onChange={handleDateChange('createdStartDate')}
                  maxDate={options.createdEndDate}
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
                  id="search-option-created-end-date"
                  name="createdEndDate"
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  value={options.createdEndDate}
                  placeholder="Enter End Date"
                  onChange={handleDateChange('createdEndDate')}
                  minDate={options.createdStartDate}
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
                  id="search-option-modified-start-date"
                  name="modifiedStartDate"
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  value={options.modifiedStartDate}
                  placeholder="Enter Start Date"
                  onChange={handleDateChange('modifiedStartDate')}
                  minDate={options.createdStartDate}
                  maxDate={options.modifiedEndDate}
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
                  id="search-option-modified-end-date"
                  name="modifiedEndDate"
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  value={options.modifiedEndDate}
                  placeholder="Enter End Date"
                  onChange={handleDateChange('modifiedEndDate')}
                  minDate={options.modifiedStartDate}
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
