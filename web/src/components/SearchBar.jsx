import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Popover, IconButton, makeStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import TuneIcon from '@material-ui/icons/Tune';
import SearchOptions from './SearchOptions';
import { GRAY1, GRAY2, GRAY3, PRIMARY } from '../constants/colors';

const SEARCH_WIDTH = 700;
const POST_TYPES = ['Tip', 'Bug Fix'];

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
  searchOptions: {
    flexGrow: 1,
    padding: theme.spacing(0, 2),
  },
  searchOptionsWrapper: {
    flexGrow: 1,
    width: SEARCH_WIDTH,
    padding: theme.spacing(0.4),
  },
}));

const SearchBar = ({ searchText, handleChange, options }) => {
  const [anchorElSearch, setAnchorElSearch] = useState(null);
  const searchRef = useRef(null);
  const classes = useStyles();
  const openSearch = Boolean(anchorElSearch);
  const history = useHistory();
  const [searchOptions, setSearchOptions] = useState({
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
  });

  const handleMenuSearch = () => setAnchorElSearch(searchRef.current);

  const handleCloseSearch = () => setAnchorElSearch(null);

  const handleDateChange = (prop) => (date) => {
    setSearchOptions({ ...searchOptions, [prop]: date });
  };

  const handleOptionChange = (prop) => (event) => {
    setSearchOptions({ ...searchOptions, [prop]: event.target.value });
  };

  const handleResetOnClick = () => {
    setSearchOptions({
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
    });
  };

  const search = () => {
    // Copy state object with spread operator to not mutate itself.
    const tempSearchOptions = { ...searchOptions };

    Object.entries(searchOptions).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && !value.length)) {
        delete tempSearchOptions[key];
      }
    });
    const params = new URLSearchParams(tempSearchOptions);
    if (searchText) {
      params.append('searchText', searchText);
    }

    handleCloseSearch();
    history.push({
      pathname: '/search-results',
      search: params.toString(),
    });
  };

  const handleSearchOnClick = () => {
    search();
  };

  const handleOnPressEnter = (event) => {
    if (event.key === 'Enter' && searchText) {
      console.log('You pressed enter:', searchText);
      search();
    }
  };

  const id = openSearch ? 'menu-search' : undefined;

  return (
    <div ref={searchRef} className={classes.searchWrapper}>
      <div className={`${classes.searchIcon} ${classes.icon}`}>
        <SearchIcon />
      </div>
      <input
        className={classes.searchInput}
        onKeyPress={handleOnPressEnter}
        placeholder="Search..."
        onChange={handleChange}
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
                postTypes={POST_TYPES}
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
  searchText: '',
};

export default SearchBar;
