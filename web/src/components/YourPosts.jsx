import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Post from './Post';
import { GRAY1, GRAY3 } from '../constants/colors';

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

const ownerId = '1234566';

const YourPosts = () => {
  const [posts, setPosts] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/search?owner=${ownerId}`)
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
  }, [posts]);

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
              links={p.links}
              image={image}
              lastModifiedDate={p.updatedAt}
              insertDate={p.createdAt}
              topics={p.topics}
              description={p.description}
              error={p.error}
              solution={p.solution}
            />
          ))) : null}
      </Grid>
    </div>
  );
};

export default YourPosts;
