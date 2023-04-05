import { useState, useEffect, useCallback, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { IconButton, MenuItem, Menu } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import SearchBar from '../search/SearchBar';
import { GRAY1, GRAY3, PRIMARY } from '../../constants/colors';
import { FE_ROUTES } from '../../constants/routes';
import { sidebarWidth, topbarHeight } from '../../constants/styles';
import AppLogo from '../common/AppLogo';
import { useAuthDispatch } from '../../contexts/AuthContext';
import { logout } from '../../contexts/AuthActions';
import LinearProgressModal from '../common/LinearProgressModal';

const PREFIX = 'Topbar';

const classes = {
  topbar: `${PREFIX}-topbar`,
  accountButton: `${PREFIX}-accountButton`,
  topbarLeftContainer: `${PREFIX}-topbarLeftContainer`,
  menuButton: `${PREFIX}-menuButton`,
  appLogoLink: `${PREFIX}-appLogoLink`,
  appLogoTitle: `${PREFIX}-appLogoTitle`,
};

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  color: GRAY1,
  borderBottom: `1px solid ${GRAY3}`,
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 5,
  position: 'sticky',
  top: 0,
  height: topbarHeight,

  [`& .${classes.accountButton}`]: {
    margin: theme.spacing(0, 2),
  },

  [`& .${classes.topbarLeftContainer}`]: {
    height: topbarHeight,
    width: sidebarWidth,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: 'auto',
    },
  },

  [`& .${classes.menuButton}`]: {
    margin: theme.spacing(0, 2),
    width: 40,
    height: 40,
  },

  [`& .${classes.appLogoLink}`]: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'none',
    [theme.breakpoints.down('md')]: {
      marginRight: theme.spacing(2),
    },
  },

  [`& .${classes.appLogoTitle}`]: {
    display: 'inlineBlock',
    color: PRIMARY,
    marginLeft: theme.spacing(0.5),
    lineHeight: '30px',
    fontSize: 25,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
}));

function AppLogoWithTitle() {
  return (
    <a href={process.env.REACT_APP_KNOWZONE_FE_URI} className={classes.appLogoLink}>
      <AppLogo width="30" height="30" />
      <span className={classes.appLogoTitle}>Knowzone</span>
    </a>
  );
}

function Topbar({ openSidebar }) {
  const [anchorMenu, setAnchorMenu] = useState(null);
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorMenu);
  const authDispatch = useAuthDispatch();
  const isMounted = useRef(true);

  const toggleMenu = (event) => setAnchorMenu(event.currentTarget);

  const closeMenu = () => setAnchorMenu(null);

  const onClickAccount = () => {
    closeMenu();
    console.log('account');
  };

  const onClickLogout = useCallback(async () => {
    try {
      setIsLinearProgressModalOpen(true);

      const response = await logout(authDispatch);

      if (response.status === 'success') {
        navigate(`/${FE_ROUTES.LOGIN}`);
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
  }, [navigate, authDispatch]);

  useEffect(() => (function cleanup() {
    isMounted.current = false;
  }), []);

  return (
    <LinearProgressModal isOpen={isLinearProgressModalOpen}>
      <Root>
        <div className={classes.topbarLeftContainer}>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={openSidebar}
            size="large"
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
            size="large"
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
            <MenuItem onClick={onClickAccount}>Account</MenuItem>
            <MenuItem onClick={onClickLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Root>
    </LinearProgressModal>
  );
}

export default Topbar;
