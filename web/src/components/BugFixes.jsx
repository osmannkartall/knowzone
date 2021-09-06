import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Post from './Post';
import { GRAY1, GRAY3 } from '../constants/colors';
import { BE_ROUTES } from '../constants/routes';

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

const BugFixes = () => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;

    fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.BUG_FIXES}`)
      .then((response) => response.json())
      .then((data) => {
        if (mounted) {
          setPosts(data);
        }
      })
      .catch((error) => console.error(error));

    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <div className={classes.root}>
      <h2>Bug Fixes</h2>
      <Grid container spacing={3}>
        {posts && posts.length ? (
          posts.map((p) => (
            <Post
              key={p.id}
              type="bugFix"
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
            />
          ))) : null}
      </Grid>
    </div>
  );
};

export default BugFixes;
