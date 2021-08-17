import React, { useState, useRef } from 'react';
import { Popover, IconButton, makeStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import TuneIcon from '@material-ui/icons/Tune';
import { GRAY1, GRAY2, GRAY3, PRIMARY } from '../constants/colors';

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
  searchOptions: {
    flexGrow: 1,
    padding: theme.spacing(0, 2),
  },
  searchOptionsWrapper: {
    width: SEARCH_WIDTH,
    padding: theme.spacing(0.4),
  },
}));

const SearchBar = ({ value, handleChange, options }) => {
  const [anchorElSearch, setAnchorElSearch] = useState(null);
  const searchRef = useRef(null);
  const classes = useStyles();
  const openSearch = Boolean(anchorElSearch);

  const handleMenuSearch = () => setAnchorElSearch(searchRef.current);

  const handleCloseSearch = () => setAnchorElSearch(null);

  const search = () => {
    console.log('Navigate to search results');
  };

  const handleOnPressEnter = (event) => {
    if (event.key === 'Enter' && value) {
      console.log('You pressed enter:', value);
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
      { options && (
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
              <div className={classes.searchOptions}>
                <p>Lorem ipsum</p>
                <p>Lorem ipsum</p>
                <p>Lorem ipsum</p>
                <p>Lorem ipsum</p>
                <p>Lorem ipsum</p>
                <p>Lorem ipsum</p>
                <p>Lorem ipsum</p>
              </div>
            </div>
          </Popover>
        </>
      )}
    </div>
  );
};

SearchBar.defaultProps = {
  options: true,
  value: '',
};

export default SearchBar;
