import { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, IconButton, MenuItem, Menu } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import SearchBar from '../../common/SearchBar';
import { GRAY1, GRAY3, PRIMARY } from '../../constants/colors';
import { FE_ROUTES } from '../../constants/routes';
import { sidebarWidth, topbarHeight } from '../../constants/styles';
import AppLogo from '../../common/AppLogo';
import { useAuthDispatch } from '../../contexts/AuthContext';
import { logout } from '../../contexts/AuthActions';
import LinearProgressModal from '../../common/LinearProgressModal';

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
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
    },
  },
  menuButton: {
    margin: theme.spacing(0, 2),
    width: 40,
    height: 40,
  },
  appLogoLink: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'none',
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(2),
    },
  },
  appLogoTitle: {
    display: 'inlineBlock',
    color: PRIMARY,
    marginLeft: theme.spacing(0.5),
    lineHeight: '30px',
    fontSize: 25,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

const AppLogoWithTitle = () => {
  const classes = useStyles();

  return (
    <a href={process.env.REACT_APP_KNOWZONE_FE_URI} className={classes.appLogoLink}>
      <AppLogo width="30" height="30" />
      <span className={classes.appLogoTitle}>Knowzone</span>
    </a>
  );
};

const Topbar = ({ openSidebar }) => {
  const [anchorMenu, setAnchorMenu] = useState(null);
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const isMenuOpen = Boolean(anchorMenu);
  const authDispatch = useAuthDispatch();
  const isMounted = useRef(true);

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

  const onClickLogout = useCallback(async () => {
    try {
      setIsLinearProgressModalOpen(true);

      const response = await logout(authDispatch);

      if (response.status === 'success') {
        history.push(`/${FE_ROUTES.LOGIN}`);
      } else {
        console.log(response.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      if (isMounted.current) {
        closeMenu();
        setIsLinearProgressModalOpen(false);
      }
    }
  }, [history, authDispatch]);

  useEffect(() => function cleanup() {
    isMounted.current = false;
  }, []);

  return (
    <LinearProgressModal isOpen={isLinearProgressModalOpen}>
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
          <AppLogoWithTitle />
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
    </LinearProgressModal>
  );
};

export default Topbar;
