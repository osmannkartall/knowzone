import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { GRAY1, GRAY3, PRIMARY, WHITE } from '../../constants/colors';
import SearchBar from '../SearchBar';

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    marginRight: theme.spacing(18),
    color: PRIMARY,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: WHITE,
    color: GRAY1,
    borderBottom: `1px solid ${GRAY3}`,
  },
  accountBtn: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}));

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState('');
  const history = useHistory();
  const classes = useStyles();

  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const onClickYourPosts = () => {
    handleClose();
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

  const handleChangeSearchText = (event) => setSearchText(event.target.value);

  return (
    <AppBar elevation={0} position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography className={classes.title} variant="h6">
          Knowzone
        </Typography>
        <SearchBar value={searchText} handleChange={handleChangeSearchText} />
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
