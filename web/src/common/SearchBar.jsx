import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IconButton, makeStyles, Grid } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import TuneIcon from '@material-ui/icons/Tune';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import SearchOptions from './SearchOptions';
import { GRAY2, GRAY3, PRIMARY } from '../constants/colors';
import { FE_ROUTES } from '../constants/routes';
import { searchBarHeight } from '../constants/styles';

const useStyles = makeStyles((theme) => ({
  searchBarWrapper: {
    display: 'flex',
    width: '100%',
    zIndex: 3,
    height: searchBarHeight,
    border: `1px solid ${GRAY3}`,
    borderRadius: 6,
    position: 'relative',
  },
  searchBar: {
    display: 'flex',
    flex: 1,
  },
  searchIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    color: GRAY2,
  },
  searchIcon: {
    width: 20,
    height: 20,
    lineHeight: 20,
  },
  searchInputWrapper: {
    display: 'flex',
    flex: 1,
    flexWrap: 'wrap',
  },
  searchInput: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '100%',
    outline: 'none',
    wordWrap: 'break-word',
    border: 'none',
    fontSize: 16,
  },
  optionsIconButtonWrapper: {
    display: 'flex',
    flexBasis: 'auto',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  },
}));

const SearchBar = () => {
  const emptySearchOptions = {
    searchText: '',
    postType: '',
    error: '',
    solution: '',
    description: '',
    topics: [],
    author: '',
    createdStartDate: null,
    createdEndDate: null,
    modifiedStartDate: null,
    modifiedEndDate: null,
  };
  const [searchOptions, setSearchOptions] = useState(emptySearchOptions);
  const [isSearchOptionsMenuOpen, setIsSearchOptionsMenuOpen] = useState(false);
  const [areTopicsUnique, setAreTopicsUnique] = useState(true);

  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const handleTopicsNotUniqueError = (unique) => setAreTopicsUnique(unique);

  const toggleSearchOptionsMenu = () => setIsSearchOptionsMenuOpen(!isSearchOptionsMenuOpen);

  const hideSearchOptionsMenu = () => setIsSearchOptionsMenuOpen(false);

  const handleDateChange = (prop) => (date) => setSearchOptions({ ...searchOptions, [prop]: date });

  const handleOptionChange = (prop) => (event) => (
    setSearchOptions({ ...searchOptions, [prop]: event.target.value })
  );

  const handleResetOnClick = () => setSearchOptions(emptySearchOptions);

  const areAllSearchOptionsEmpty = () => {
    const { searchText, ...rest } = searchOptions;
    return Object.values(rest).every((value) => isEmpty(value)) && !searchText.trim();
  };

  const checkAllSearchOptions = () => !areAllSearchOptionsEmpty() && areTopicsUnique;

  const checkDates = () => {
    if ((searchOptions.createdStartDate && searchOptions.createdEndDate)
      && (searchOptions.createdStartDate > searchOptions.createdEndDate)) {
      return false;
    }
    if ((searchOptions.modifiedStartDate && searchOptions.modifiedEndDate)
      && (searchOptions.modifiedStartDate > searchOptions.modifiedEndDate)) {
      return false;
    }
    return true;
  };

  const search = () => {
    // Copy state object with spread operator to not mutate itself.
    const tempSearchOptions = { ...searchOptions };

    Object.entries(searchOptions).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && !value.length)) {
        delete tempSearchOptions[key];
      }
    });

    hideSearchOptionsMenu();
    const data = JSON.parse(JSON.stringify(tempSearchOptions));
    history.push(FE_ROUTES.SEARCH_RESULTS, data);
  };

  const searchOrGiveError = () => {
    if (areAllSearchOptionsEmpty()) {
      toast.error('Could not search! Type what to search or specify search options correctly.');
    } else if (!areTopicsUnique) {
      toast.error('Could not search! Topics should be unique');
    } else if (!checkDates()) {
      toast.error('Invalid dates!');
    } else {
      search();
    }
  };

  const handleSearchOnClick = () => {
    searchOrGiveError();
  };

  const handleOnPressEnter = (event) => {
    if (event.key === 'Enter') {
      searchOrGiveError();
    }
  };

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (location.pathname !== `/${FE_ROUTES.SEARCH_RESULTS}` && checkAllSearchOptions()) {
        handleResetOnClick();
      } else if (location.state !== undefined) {
        setSearchOptions({ ...emptySearchOptions, ...location.state });
      }
    }
    return function cleanup() {
      mounted = false;
    };
  }, [location.pathname, location.state]);

  return (
    <>
      <Grid item xs={12} sm={7} md={7} lg={7} className={classes.searchBarWrapper}>
        <div className={classes.searchBar}>
          <div className={classes.searchIconWrapper}>
            <SearchIcon className={classes.searchIcon} />
          </div>
          <div className={classes.searchInputWrapper}>
            <input
              className={classes.searchInput}
              type="text"
              placeholder="Search"
              value={searchOptions.searchText}
              onKeyPress={handleOnPressEnter}
              onChange={handleOptionChange('searchText')}
            />
          </div>
          <div className={classes.optionsIconButtonWrapper}>
            <IconButton
              aria-label="search options"
              aria-controls="menu-search"
              aria-haspopup="true"
              style={{ width: 35, height: 35, color: PRIMARY }}
              onClick={toggleSearchOptionsMenu}
            >
              <TuneIcon />
            </IconButton>
          </div>
        </div>
        {isSearchOptionsMenuOpen && (
          <SearchOptions
            options={searchOptions}
            setTopics={(topics) => setSearchOptions({ ...searchOptions, topics })}
            handleOptionChange={handleOptionChange}
            handleDateChange={handleDateChange}
            handleSearchOnClick={handleSearchOnClick}
            handleResetOnClick={handleResetOnClick}
            handleTopicsNotUniqueError={handleTopicsNotUniqueError}
          />
        )}
      </Grid>
    </>
  );
};

export default SearchBar;
