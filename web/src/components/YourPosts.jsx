import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Post from './Post';
import { GRAY1, GRAY3 } from '../constants/colors';
import { AuthContext } from '../contexts/AuthContext';
import PostForm from '../common/PostForm';
import POST_TYPES from '../constants/post-types';
import { preparePost, createFile } from '../utils';

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

const YourPosts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const [open, setOpen] = useState(false);
  const [user] = useContext(AuthContext);
  const classes = useStyles();

  const handleChangeForm = (key, value) => {
    setSelectedPost((prevState) => ({ ...prevState, [key]: value }));
  };

  const setForUpdate = (id) => {
    const idx = posts.findIndex((p) => p.id === id);

    if (idx !== -1) {
      setSelectedPost({ ...posts[idx] });
      setOpen(true);
    }
  };

  const updatePost = () => {
    const { post, route } = preparePost(selectedPost);
    const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${route}/${selectedPost.id}`;
    const fd = new FormData();

    Object.entries(post).forEach(([k, v]) => {
      if (k === 'images') {
        v.forEach((image) => {
          let imageObject = image;
          if (!(image instanceof File)) {
            imageObject = createFile(image);
          }
          fd.append('image', imageObject);
        });
      } else {
        fd.append(k, JSON.stringify(v));
      }
    });

    fetch(url, {
      method: 'PUT',
      body: fd,
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setOpen(false);

          // Storing selectedPostId as state might avoid findIndex operation.
          const idx = posts.findIndex((p) => p.id === selectedPost.id);
          if (idx !== -1) {
            const newPosts = [...posts];
            newPosts[idx] = { ...result, type: selectedPost.type };
            setPosts(newPosts);
          }
        },
        (error) => {
          console.log(error.message);
        },
      );
  };

  const deletePost = (id, route) => {
    const idx = posts.findIndex((p) => p.id === id);

    if (idx !== -1) {
      const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${route}/${id}`;

      fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log(result.message);
            const newPosts = [...posts];
            newPosts.splice(idx, 1);
            setPosts(newPosts);
          },
          (error) => {
            console.log(error.message);
          },
        );
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
                images: p.images,
                lastModifiedDate: p.updatedAt,
                insertDate: p.createdAt,
                topics: p.topics,
                description: p.description,
                error: p.error,
                solution: p.solution,
              }}
              onClickUpdate={() => setForUpdate(p.id)}
              onClickDelete={
                () => deletePost(p.id, p.type === POST_TYPES.TIP.value ? 'tips' : 'bugFixes')
              }
            />
          ))) : null}
      </Grid>
      <PostForm
        title="Update Post"
        btnTitle="update"
        open={open}
        setOpen={setOpen}
        form={selectedPost}
        handleChangeForm={handleChangeForm}
        onClickBtn={updatePost}
      />
    </div>
  );
};

export default YourPosts;
