import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconButton, Grid, TextField, InputAdornment, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import SearchOptions from './SearchOptions';
import { FE_ROUTES } from '../../constants/routes';

const PREFIX = 'SearchBar';

const classes = {
  optionsIconButtonWrapper: `${PREFIX}-optionsIconButtonWrapper`,
};

const Root = styled(Grid)(() => ({
  display: 'flex',
  width: '100%',
  zIndex: 3,
  position: 'relative',

  [`& .${classes.optionsIconButtonWrapper}`]: {
    display: 'flex',
    flexBasis: 'auto',
    alignItems: 'center',
  },
}));

function SearchBar() {
  const emptySearchOptions = {
    searchText: '',
    typeName: '',
    topics: [],
    createdAtStartDate: null,
    createdAtEndDate: null,
    updatedAtStartDate: null,
    updatedAtEndDate: null,
  };
  const [searchOptions, setSearchOptions] = useState(emptySearchOptions);
  const [isSearchOptionsMenuOpen, setIsSearchOptionsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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

  const checkAllSearchOptions = () => !areAllSearchOptionsEmpty();

  const checkDates = () => {
    if ((searchOptions.createdAtStartDate && searchOptions.createdAtEndDate)
      && (searchOptions.createdAtStartDate > searchOptions.createdAtEndDate)) {
      return false;
    }
    if ((searchOptions.updatedAtStartDate && searchOptions.updatedAtEndDate)
      && (searchOptions.updatedAtStartDate > searchOptions.updatedAtEndDate)) {
      return false;
    }
    return true;
  };

  const search = () => {
    const searchOptionsBodyState = { ...searchOptions };

    Object.entries(searchOptions).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && !value.length)) {
        delete searchOptionsBodyState[key];
      }
    });

    hideSearchOptionsMenu();
    navigate(`/${FE_ROUTES.SEARCH_RESULTS}`, { state: { searchOptionsBodyState } });
  };

  const searchOrGiveError = () => {
    if (areAllSearchOptionsEmpty()) {
      toast.error('Could not search! Type what to search or specify search options correctly.');
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
      const { searchOptionsBodyState } = location.state ?? {};

      if (location.pathname !== `/${FE_ROUTES.SEARCH_RESULTS}` && checkAllSearchOptions()) {
        handleResetOnClick();
      } else if (location.state !== undefined) {
        setSearchOptions({ ...emptySearchOptions, ...searchOptionsBodyState });
      }
    }
    return function cleanup() {
      mounted = false;
    };
  }, [location.pathname, location.state]);

  return (
    <Root item xs={5} sm={6} md={6} lg={7}>
      <TextField
        id="search"
        value={searchOptions.searchText}
        onChange={handleOptionChange('searchText')}
        onKeyDown={handleOnPressEnter}
        size="small"
        fullWidth
        placeholder="Search"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                aria-label="search-icon"
                size="small"
                onClick={handleSearchOnClick}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end" sx={{ p: 0 }}>
              <Divider sx={{ height: 24, m: 1 }} orientation="vertical" />
              <div className={classes.optionsIconButtonWrapper}>
                <IconButton
                  aria-label="search options"
                  aria-controls="menu-search"
                  aria-haspopup="true"
                  onClick={toggleSearchOptionsMenu}
                  size="small"
                >
                  <TuneIcon />
                </IconButton>
              </div>
            </InputAdornment>
          ),
        }}
      />
      {isSearchOptionsMenuOpen && (
        <SearchOptions
          options={searchOptions}
          setTopics={(topics) => setSearchOptions({ ...searchOptions, topics })}
          handleOptionChange={handleOptionChange}
          handleDateChange={handleDateChange}
          handleSearchOnClick={handleSearchOnClick}
          handleResetOnClick={handleResetOnClick}
        />
      )}
    </Root>
  );
}

export default SearchBar;
