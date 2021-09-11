import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import { GRAY3 } from '../../constants/colors';
import PostForm from '../../common/PostForm';
import POST_TYPES from '../../constants/post-types';
import { preparePost } from '../../utils';
import { AuthContext } from '../../contexts/AuthContext';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    borderRightColor: GRAY3,
  },
  drawerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  drawerItemsContainer: {
    overflow: 'auto',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerBtn: {
    margin: theme.spacing(4, 2),
    padding: theme.spacing(1, 0),
  },
}));

const drawerItemNames = [
  {
    text: POST_TYPES.get('tip').pluralName,
    route: POST_TYPES.get('tip').route,
    icon: POST_TYPES.get('tip').icon,
  },
  {
    text: POST_TYPES.get('bugFix').pluralName,
    route: POST_TYPES.get('bugFix').route,
    icon: POST_TYPES.get('bugFix').icon,
  },
];

const DrawerItem = ({ text, route, icon }) => (
  <ListItem button component={Link} key={text} to={route}>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
);

const Sidebar = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [user] = useContext(AuthContext);
  const emptyPost = {
    description: '',
    links: [],
    topics: [],
    images: [],
    owner: { id: user.id, username: user.username, name: user.name },
    error: '',
    solution: '',
    type: POST_TYPES.get('tip').value,
  };
  const [newPost, setNewPost] = useState(emptyPost);

  const handleChangeForm = (key, value) => {
    setNewPost((prevState) => ({ ...prevState, [key]: value }));
  };

  const onClickCreate = () => setOpen(true);

  const addPost = () => {
    const { post, route } = preparePost(newPost);
    const fd = new FormData();

    Object.entries(post).forEach(([k, v]) => {
      if (k === 'images') {
        v.forEach((image) => {
          if (image.preview) {
            // Revoke the data uri to avoid memory leaks
            URL.revokeObjectURL(image.preview);
          }
          fd.append('image', image);
        });
      } else {
        fd.append(k, JSON.stringify(v));
      }
    });

    fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${route}`, {
      method: 'POST',
      body: fd,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result.message);
          setOpen(false);
          setNewPost(emptyPost);
        },
        (error) => {
          console.log(error.message);
        },
      );
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <div className={classes.toolbar} />
      <div className={classes.drawerContainer}>
        <div className={classes.drawerItemsContainer}>
          <List>
            {drawerItemNames.map((item) => (
              <DrawerItem key={item.text} text={item.text} route={item.route} icon={item.icon} />
            ))}
          </List>
        </div>
        <Button
          className={classes.drawerBtn}
          variant="contained"
          color="primary"
          onClick={onClickCreate}
        >
          Create
        </Button>
        <PostForm
          title="Create Post"
          open={open}
          setOpen={setOpen}
          form={newPost}
          handleChangeForm={handleChangeForm}
          onClickBtn={addPost}
        />
      </div>
    </Drawer>
  );
};

export default Sidebar;
