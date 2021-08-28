import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Post from './Post';
import { GRAY1, GRAY3 } from '../constants/colors';
import { BUG_FIXES } from '../constants/api-routes';

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

const SAMPLE_IMAGE_URL = 'https://www.cgi.com/sites/default/files/styles/hero_banner/public/space_astronaut.jpg?itok=k2oFRHrr';

const BugFixes = () => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BUG_FIXES}`)
        .then((response) => response.json())
        .then((data) => setPosts(data))
        .catch((error) => console.error(error));
    }
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
                image: SAMPLE_IMAGE_URL,
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
