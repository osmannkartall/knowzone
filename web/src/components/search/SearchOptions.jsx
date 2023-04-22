import { Grid, Typography, Button, Divider, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { searchBarHeight } from '../../constants/styles';
import { WHITE } from '../../constants/colors';
import Chips from '../common/Chips';

const PREFIX = 'SearchOptions';

const classes = {
  container: `${PREFIX}-container`,
  topContainer: `${PREFIX}-topContainer`,
  searchOptionRow: `${PREFIX}-searchOptionRow`,
  searchOptionTitle: `${PREFIX}-searchOptionTitle`,
  bottomButtons: `${PREFIX}-bottomButtons`,
  datePickerOuterContainer: `${PREFIX}-datePickerOuterContainer`,
  datePickerInnerContainer: `${PREFIX}-datePickerInnerContainer`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.container}`]: {
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

  [`& .${classes.topContainer}`]: {
    overflowY: 'auto',
  },

  [`& .${classes.searchOptionRow}`]: {
    marginBottom: theme.spacing(5),
    padding: theme.spacing(2),
    paddingBottom: 0,
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },

  [`& .${classes.searchOptionTitle}`]: {
    marginBottom: theme.spacing(1),
  },

  [`& .${classes.bottomButtons}`]: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: theme.spacing(2),
  },

  [`& .${classes.datePickerOuterContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },

  [`& .${classes.datePickerInnerContainer}`]: {
    marginRight: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      marginRight: 0,
    },
  },
}));

function SearchOptionRow({ label, children }) {
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
}

function SearchOptions({
  options,
  setTopics,
  handleOptionChange,
  handleDateChange,
  handleResetOnClick,
  handleSearchOnClick,
}) {
  return (
    <Root className={classes.container}>
      <div className={classes.topContainer}>
        <SearchOptionRow label="Type">
          <TextField
            variant="standard"
            value={options.typeName}
            onChange={handleOptionChange('typeName')}
            fullWidth
          />
        </SearchOptionRow>
        <SearchOptionRow label="Topics">
          <Chips chips={options.topics} setChips={setTopics} border />
        </SearchOptionRow>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SearchOptionRow label="Date Created">
            <div className={classes.datePickerOuterContainer}>
              <div className={classes.datePickerInnerContainer}>
                <DatePicker
                  disableFuture
                  id="search-option-createdAt-start-date"
                  label="Start Date"
                  name="createdAtStartDate"
                  format="dd/MM/yyyy"
                  value={options.createdAtStartDate}
                  onChange={handleDateChange('createdAtStartDate')}
                  maxDate={options.createdAtEndDate}
                />
              </div>
              <div>
                <DatePicker
                  disableFuture
                  id="search-option-createdAt-end-date"
                  label="End Date"
                  name="createdAtEndDate"
                  format="dd/MM/yyyy"
                  value={options.createdAtEndDate}
                  onChange={handleDateChange('createdAtEndDate')}
                  minDate={options.createdAtStartDate}
                  maxDate={Date.now()}
                />
              </div>
            </div>
          </SearchOptionRow>
          <SearchOptionRow label="Date Modified">
            <div className={classes.datePickerOuterContainer}>
              <div className={classes.datePickerInnerContainer}>
                <DatePicker
                  disableFuture
                  id="search-option-updatedAt-start-date"
                  label="Start Date"
                  name="updatedAtStartDate"
                  format="dd/MM/yyyy"
                  value={options.updatedAtStartDate}
                  onChange={handleDateChange('updatedAtStartDate')}
                  minDate={options.createdAtStartDate}
                  maxDate={options.updatedAtEndDate}
                />
              </div>
              <div>
                <DatePicker
                  disableFuture
                  id="search-option-updatedAt-end-date"
                  label="End Date"
                  name="updatedAtEndDate"
                  format="dd/MM/yyyy"
                  value={options.updatedAtEndDate}
                  onChange={handleDateChange('updatedAtEndDate')}
                  minDate={options.updatedAtStartDate}
                  maxDate={Date.now()}
                />
              </div>
            </div>
          </SearchOptionRow>
        </LocalizationProvider>
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
    </Root>
  );
}

export default SearchOptions;
