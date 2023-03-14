import { useEffect, useState } from 'react';
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
import TagPicker from '../common/TagPicker/TagPicker';
import FileUploader from '../common/FileUploader';
import MarkdownEditor from '../common/MarkdownEditor';
import FORM_COMPONENT_TYPES from '../../constants/form-components-types';
import getFormByType from '../../api/getFormByType';

const isNewPost = (id) => id === null || id === undefined;

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

const FormDataRow = ({ children }) => (
  <div className={useStyles().formDataRow}>
    {children}
  </div>
);

const TypeFormPart = ({ formTypes }) => {
  const { control, formState: { errors }, getValues } = useFormContext();

  return (
    isNewPost(getValues('id')) && (
    <FormDataRow>
      <Controller
        render={
          ({ field: { onChange, onBlur, value, name } }) => (
            <TextField
              id="outlined-select-post-type"
              data-testid="outlined-select-post-type"
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
            >
              <MenuItem disabled key="none" value="">
                <em>Select</em>
              </MenuItem>
              {(formTypes ?? []).map((form) => (
                <MenuItem key={form.id} value={form.type}>{form.type}</MenuItem>
              ))}
            </TextField>
          )
        }
        control={control}
        name="type"
        shouldUnregister
      />
    </FormDataRow>
    )
  );
};

const TextFormPart = ({ field }) => {
  const { control, formState: { errors } } = useFormContext();

  return field && (
    <FormDataRow>
      <Controller
        render={
          ({ field: { onChange, onBlur, value, name } }) => (
            <TextField
              variant="outlined"
              title={field}
              fullWidth
              multiline
              minRows={4}
              maxRows={4}
              id={field}
              label={field}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              name={name}
              error={errors[field] !== undefined}
              helperText={errors[field]?.message}
            />
          )
        }
        control={control}
        name={field}
        shouldUnregister
      />
    </FormDataRow>
  );
};

const ListFormPart = ({ field }) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <FormDataRow>
      <Controller
        render={
          ({ field: { onChange, value } }) => (
            <div title={field}>
              <TagPicker
                id={field}
                tags={Array.isArray(value) ? value : []}
                setTags={onChange}
                placeholder="Type an item and press enter to add"
                unique
                border
                showError={errors[field] !== undefined}
                helperText={errors[field]?.message}
              />
            </div>
          )
        }
        control={control}
        name={field}
        shouldUnregister
      />
    </FormDataRow>
  );
};

const EditorFormPart = ({ field }) => {
  const classes = useStyles();

  const { control, formState: { errors } } = useFormContext();

  return (
    <FormDataRow>
      <InputLabel
        className={classes.label}
      >
        {field}
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
        name={field}
        shouldUnregister
      />
      <FormHelperText error={errors[field] !== undefined}>
        {errors[field]?.message}
      </FormHelperText>
    </FormDataRow>
  );
};

const ImageFormPart = ({ field }) => {
  const classes = useStyles();

  const { control } = useFormContext();

  return (
    <div className={classes.fileUploaderContainer} title={field}>
      <Controller
        render={
          ({ field: { onChange, value } }) => (
            <FileUploader files={Array.isArray(value) ? value : []} setFiles={onChange} />
          )
        }
        control={control}
        name={field}
        shouldUnregister
      />
    </div>
  );
};

const TagFormPart = ({ setAreTopicsUnique }) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Controller
      render={
        ({ field: { onChange, value } }) => (
          <FormDataRow>
            <TagPicker
              tags={Array.isArray(value) ? value : []}
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
  );
};

const DynamicFormParts = ({ fields }) => Object.entries(fields ?? {}).map(([k, v]) => {
  if (v === FORM_COMPONENT_TYPES.TEXT) return <TextFormPart key={k} field={k} />;
  if (v === FORM_COMPONENT_TYPES.LIST) return <ListFormPart key={k} field={k} />;
  if (v === FORM_COMPONENT_TYPES.EDITOR) return <EditorFormPart key={k} field={k} />;
  if (v === FORM_COMPONENT_TYPES.IMAGE) return <ImageFormPart key={k} field={k} />;
  return null;
});

const TopContainer = ({ title, handleClose }) => {
  const classes = useStyles();
  const { getValues } = useFormContext();

  return (
    <div className={classes.topContainer}>
      <h1>{isNewPost(getValues('id')) ? title : getValues('type')}</h1>
      <IconButton
        aria-label="close post form"
        style={{ color: WHITE }}
        onClick={handleClose}
      >
        <Close style={{ color: WHITE, width: 35, height: 35 }} />
      </IconButton>
    </div>
  );
};

const MiddleContainer = ({ form, setAreTopicsUnique, formTypes }) => {
  const classes = useStyles();

  return (
    <div className={classes.middleContainer}>
      <TypeFormPart formTypes={formTypes} />
      <DynamicFormParts fields={form?.fields} />
      {form?.type && <TagFormPart setAreTopicsUnique={setAreTopicsUnique} /> }
    </div>
  );
};

const BottomContainer = ({ btnTitle }) => {
  const classes = useStyles();

  return (
    <div className={classes.bottomContainer}>
      <Button variant="contained" color="primary" type="submit">
        {btnTitle}
      </Button>
    </div>
  );
};

const PostBuilder = ({ form, setForm, title, btnTitle, open, setOpen, onSubmit, formTypes }) => {
  const classes = useStyles();

  const handleClose = () => setOpen(false);
  const [areTopicsUnique, setAreTopicsUnique] = useState(true);

  const { handleSubmit, watch, reset, getValues } = useFormContext();
  const watchedPostType = watch('type');

  useEffect(() => {
    let isMounted = true;

    if (isMounted && watchedPostType && isNewPost(getValues('id'))) {
      const initializeForm = async () => {
        const selectedForm = await getFormByType(watchedPostType);
        setForm(selectedForm);

        const defaultValues = { topics: [], type: watchedPostType };
        Object.keys(selectedForm.fields).forEach((formField) => { defaultValues[formField] = ''; });
        reset(defaultValues);
      };
      initializeForm();
    }

    return function cleanUp() {
      isMounted = false;
    };
  }, [setForm, watchedPostType, reset, getValues]);

  const ModalData = (
    <div className={classes.modalData}>
      <form
        className={classes.form}
        onSubmit={handleSubmit((data) => areTopicsUnique && onSubmit(data))}
        noValidate
      >
        <TopContainer title={title} handleClose={handleClose} />
        <MiddleContainer form={form} setAreTopicsUnique={setAreTopicsUnique} formTypes={formTypes} />
        <BottomContainer btnTitle={btnTitle} />
      </form>
    </div>
  );

  return <Modal open={open} onClose={handleClose} disableRestoreFocus>{ModalData}</Modal>;
};

PostBuilder.defaultProps = {
  btnTitle: 'share',
};

export default PostBuilder;
