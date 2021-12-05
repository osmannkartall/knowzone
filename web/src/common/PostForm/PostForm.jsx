import { useState } from 'react';
import {
  TextField,
  makeStyles,
  IconButton,
  MenuItem,
  Button,
  Modal,
  InputLabel,
  FormHelperText,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { Controller, useFormContext } from 'react-hook-form';
import { WHITE, GRAY3, PRIMARY, GRAY1 } from '../../constants/colors';
import TagPicker from '../TagPicker/TagPicker';
import FileUploader from '../FileUploader';
import POST_TYPES from '../../constants/post-types';
import MarkdownEditor from '../MarkdownEditor';

const useStyles = makeStyles((theme) => ({
  modalData: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: `calc(100% - ${theme.spacing(10)}px)`,
  },
  form: {
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
  label: {
    margin: theme.spacing(1, 0),
    color: GRAY1,
  },
}));

const FormDataRow = ({ children }) => (
  <div className={useStyles().formDataRow}>
    {children}
  </div>
);

const FormData = ({ title, btnTitle, handleClose, onSubmit }) => {
  const classes = useStyles();
  const [areTopicsUnique, setAreTopicsUnique] = useState(true);

  const {
    handleSubmit,
    control,
    watch, formState: { errors },
    getValues,
  } = useFormContext();

  const watchPostType = watch('type');

  const getErrorMessageOfArrayForm = (arr) => {
    if (arr) {
      if (arr.message) {
        return arr.message;
      }

      for (let i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i].message) {
          return arr[i].message;
        }
      }
    }

    return null;
  };

  return (
    <form
      className={classes.form}
      onSubmit={handleSubmit((data) => areTopicsUnique && onSubmit(data))}
      noValidate
    >
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
          <Controller
            render={
              ({ field: { onChange, onBlur, value, name } }) => (
                <TextField
                  id="outlined-select-post-type"
                  select
                  label="Post Type"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  name={name}
                  error={errors.type !== undefined}
                  helperText={errors.type?.message}
                  variant="outlined"
                  fullWidth
                  disabled={getValues('id') !== null && getValues('id') !== undefined}
                >
                  {Array.from(POST_TYPES).map(([, opt]) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.name}</MenuItem>
                  ))}
                </TextField>
              )
            }
            control={control}
            name="type"
            shouldUnregister
          />
        </FormDataRow>
        <FormDataRow>
          <Controller
            render={
              ({ field: { onChange, onBlur, value, name } }) => (
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  minRows={4}
                  maxRows={4}
                  id="description"
                  label="Description"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  name={name}
                  error={errors.description !== undefined}
                  helperText={errors.description?.message}
                />
              )
            }
            control={control}
            name="description"
            shouldUnregister
          />
        </FormDataRow>
        {watchPostType === POST_TYPES.get('bugfix').value ? (
          <>
            <FormDataRow>
              <InputLabel
                required
                className={classes.label}
              >
                Error
              </InputLabel>
              <Controller
                render={
                  ({ field: { onChange, value } }) => (
                    <MarkdownEditor
                      text={value}
                      onChangeText={onChange}
                      containerMaxHeight="50vh"
                    />
                  )
                }
                control={control}
                name="error"
                shouldUnregister
              />
              <FormHelperText error={errors.error !== undefined}>
                {errors.error?.message}
              </FormHelperText>
            </FormDataRow>
            <FormDataRow>
              <InputLabel
                required
                className={classes.label}
              >
                Solution
              </InputLabel>
              <Controller
                render={
                  ({ field: { onChange, value } }) => (
                    <MarkdownEditor
                      text={value}
                      onChangeText={onChange}
                      containerMaxHeight="50vh"
                    />
                  )
                }
                control={control}
                name="solution"
                shouldUnregister
              />
              <FormHelperText error={errors.solution !== undefined}>
                {errors.solution?.message}
              </FormHelperText>
            </FormDataRow>
          </>
        ) : null}
        <div className={classes.fileUploaderContainer}>
          <Controller
            render={
              ({ field: { onChange, value } }) => (
                <FileUploader files={value} setFiles={onChange} />
              )
            }
            control={control}
            name="images"
            shouldUnregister
          />
        </div>
        <Controller
          render={
            ({ field: { onChange, value } }) => (
              <FormDataRow>
                <TagPicker
                  tags={value}
                  setTags={onChange}
                  placeholder="Type a topic and press enter to add"
                  required
                  unique
                  border
                  showError={errors.topics !== undefined}
                  onNotUniqueError={(isUnique) => setAreTopicsUnique(isUnique)}
                  helperText={getErrorMessageOfArrayForm(errors.topics)}
                />
              </FormDataRow>
            )
          }
          control={control}
          name="topics"
          shouldUnregister
        />
        <FormDataRow>
          <Controller
            render={
              ({ field: { onChange, value } }) => (
                <TagPicker
                  tags={value}
                  setTags={onChange}
                  placeholder="Type a link and press enter to add"
                  unique
                  border
                  showError={errors.links !== undefined}
                  helperText={errors.links?.message}
                />
              )
            }
            control={control}
            name="links"
            shouldUnregister
          />
        </FormDataRow>
      </div>
      <div className={classes.bottomContainer}>
        <Button variant="contained" color="primary" type="submit">
          {btnTitle}
        </Button>
      </div>
    </form>
  );
};

const PostForm = ({ title, btnTitle, open, setOpen, onSubmit }) => {
  const classes = useStyles();

  const handleClose = () => setOpen(false);

  const ModalData = (
    <div className={classes.modalData}>
      <FormData
        title={title}
        btnTitle={btnTitle}
        handleClose={handleClose}
        onSubmit={onSubmit}
      />
    </div>
  );

  return <Modal open={open} onClose={handleClose} disableRestoreFocus>{ModalData}</Modal>;
};

PostForm.defaultProps = {
  btnTitle: 'share',
};

export default PostForm;
