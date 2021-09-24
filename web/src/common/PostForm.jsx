import { React, useState } from 'react';
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

const FormData = ({ title, btnTitle, handleClose, form, handleChangeForm, onClickBtn }) => {
  const classes = useStyles();
  const [topicsError, setTopicsError] = useState(false);

  console.log(`Topics Error: ${topicsError}`);

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
            value={form.description}
            onChange={(e) => handleChangeForm('description', e.target.value)}
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
              value={form.error}
              onChange={(e) => handleChangeForm('error', e.target.value)}
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
              value={form.solution}
              onChange={(e) => handleChangeForm('solution', e.target.value)}
            />
          ) : null}
        </FormDataRow>
        <div className={classes.fileUploaderContainer}>
          <FileUploader
            files={form.images}
            setFiles={(images) => handleChangeForm('images', images)}
          />
        </div>
        <FormDataRow>
          <TagPicker
            tags={form.topics}
            setTags={(topics) => handleChangeForm('topics', topics)}
            required
            unique
            onUniqueError={(invalid) => setTopicsError(invalid)}
          />
        </FormDataRow>
        <FormDataRow>
          <TagPicker
            tags={form.links}
            setTags={(links) => handleChangeForm('links', links)}
            placeholder="Enter links"
          />
        </FormDataRow>
      </div>
      <div className={classes.bottomContainer}>
        <Button variant="contained" color="primary" onClick={onClickBtn}>
          {btnTitle}
        </Button>
      </div>
    </>
  );
};

const PostForm = ({ title, btnTitle, open, setOpen, form, handleChangeForm, onClickBtn }) => {
  const classes = useStyles();

  const handleClose = () => setOpen(false);

  const ModalData = (
    <div className={classes.modalData}>
      <FormData
        title={title}
        btnTitle={btnTitle}
        handleClose={handleClose}
        form={form}
        handleChangeForm={handleChangeForm}
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
