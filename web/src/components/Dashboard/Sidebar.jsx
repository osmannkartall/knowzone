import { React, useState, useContext } from 'react';
import {
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { GRAY3, WHITE } from '../../constants/colors';
import { sidebarWidth, topbarHeight } from '../../constants/styles';
import POST_TYPES from '../../constants/post-types';
import { preparePost } from '../../utils';
import { AuthContext } from '../../contexts/AuthContext';
import PostForm from '../../common/PostForm';

const useStyles = makeStyles((theme) => ({
  sidebar: {
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  sidebarContainer: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: topbarHeight,
    height: `calc(100% - ${topbarHeight}px)`,
    width: sidebarWidth,
    backgroundColor: WHITE,
    borderRight: `1px solid ${GRAY3}`,
  },
  createButton: {
    margin: theme.spacing(3, 2),
    padding: theme.spacing(1, 0),
  },
  sidebarBottomContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const sidebarItemsContent = [
  {
    text: POST_TYPES.get('tip').pluralName,
    route: POST_TYPES.get('tip').route,
    icon: POST_TYPES.get('tip').icon,
  },
  {
    text: POST_TYPES.get('bugfix').pluralName,
    route: POST_TYPES.get('bugfix').route,
    icon: POST_TYPES.get('bugfix').icon,
  },
];

const SidebarItem = ({ text, route, icon }) => (
  <ListItem button component={Link} key={text} to={route}>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
);

const SidebarItemList = () => (
  <List>
    {sidebarItemsContent.map((content) => (
      <SidebarItem
        key={content.text}
        text={content.text}
        route={content.route}
        icon={content.icon}
      />
    ))}
  </List>
);

export default function Sidebar({ isSidebarOpen }) {
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
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const classes = useStyles();

  const handleChangeForm = (key, value) => {
    setNewPost((prevState) => ({ ...prevState, [key]: value }));
  };

  const onClickCreate = () => setIsPostFormOpen(true);

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
          setIsPostFormOpen(false);
          setNewPost(emptyPost);
        },
        (error) => {
          console.log(error.message);
        },
      );
  };

  return (
    <div
      className={classes.sidebarContainer}
      style={
        isSidebarOpen
          ? { display: 'flex' }
          : { display: 'none' }
      }
    >
      <div className={classes.sidebar}>
        <SidebarItemList />
      </div>
      <div className={classes.sidebarBottomContainer}>
        <Button
          className={classes.createButton}
          variant="contained"
          color="primary"
          fullWidth
          onClick={onClickCreate}
        >
          Create
        </Button>
      </div>
      <PostForm
        title="Create Post"
        open={isPostFormOpen}
        setOpen={setIsPostFormOpen}
        form={newPost}
        handleChangeForm={handleChangeForm}
        onClickBtn={addPost}
      />
    </div>
  );
}
