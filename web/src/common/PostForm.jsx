import React, { useState } from 'react';
import {
  Grid,
  TextField,
  makeStyles,
  Box,
  IconButton,
  MenuItem,
  Button,
  Modal,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { WHITE, GRAY3, PRIMARY } from '../constants/colors';
import TagPicker from './TagPicker/TagPicker';

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: `calc(90% - ${theme.spacing(20)}px)`,
    maxHeight: '100%',
  },
  root: {
    flexGrow: 1,
  },
  top: {
    borderTopLeftRadius: theme.spacing(1),
    borderTopRightRadius: theme.spacing(1),
    backgroundColor: PRIMARY,
    margin: theme.spacing(0),
  },
  middle: {
    borderTop: 0,
    border: `1px solid ${GRAY3}`,
    backgroundColor: WHITE,
    margin: theme.spacing(0),
    maxHeight: '70vh',
    overflowY: 'auto',
  },
  bottom: {
    borderBottomLeftRadius: theme.spacing(1),
    borderBottomRightRadius: theme.spacing(1),
    border: `1px solid ${GRAY3}`,
    borderTop: 0,
    backgroundColor: WHITE,
    margin: theme.spacing(0),
  },
  topbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: WHITE,
    padding: theme.spacing(0, 2),
  },
  bottomBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    color: WHITE,
  },
  topics: {
    padding: theme.spacing(1),
  },
}));

const POST_TYPES = Object.freeze({
  BUG_FIX: 'Bug Fix',
  TIP: 'Tip',
});

const FormContent = ({ title, handleClose }) => {
  const classes = useStyles();
  const [postType, setPostType] = useState(POST_TYPES.BUG_FIX);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [solution, setSolution] = useState('');
  const [topics, setTopics] = useState([]);
  const [links, setLinks] = useState([]);

  const handleChangePostType = (event) => setPostType(event.target.value);

  const onClickShare = () => {
    const form = {
      postType,
      description,
      topics,
      links,
    };

    if (postType === POST_TYPES.BUG_FIX) {
      form.error = error;
      form.solution = solution;
    }
    alert(JSON.stringify(form));
  };

  return (
    <div>
      <div className={classes.root}>
        <Grid container spacing={0}>
          <Grid container item xs={12} className={classes.top} spacing={0}>
            <>
              <Grid item xs={12}>
                <div className={classes.topbar}>
                  <h1>{title}</h1>
                  <IconButton
                    aria-label="close post form"
                    style={{ color: WHITE }}
                    onClick={handleClose}
                  >
                    <Close style={{ color: WHITE, width: 35, height: 35 }} />
                  </IconButton>
                </div>
              </Grid>
            </>
          </Grid>
          <Grid container item xs={12} className={classes.middle} spacing={3}>
            <>
              <Grid item xs={12}>
                <TextField
                  id="outlined-select-post-type"
                  select
                  label="Post Type"
                  required
                  value={postType}
                  onChange={handleChangePostType}
                  variant="outlined"
                  fullWidth
                >
                  {Object.values(POST_TYPES).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  minRows={4}
                  maxRows={4}
                  id="description"
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              {postType === POST_TYPES.BUG_FIX ? (
                <Grid item xs={12}>
                  <TextField
                    name="error"
                    variant="outlined"
                    required
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={10}
                    id="error"
                    label="Error"
                    value={error}
                    onChange={(e) => setError(e.target.value)}
                  />
                </Grid>
              ) : null}
              {postType === POST_TYPES.BUG_FIX ? (
                <Grid item xs={12}>
                  <TextField
                    name="solution"
                    variant="outlined"
                    required
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={10}
                    id="solution"
                    label="Solution"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                  />
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <Box border={1} borderColor="grey.400" borderRadius={5} className={classes.topics}>
                  <TagPicker tags={topics} setTags={setTopics} required />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box border={1} borderColor="grey.400" borderRadius={5} className={classes.topics}>
                  <TagPicker tags={links} setTags={setLinks} placeholder="Enter links" />
                </Box>
              </Grid>
            </>
          </Grid>
          <Grid container item xs={12} className={classes.bottom} spacing={3}>
            <>
              <Grid item xs={12}>
                <div className={classes.bottomBar}>
                  <Button variant="contained" color="primary" onClick={onClickShare}>
                    Share
                  </Button>
                </div>
              </Grid>
            </>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

const PostForm = ({ title, open, setOpen }) => {
  const classes = useStyles();

  const handleClose = () => setOpen(false);

  const body = (
    <div className={classes.modal}>
      <FormContent title={title} handleClose={handleClose} />
    </div>
  );

  return <Modal open={open} onClose={handleClose}>{body}</Modal>;
};

export default PostForm;
