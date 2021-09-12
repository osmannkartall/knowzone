import { React, useState } from 'react';
import {
  Grid,
  TextField,
  makeStyles,
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

import {
  MAX_LEN_DESCRIPTION,
  MAX_LEN_ERROR,
  MAX_LEN_SOLUTION,
  MAX_NUM_LINKS,
  TOPIC_CONSTRAINTS,
} from '../constants/validation';

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
}));

const FormContent = ({ title, btnTitle, handleClose, form, handleChangeForm, onClickBtn }) => {
  const classes = useStyles();
  const [topicsCheck, setTopicsCheck] = useState({ text: '', isInvalid: false, isUnique: true });
  const [descriptionCheck, setDescriptionCheck] = useState({ text: '', isInvalid: false });
  const [errorCheck, setErrorCheck] = useState({ text: '', isInvalid: false });
  const [solutionCheck, setSolutionCheck] = useState({ text: '', isInvalid: false });
  const [linkCheck, setLinkCheck] = useState({ text: '', isInvalid: false });

  const validateDescription = () => {
    let isValid = false;

    if (form.description.length > MAX_LEN_DESCRIPTION) {
      setDescriptionCheck({ text: `Description cannot exceed ${MAX_LEN_DESCRIPTION} characters.`, isInvalid: true });
    } else if (form.description.length === 0) {
      setDescriptionCheck({ text: 'Please fill in the description section.', isInvalid: true });
    } else {
      setDescriptionCheck({ text: '', isInvalid: false });
      isValid = true;
    }
    return isValid;
  };

  const validateError = () => {
    let isValid = false;

    if (form.error.length > MAX_LEN_ERROR) {
      setErrorCheck({ text: `Error cannot exceed ${MAX_LEN_ERROR} characters.`, isInvalid: true });
    } else if (form.error.length === 0) {
      setErrorCheck({ text: 'Please fill in the error section.', isInvalid: true });
    } else {
      setErrorCheck({ text: '', isInvalid: false });
      isValid = true;
    }
    return isValid;
  };

  const validateSolution = () => {
    let isValid = false;

    if (form.solution.length > MAX_LEN_SOLUTION) {
      setSolutionCheck({ text: `Solution cannot exceed ${MAX_LEN_SOLUTION} characters.`, isInvalid: true });
    } else if (form.solution.length === 0) {
      setSolutionCheck({ text: 'Please fill in the solution section.', isInvalid: true });
    } else {
      setSolutionCheck({ text: '', isInvalid: false });
      isValid = true;
    }
    return isValid;
  };

  const validateLinks = () => {
    let isValid = false;

    if (form.links.length > MAX_NUM_LINKS) {
      setLinkCheck({ text: `Number of links cannot exceed ${MAX_NUM_LINKS}.`, isInvalid: true });
    } else {
      setLinkCheck({ text: '', isInvalid: false });
      isValid = true;
    }
    return isValid;
  };

  const validateTopics = () => {
    let isValid = false;

    if (form.topics.length < TOPIC_CONSTRAINTS.min) {
      setTopicsCheck({ text: `At least ${TOPIC_CONSTRAINTS.min} topic should be defined.`, isInvalid: true });
    } else if (form.topics.length > TOPIC_CONSTRAINTS.max) {
      setTopicsCheck({ text: `Number of topics cannot exceed ${TOPIC_CONSTRAINTS.max}.`, isInvalid: true });
    } else if (form.topics.length > 0) {
      const matchedTopics = form.topics.map((tag) => tag.match(TOPIC_CONSTRAINTS.pattern));
      if (matchedTopics.includes(null)) {
        setTopicsCheck({ text: 'Invalid topics.', isInvalid: true });
      } else {
        setTopicsCheck({ text: '', isInvalid: false });
        isValid = true;
      }
    } else {
      setTopicsCheck({ text: '', isInvalid: false });
      isValid = true;
    }
    return isValid && topicsCheck.isUnique;
  };

  const validateForm = () => {
    const isValidDescription = validateDescription();
    const isValidLinks = validateLinks();
    const isValidTopics = validateTopics();
    let isValid = isValidDescription && isValidLinks && isValidTopics;

    if (form.type === POST_TYPES.get('bugfix').value) {
      const isValidError = validateError();
      const isValidSolution = validateSolution();
      isValid = isValid && isValidError && isValidSolution;
    }

    console.log(`isValidDescription: ${isValidDescription}`);
    console.log(`isValidLinks: ${isValidLinks}`);
    console.log(`isValidTopics: ${isValidTopics}`);
    console.log(`topicsCheck.isInvalid: ${topicsCheck.isInvalid}`);
    console.log(`topicsCheck.isUnique: ${topicsCheck.isUnique}`);
    console.log('----------------------------------------------------\n');

    if (isValid) {
      onClickBtn();
    }
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
                  error={descriptionCheck.isInvalid}
                  helperText={descriptionCheck.text}
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
                    error={errorCheck.isInvalid}
                    helperText={errorCheck.text}
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
                    error={solutionCheck.isInvalid}
                    helperText={solutionCheck.text}
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
                <TagPicker
                  tags={form.topics}
                  setTags={(topics) => handleChangeForm('topics', topics)}
                  required
                  border
                  unique
                  onUniqueError={(unique) => setTopicsCheck(
                    { ...topicsCheck, isUnique: unique },
                  )}
                  error={topicsCheck.isInvalid}
                  helperText={topicsCheck.text}
                />
              </Grid>
              <Grid item xs={12}>
                <TagPicker
                  tags={form.links}
                  setTags={(links) => handleChangeForm('links', links)}
                  placeholder="Enter links"
                  border
                  error={linkCheck.isInvalid}
                  helperText={linkCheck.text}
                />
              </Grid>
            </>
          </Grid>
          <Grid container item xs={12} className={classes.bottom} spacing={3}>
            <>
              <Grid item xs={12}>
                <div className={classes.bottomBar}>
                  <Button variant="contained" color="primary" onClick={validateForm}>
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
