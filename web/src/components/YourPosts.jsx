import React from 'react';
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

// const type = 'tip';
const type = 'bugFix';

const owner = 'Osman Kartal';

const links = [
  'https://www.1ipsum.com/',
  'https://www.2ipsum.com/',
  'https://www.3ipsum.com/',
  'https://www.4ipsum.com/',
  'https://www.5ipsum.com/',
  'https://www.6ipsum.com/',
  'https://www.7ipsum.com/',
  'https://www.8ipsum.com/',
  'https://www.9ipsum.com/',
  'https://www.11ipsum.com/',
  'https://www.12ipsum.com/',
  'https://www.13ipsum.com/',
  'https://www.14ipsum.com/',
  'https://www.15ipsum.com/',
];

const image = 'https://www.cgi.com/sites/default/files/styles/hero_banner/public/space_astronaut.jpg?itok=k2oFRHrr';

const lastModifiedDate = '23.07.2021 13:55';

// Post must have an insert date initially.
const insertDate = '23.07.2021 04:20';

const topics = [
  'tag1',
  'tagggggggggggggg',
  'tag2',
  'tag3',
  'tag444',
  'tag5',
  '5',
  '12',
  'longggggggggggggggggg taggggggggg',
];

const description = 'Lorem ipsum dolor sit amet, consectetur elit, sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip ex ea commodo consequat.';

const error = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip ex ea commodo consequat.';

const solution = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip ex ea commodo consequat.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip ex ea commodo consequat.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip ex ea commodo consequat.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip ex ea commodo consequat.
`;

const YourPosts = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2>Your Posts</h2>
      <Grid container spacing={3}>
        <Post
          editable
          type={type}
          owner={owner}
          links={links}
          image={image}
          lastModifiedDate={lastModifiedDate}
          insertDate={insertDate}
          topics={topics}
          description={description}
          error={error}
          solution={solution}
        />
        <Post
          editable
          type={type}
          owner={owner}
          links={links}
          lastModifiedDate={lastModifiedDate}
          insertDate={insertDate}
          topics={topics}
          description={description}
          error={error}
          solution={solution}
        />
        <Post
          editable
          type={type}
          owner={owner}
          lastModifiedDate={lastModifiedDate}
          insertDate={insertDate}
          topics={topics}
          description={description}
          error={error}
          solution={solution}
        />
      </Grid>
    </div>
  );
};

export default YourPosts;
