import { React, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
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

const SearchResults = () => {
  const classes = useStyles();
  const location = useLocation();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;

    const route = 'search/filter';
    const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${route}`;

    fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(location.state),
    })
      .then((response) => response.json())
      .then((data) => {
        if (mounted) {
          setPosts(data);
        }
      })
      .catch((error) => console.log(error));

    return function cleanup() {
      mounted = false;
    };
  }, [location.state]);

  return (
    <div className={classes.root}>
      <h2>Search Results</h2>
      <Grid container spacing={3}>
        {posts && posts.length ? (
          posts.map((p) => (
            <Post
              key={p.id}
              showType
              type={p.error || p.solution ? 'bugFix' : 'tip'}
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

export default SearchResults;
