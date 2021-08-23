import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Post from './Post';
import { GRAY1, GRAY3 } from '../constants/colors';
import { AuthContext } from '../contexts/AuthContext';
import PostForm from '../common/PostForm';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    color: GRAY1,
  },
  gridContainer: {
    border: `1px solid ${GRAY3}`,
    borderRadius: 4,
  },
  container: {
    padding: theme.spacing(2),
  },
}));

const image = 'https://www.cgi.com/sites/default/files/styles/hero_banner/public/space_astronaut.jpg?itok=k2oFRHrr';

const YourPosts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const [user] = useContext(AuthContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const updatePost = (id) => {
    const idx = posts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      setSelectedPost({ ...posts[idx] });
      setOpen(true);
    }
  };

  // TODO: Make delete request
  const deletePost = (id) => {
    const idx = posts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      alert(`Delete post with id=${id}?`);
    }
  };

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/search?owner=${user.id}`)
        .then((res) => res.json())
        .then(
          (result) => {
            setPosts(result);
          },
          (error) => {
            console.log(error.message);
          },
        );
    }

    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <div className={classes.root}>
      <h2>Your Posts</h2>
      <Grid container spacing={3}>
        {posts && posts.length ? (
          posts.map((p) => (
            <Post
              key={p.id}
              editable
              type={p.type}
              owner={p.owner}
              content={{
                links: p.links,
                image,
                lastModifiedDate: p.updatedAt,
                insertDate: p.createdAt,
                topics: p.topics,
                description: p.description,
                error: p.error,
                solution: p.solution,
              }}
              updatePost={() => updatePost(p.id)}
              deletePost={() => deletePost(p.id)}
            />
          ))) : null}
      </Grid>
      <PostForm title="Update Post" btnTitle="update" open={open} setOpen={setOpen} oldPost={selectedPost} />
    </div>
  );
};

export default YourPosts;
