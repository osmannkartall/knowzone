import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, IconButton, MenuItem, Menu } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import SearchBar from '../SearchBar';
import { GRAY1, GRAY3 } from '../../constants/colors';
import { FE_ROUTES } from '../../constants/routes';
import { sidebarWidth, topbarHeight } from '../../constants/styles';
import AppLogo from '../../common/AppLogo';

const useStyles = makeStyles((theme) => ({
  topbar: {
    display: 'flex',
    flexDirection: 'row',
    color: GRAY1,
    borderBottom: `1px solid ${GRAY3}`,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 5,
    position: 'sticky',
    top: 0,
    height: topbarHeight,
  },
  accountButton: {
    margin: theme.spacing(0, 2),
  },
  topbarLeftContainer: {
    height: topbarHeight,
    width: sidebarWidth,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflowX: 'hidden',
    [theme.breakpoints.only('xs')]: {
      justifyContent: 'space-between',
    },
  },
  menuButton: {
    margin: theme.spacing(0, 2),
    width: 40,
    height: 40,
  },
  appLogoLink: {
    height: 50,
    [theme.breakpoints.only('xs')]: {
      overflow: 'hidden',
      marginRight: theme.spacing(3),
      marginLeft: theme.spacing(1),
    },
  },
}));

const Topbar = ({ openSidebar }) => {
  const [anchorMenu, setAnchorMenu] = useState(null);
  const history = useHistory();
  const classes = useStyles();
  const isMenuOpen = Boolean(anchorMenu);

  const toggleMenu = (event) => setAnchorMenu(event.currentTarget);

  const closeMenu = () => setAnchorMenu(null);

  const onClickYourPosts = () => {
    closeMenu();
    history.push(FE_ROUTES.YOUR_POSTS);
  };

  const onClickAccount = () => {
    closeMenu();
    console.log('account');
    // history.push('account');
  };

  const onClickLogout = () => {
    closeMenu();
    console.log('logout');
    // history.push('/');
  };

  return (
    <div className={classes.topbar}>
      <div className={classes.topbarLeftContainer}>
        <IconButton
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={openSidebar}
        >
          <MenuIcon />
        </IconButton>
        <a href="http://localhost:3000" className={classes.appLogoLink}>
          <AppLogo
            width="140"
            height="50"
          />
        </a>
      </div>
      <SearchBar />
      <div className={classes.accountButton}>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-topbar"
          aria-haspopup="true"
          onClick={toggleMenu}
          color="inherit"
          style={{ width: 40, height: 40 }}
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-topbar"
          anchorEl={anchorMenu}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={isMenuOpen}
          onClose={closeMenu}
        >
          <MenuItem onClick={onClickYourPosts}>Your Posts</MenuItem>
          <MenuItem onClick={onClickAccount}>Account</MenuItem>
          <MenuItem onClick={onClickLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Topbar;
