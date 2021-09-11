import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Popover, IconButton, makeStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import TuneIcon from '@material-ui/icons/Tune';
import { toast } from 'react-toastify';
import SearchOptions from './SearchOptions';
import { GRAY1, GRAY2, GRAY3, PRIMARY } from '../constants/colors';
import { FE_ROUTES } from '../constants/routes';

const SEARCH_WIDTH = 700;

const useStyles = makeStyles((theme) => ({
  searchWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SEARCH_WIDTH,
    padding: theme.spacing(0.4),
    border: `1px solid ${GRAY3}`,
    borderRadius: 6,
  },
  searchInput: {
    flexGrow: 1,
    color: GRAY1,
    border: 0,
    '&:focus': {
      outline: 'none',
    },
    '&::placeholder': {
      color: '#c1c1c1',
    },
    marginLeft: 5,
    padding: theme.spacing(0, 1),
    fontSize: 18,
  },
  icon: {
    margin: theme.spacing(0, 0.5),
  },
  searchIcon: {
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: GRAY2,
  },
  searchOptionsWrapper: {
    flexGrow: 1,
    width: SEARCH_WIDTH,
    padding: theme.spacing(0.4),
  },
}));

const SearchBar = ({ options }) => {
  const [anchorElSearch, setAnchorElSearch] = useState(null);
  const searchRef = useRef(null);
  const classes = useStyles();
  const openSearch = Boolean(anchorElSearch);
  const history = useHistory();
  const location = useLocation();
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

  const handleMenuSearch = () => setAnchorElSearch(searchRef.current);

  const handleCloseSearch = () => setAnchorElSearch(null);

  const handleDateChange = (prop) => (date) => setSearchOptions({ ...searchOptions, [prop]: date });

  const handleOptionChange = (prop) => (event) => (
    setSearchOptions({ ...searchOptions, [prop]: event.target.value })
  );

  const handleResetOnClick = () => {
    setSearchOptions(emptySearchOptions);
  };

  const checkAllSearchOptions = () => (
    searchOptions.searchText
    || searchOptions.postType
    || searchOptions.error
    || searchOptions.solution
    || searchOptions.description
    || searchOptions.topics.length
    || searchOptions.author
    || searchOptions.createdStartDate
    || searchOptions.createdEndDate
    || searchOptions.modifiedStartDate
    || searchOptions.modifiedEndDate
  );

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

    handleCloseSearch();
    const data = JSON.parse(JSON.stringify(tempSearchOptions));
    history.push(FE_ROUTES.SEARCH_RESULTS, data);
  };

  const handleSearchOnClick = () => {
    if (!checkAllSearchOptions()) {
      toast.error('Could not search! Type what to search or specify search options.');
    } else if (!checkDates()) {
      toast.error('Invalid dates!');
    } else {
      search();
    }
  };

  const handleOnPressEnter = (event) => {
    if (event.key === 'Enter' && searchOptions.searchText) {
      search();
    }
  };

  const id = openSearch ? 'menu-search' : undefined;

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (location.pathname !== '/search-results' && checkAllSearchOptions()) {
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
    <div ref={searchRef} className={classes.searchWrapper}>
      <div className={`${classes.searchIcon} ${classes.icon}`}>
        <SearchIcon />
      </div>
      <input
        className={classes.searchInput}
        value={searchOptions.searchText}
        onKeyPress={handleOnPressEnter}
        placeholder="Search..."
        onChange={handleOptionChange('searchText')}
      />
      {options && (
        <>
          <IconButton
            aria-label="search options"
            aria-controls="menu-search"
            aria-haspopup="true"
            onClick={handleMenuSearch}
            style={{ width: 40, height: 40, color: PRIMARY }}
            className={classes.icon}
          >
            <TuneIcon />
          </IconButton>
          <Popover
            id={id}
            open={openSearch}
            anchorEl={anchorElSearch}
            onClose={handleCloseSearch}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <div className={classes.searchOptionsWrapper}>
              <SearchOptions
                options={searchOptions}
                setTopics={(topics) => setSearchOptions({ ...searchOptions, topics })}
                handleOptionChange={handleOptionChange}
                handleDateChange={handleDateChange}
                handleSearchOnClick={handleSearchOnClick}
                handleResetOnClick={handleResetOnClick}
              />
            </div>
          </Popover>
        </>
      )}
    </div>
  );
};

SearchBar.defaultProps = {
  options: true,
};

export default SearchBar;
