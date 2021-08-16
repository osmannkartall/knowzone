import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Popover from '@material-ui/core/Popover';
import TuneIcon from '@material-ui/icons/Tune';
import { GRAY1, GRAY2, GRAY3, PRIMARY, WHITE } from '../../constants/colors';

const SEARCH_WIDTH = '100vh';

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    marginRight: theme.spacing(18),
    color: PRIMARY,
  },
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: GRAY1,
    size: 10,
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
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: WHITE,
    color: GRAY1,
    borderBottom: `1px solid ${GRAY3}`,
  },
  searchOptions: {
    flexGrow: 1,
    padding: theme.spacing(0, 2),
  },
  searchOptionsWrapper: {
    width: SEARCH_WIDTH,
    padding: theme.spacing(0.4),
  },
  accountBtn: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}));

const Topbar = () => {
  const history = useHistory();
  const classes = useStyles();

  const searchRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElSearch, setAnchorElSearch] = useState(null);
  const open = Boolean(anchorEl);
  const openSearch = Boolean(anchorElSearch);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuSearch = () => {
    setAnchorElSearch(searchRef.current);
  };

  const handleCloseSearch = () => {
    setAnchorElSearch(null);
  };

  const onClickYourPosts = () => {
    handleClose();
    console.log('your posts');
    history.push('your-posts');
  };

  const onClickAccount = () => {
    handleClose();
    console.log('account');
    // history.push('account');
  };

  const onClickLogout = () => {
    handleClose();
    console.log('logout');
    // history.push('/');
  };

  const id = open ? 'simple-popover' : undefined;

  return (
    <AppBar elevation={0} position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography className={classes.title} variant="h6">
          Knowzone
        </Typography>
        <div ref={searchRef} className={classes.searchWrapper}>
          <div className={`${classes.searchIcon} ${classes.icon}`}>
            <SearchIcon />
          </div>
          <input className={classes.searchInput} placeholder="Search..." />
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar-search"
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
        </div>

        <div className={classes.accountBtn}>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={onClickYourPosts}>Your Posts</MenuItem>
            <MenuItem onClick={onClickAccount}>Account</MenuItem>
            <MenuItem onClick={onClickLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
