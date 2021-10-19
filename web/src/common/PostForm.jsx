import { useState } from 'react';
import {
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
  DESCRIPTION_CONSTRAINTS,
  ERROR_CONSTRAINTS,
  SOLUTION_CONSTRAINTS,
  LINKS_CONSTRAINTS,
  TOPICS_CONSTRAINTS,
  validate,
} from '../clientSideValidation';
import { useMemoAndDebounce } from '../utils';

const useStyles = makeStyles((theme) => ({
  modalData: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: `calc(90% - ${theme.spacing(20)}px)`,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
  },
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: WHITE,
    padding: theme.spacing(0, 2),
    borderTopLeftRadius: theme.spacing(1),
    borderTopRightRadius: theme.spacing(1),
    backgroundColor: PRIMARY,
  },
  middleContainer: {
    overflowY: 'auto',
    borderTop: 0,
    border: `1px solid ${GRAY3}`,
    backgroundColor: WHITE,
    padding: theme.spacing(1, 0),
  },
  formDataRow: {
    margin: theme.spacing(3, 2),
  },
  fileUploaderContainer: {
    margin: theme.spacing(0, 2),
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(2),
    borderBottomLeftRadius: theme.spacing(1),
    borderBottomRightRadius: theme.spacing(1),
    border: `1px solid ${GRAY3}`,
    borderTop: 0,
    backgroundColor: WHITE,
  },
}));

const FormDataRow = ({ children }) => (
  <div className={useStyles().formDataRow}>
    {children}
  </div>
);

const FormData = ({ title, btnTitle, handleClose, form, changeHandler, onClickBtn }) => {
  const classes = useStyles();
  const [topicsCheck, setTopicsCheck] = useState({ text: '', isInvalid: false, isUnique: true });
  const [descriptionCheck, setDescriptionCheck] = useState({ text: '', isInvalid: false });
  const [errorCheck, setErrorCheck] = useState({ text: '', isInvalid: false });
  const [solutionCheck, setSolutionCheck] = useState({ text: '', isInvalid: false });
  const [linksCheck, setLinksCheck] = useState({ text: '', isInvalid: false });
  const memoizedAndDebouncedChangeHandler = useMemoAndDebounce(changeHandler);

  const validateForm = () => {
    const isValidDescription = validate(
      form.description, descriptionCheck, setDescriptionCheck, DESCRIPTION_CONSTRAINTS,
    );
    const isValidLinks = validate(form.links, linksCheck, setLinksCheck, LINKS_CONSTRAINTS);
    const isValidTopics = validate(form.topics, topicsCheck, setTopicsCheck, TOPICS_CONSTRAINTS);
    let isValid = isValidDescription && isValidLinks && isValidTopics && topicsCheck.isUnique;

    if (form.type === POST_TYPES.get('bugfix').value) {
      const isValidError = validate(form.error, errorCheck, setErrorCheck, ERROR_CONSTRAINTS);
      const isValidSolution = validate(
        form.solution, solutionCheck, setSolutionCheck, SOLUTION_CONSTRAINTS,
      );
      isValid = isValid && isValidError && isValidSolution;
    }

    if (isValid) {
      onClickBtn();
    }
  };

  return (
    <>
      <div className={classes.topContainer}>
        <h1>{title}</h1>
        <IconButton
          aria-label="close post form"
          style={{ color: WHITE }}
          onClick={handleClose}
        >
          <Close style={{ color: WHITE, width: 35, height: 35 }} />
        </IconButton>
      </div>
      <div className={classes.middleContainer}>
        <FormDataRow>
          <TextField
            id="outlined-select-post-type"
            select
            label="Post Type"
            value={form.type}
            onChange={(e) => changeHandler('type', e.target.value)}
            variant="outlined"
            fullWidth
            disabled={form.id !== null && form.id !== undefined}
          >
            {Array.from(POST_TYPES).map(([, opt]) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.name}</MenuItem>
            ))}
          </TextField>
        </FormDataRow>
        <FormDataRow>
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
            error={descriptionCheck.isInvalid}
            helperText={descriptionCheck.text}
            defaultValue={form.description}
            onChange={(e) => memoizedAndDebouncedChangeHandler('description', e.target.value)}
          />
        </FormDataRow>
        <FormDataRow>
          {form.type === POST_TYPES.get('bugfix').value ? (
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
              error={errorCheck.isInvalid}
              helperText={errorCheck.text}
              defaultValue={form.error}
              onChange={(e) => memoizedAndDebouncedChangeHandler('error', e.target.value)}
            />
          ) : null}
        </FormDataRow>
        <FormDataRow>
          {form.type === POST_TYPES.get('bugfix').value ? (
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
              error={solutionCheck.isInvalid}
              helperText={solutionCheck.text}
              defaultValue={form.solution}
              onChange={(e) => memoizedAndDebouncedChangeHandler('solution', e.target.value)}
            />
          ) : null}
        </FormDataRow>
        <div className={classes.fileUploaderContainer}>
          <FileUploader
            files={form.images}
            setFiles={(images) => changeHandler('images', images)}
          />
        </div>
        <FormDataRow>
          <TagPicker
            tags={form.topics}
            setTags={(topics) => changeHandler('topics', topics)}
            required
            unique
            border
            onNotUniqueError={(unique) => setTopicsCheck(
              { ...topicsCheck, isUnique: unique },
            )}
            showError={topicsCheck.isInvalid}
            helperText={topicsCheck.text}
          />
        </FormDataRow>
        <FormDataRow>
          <TagPicker
            tags={form.links}
            setTags={(links) => changeHandler('links', links)}
            placeholder="Enter links"
            border
            showError={linksCheck.isInvalid}
            helperText={linksCheck.text}
          />
        </FormDataRow>
      </div>
      <div className={classes.bottomContainer}>
        <Button variant="contained" color="primary" onClick={validateForm}>
          {btnTitle}
        </Button>
      </div>
    </>
  );
};

const PostForm = ({ title, btnTitle, open, setOpen, form, changeHandler, onClickBtn }) => {
  const classes = useStyles();

  const handleClose = () => setOpen(false);

  const ModalData = (
    <div className={classes.modalData}>
      <FormData
        title={title}
        btnTitle={btnTitle}
        handleClose={handleClose}
        form={form}
        changeHandler={changeHandler}
        onClickBtn={onClickBtn}
      />
    </div>
  );

  return <Modal open={open} onClose={handleClose} disableRestoreFocus>{ModalData}</Modal>;
};

PostForm.defaultProps = {
  btnTitle: 'share',
};

export default PostForm;
