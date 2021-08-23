import React, { useState, useContext } from 'react';
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
import FileUploader from './FileUploader';
import { AuthContext } from '../contexts/AuthContext';

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
  BUG_FIX: 'bugFix',
  TIP: 'tip',
});

const FormContent = ({ title, btnTitle, handleClose, content, oldPostId }) => {
  const classes = useStyles();
  const [form, setForm] = useState(content);
  const [user] = useContext(AuthContext);

  const handleChangeForm = (key, value) => setForm((prevState) => ({ ...prevState, [key]: value }));

  const onClickBtn = () => {
    let route = 'tips';
    const newPost = {
      description: form.description,
      // files: form.files,
      topics: form.topics,
      links: form.links,
      owner: { id: user.id, username: user.username, name: user.name },
    };

    if (form.postType === POST_TYPES.BUG_FIX) {
      newPost.error = form.error;
      newPost.solution = form.solution;
      route = 'bugFixes';
    }

    // TODO: Make update or create request
    if (oldPostId) {
      console.log('update post', newPost, route, oldPostId);
    } else {
      console.log('create post', newPost, route);
    }

    alert(JSON.stringify(newPost));
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
                  value={form.postType}
                  onChange={(e) => handleChangeForm('postType', e.target.value)}
                  variant="outlined"
                  fullWidth
                  disabled={oldPostId !== null}
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
                  value={form.description}
                  onChange={(e) => handleChangeForm('description', e.target.value)}
                />
              </Grid>
              {form.postType === POST_TYPES.BUG_FIX ? (
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
                    value={form.error}
                    onChange={(e) => handleChangeForm('error', e.target.value)}
                  />
                </Grid>
              ) : null}
              {form.postType === POST_TYPES.BUG_FIX ? (
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
                    value={form.solution}
                    onChange={(e) => handleChangeForm('solution', e.target.value)}
                  />
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <FileUploader
                  files={form.files}
                  setFiles={(files) => handleChangeForm('files', files)}
                />
              </Grid>
              <Grid item xs={12}>
                <Box border={1} borderColor="grey.400" borderRadius={5} className={classes.topics}>
                  <TagPicker
                    tags={form.topics}
                    setTags={(topics) => handleChangeForm('topics', topics)}
                    required
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box border={1} borderColor="grey.400" borderRadius={5} className={classes.topics}>
                  <TagPicker
                    tags={form.links}
                    setTags={(links) => handleChangeForm('links', links)}
                    placeholder="Enter links"
                  />
                </Box>
              </Grid>
            </>
          </Grid>
          <Grid container item xs={12} className={classes.bottom} spacing={3}>
            <>
              <Grid item xs={12}>
                <div className={classes.bottomBar}>
                  <Button variant="contained" color="primary" onClick={onClickBtn}>
                    {btnTitle}
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

const getOldPostId = (oldPost) => (oldPost && oldPost.id ? oldPost.id : null);

const prepareContent = (oldPost) => {
  const content = {
    postType: POST_TYPES.BUG_FIX,
    description: '',
    error: '',
    solution: '',
    topics: [],
    links: [],
    files: [],
  };

  if (oldPost) {
    if (oldPost.type) content.postType = oldPost.type;
    if (oldPost.description) content.description = oldPost.description;
    if (oldPost.error) content.error = oldPost.error;
    if (oldPost.solution) content.solution = oldPost.solution;
    if (Array.isArray(oldPost.topics) && oldPost.topics.length) content.topics = oldPost.topics;
    if (Array.isArray(oldPost.links) && oldPost.links.length) content.links = oldPost.links;
    if (Array.isArray(oldPost.files) && oldPost.files.length) content.files = oldPost.files;
  }

  return content;
};

const PostForm = ({ title, btnTitle, open, setOpen, oldPost }) => {
  const classes = useStyles();

  const handleClose = () => setOpen(false);

  const body = (
    <div className={classes.modal}>
      <FormContent
        title={title}
        btnTitle={btnTitle}
        handleClose={handleClose}
        content={prepareContent(oldPost)}
        oldPostId={getOldPostId(oldPost)}
      />
    </div>
  );

  return <Modal open={open} onClose={handleClose} disableRestoreFocus>{body}</Modal>;
};

PostForm.defaultProps = {
  btnTitle: 'share',
};

export default PostForm;
