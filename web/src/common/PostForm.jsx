import React from 'react';
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
import POST_TYPES from '../constants/post-types';

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

const FormContent = ({ title, btnTitle, handleClose, form, handleChangeForm, onClickBtn }) => {
  const classes = useStyles();

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
                  value={form.type}
                  onChange={(e) => handleChangeForm('type', e.target.value)}
                  variant="outlined"
                  fullWidth
                  disabled={form.id !== null && form.id !== undefined}
                >
                  {Array.from(POST_TYPES).map(([, opt]) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.name}</MenuItem>
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
              {form.type === POST_TYPES.get('bugfix').value ? (
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
              {form.type === POST_TYPES.get('bugfix').value ? (
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
                  files={form.images}
                  setFiles={(images) => handleChangeForm('images', images)}
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

const PostForm = ({ title, btnTitle, open, setOpen, form, handleChangeForm, onClickBtn }) => {
  const classes = useStyles();

  const handleClose = () => setOpen(false);

  const body = (
    <div className={classes.modal}>
      <FormContent
        title={title}
        btnTitle={btnTitle}
        handleClose={handleClose}
        form={form}
        handleChangeForm={handleChangeForm}
        onClickBtn={onClickBtn}
      />
    </div>
  );

  return <Modal open={open} onClose={handleClose} disableRestoreFocus>{body}</Modal>;
};

PostForm.defaultProps = {
  btnTitle: 'share',
};

export default PostForm;
