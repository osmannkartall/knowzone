/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  TextField,
  IconButton,
  MenuItem,
  Button,
  Modal,
  FormHelperText,
  FormControl,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import { Controller, useFormContext } from 'react-hook-form';
import { WHITE, GRAY3, PRIMARY, GRAY1 } from '../../constants/colors';
import TagPicker from '../common/TagPicker/TagPicker';
import FileUploader from '../common/FileUploader';
import MarkdownEditor from '../common/MarkdownEditor';
import FORM_COMPONENT_TYPES from '../form/formComponentTypes';
import getFormByType from '../../api/getFormByType';

const PREFIX = 'PostCreator';

const classes = {
  modalData: `${PREFIX}-modalData`,
  form: `${PREFIX}-form`,
  topContainer: `${PREFIX}-topContainer`,
  middleContainer: `${PREFIX}-middleContainer`,
  formDataRow: `${PREFIX}-formDataRow`,
  fileUploaderContainer: `${PREFIX}-fileUploaderContainer`,
  bottomContainer: `${PREFIX}-bottomContainer`,
  label: `${PREFIX}-label`,
  span: `${PREFIX}-span`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.modalData}`]: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: `calc(100% - ${theme.spacing(10)})`,
  },

  [`& .${classes.form}`]: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
  },

  [`& .${classes.topContainer}`]: {
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

  [`& .${classes.middleContainer}`]: {
    overflowY: 'auto',
    borderTop: 0,
    border: `1px solid ${GRAY3}`,
    backgroundColor: WHITE,
    padding: theme.spacing(1, 0),
  },

  [`& .${classes.formDataRow}`]: {
    margin: theme.spacing(3, 2),
  },

  [`& .${classes.fileUploaderContainer}`]: {
    margin: theme.spacing(0, 2),
  },

  [`& .${classes.bottomContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(2),
    borderBottomLeftRadius: theme.spacing(1),
    borderBottomRightRadius: theme.spacing(1),
    border: `1px solid ${GRAY3}`,
    borderTop: 0,
    backgroundColor: WHITE,
  },

  [`& .${classes.label}`]: {
    margin: theme.spacing(1, 0),
    color: GRAY1,
  },

  [`& .${classes.span}`]: {
    display: 'block',
    margin: theme.spacing(1, 0),
    color: GRAY1,
  },
}));

const isNewPost = (id) => id === null || id === undefined;

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

function FormDataRow({ children }) {
  return (
    <div className={classes.formDataRow}>
      {children}
    </div>
  );
}

function TypeFormPart({ formTypes }) {
  const { control, formState: { errors }, getValues } = useFormContext();

  return (
    isNewPost(getValues('id')) && (
    <FormDataRow>
      <Controller
        render={
          ({ field: { onChange, onBlur, value, name } }) => (
            <TextField
              id="select-post-type"
              data-testid="select-post-type"
              select
              label="Post Type"
              onChange={onChange}
              onBlur={onBlur}
              value={value ?? ''}
              name={name}
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
      {errors.type && (
        <FormHelperText role="alert" error={errors.type !== undefined}>
          {errors.type?.message}
        </FormHelperText>
      )}
    </FormDataRow>
    )
  );
}

function TextFormPart({ field }) {
  const { control } = useFormContext();

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
            />
          )
        }
        control={control}
        name={`content.${field}`}
        shouldUnregister
      />
    </FormDataRow>
  );
}

function ListFormPart({ field }) {
  const { control } = useFormContext();

  return (
    <FormDataRow>
      <Controller
        render={
          ({ field: { onChange, value } }) => (
            <label>
              <span className={classes.span}>
                {field}
              </span>
              <div title={field}>
                <TagPicker
                  id={field}
                  tags={Array.isArray(value) ? value : []}
                  setTags={onChange}
                  placeholder="Type an item and press enter to add"
                  unique
                  border
                />
              </div>
            </label>
          )
        }
        control={control}
        name={`content.${field}`}
        shouldUnregister
      />
    </FormDataRow>
  );
}

function EditorFormPart({ field }) {
  const { control } = useFormContext();

  return (
    <FormDataRow>
      <Controller
        render={
          ({ field: { onChange, value } }) => (
            <FormControl style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor={field} className={classes.label}>{field}</label>
              <MarkdownEditor
                id={field}
                text={value}
                onChangeText={onChange}
                containerMaxHeight="50vh"
              />
            </FormControl>
          )
        }
        control={control}
        name={`content.${field}`}
        shouldUnregister
      />
    </FormDataRow>
  );
}

function ImageFormPart({ field }) {
  const { control } = useFormContext();

  return (
    <div className={classes.fileUploaderContainer} title={field}>
      <Controller
        render={
          ({ field: { onChange, value } }) => (
            <FormControl style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="images" className={classes.label}>{field}</label>
              <FileUploader files={Array.isArray(value) ? value : []} setFiles={onChange} />
            </FormControl>
          )
        }
        control={control}
        name={`content.${field}`}
        shouldUnregister
      />
    </div>
  );
}

function TopicsFormPart({ setAreTopicsUnique }) {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Controller
      render={
        ({ field: { onChange, value } }) => (
          <FormDataRow>
            <label>
              <span className={classes.span} style={{ fontWeight: 'bold' }}>
                Topics
              </span>
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
            </label>
          </FormDataRow>
        )
      }
      control={control}
      name="topics"
      shouldUnregister
    />
  );
}

const DynamicFormParts = ({ content }) => Object.entries(content ?? {}).map(([k, v]) => {
  if (v === FORM_COMPONENT_TYPES.TEXT) return <TextFormPart key={k} field={k} />;
  if (v === FORM_COMPONENT_TYPES.LIST) return <ListFormPart key={k} field={k} />;
  if (v === FORM_COMPONENT_TYPES.EDITOR) return <EditorFormPart key={k} field={k} />;
  if (v === FORM_COMPONENT_TYPES.IMAGE) return <ImageFormPart key={k} field={k} />;
  return null;
});

function TopContainer({ title, handleClose }) {
  const { getValues } = useFormContext();

  return (
    <div className={classes.topContainer}>
      <h1>{isNewPost(getValues('id')) ? title : getValues('type')}</h1>
      <IconButton
        aria-label="close post form"
        style={{ color: WHITE }}
        onClick={handleClose}
        size="large"
      >
        <Close style={{ color: WHITE, width: 35, height: 35 }} />
      </IconButton>
    </div>
  );
}

function MiddleContainer({ form, setAreTopicsUnique, formTypes }) {
  const { formState: { errors }, getValues } = useFormContext();

  return (
    <div className={classes.middleContainer}>
      <TypeFormPart formTypes={formTypes} />
      {getValues('type') && (
        <>
          <FormDataRow>
            <span style={{ fontWeight: 'bold' }}>
              Content
            </span>
          </FormDataRow>
          {errors.content && (
          <FormDataRow>
            <FormHelperText role="alert" error={errors.content !== undefined}>
              {errors.content?.message}
            </FormHelperText>
          </FormDataRow>
          )}
          <DynamicFormParts content={form?.content} />
          <TopicsFormPart setAreTopicsUnique={setAreTopicsUnique} />
        </>
      )}
    </div>
  );
}

function BottomContainer({ btnTitle }) {
  const { getValues } = useFormContext();

  return (
    <div className={classes.bottomContainer}>
      <Button variant="contained" color="primary" type="submit" disabled={!getValues('type')}>
        {btnTitle}
      </Button>
    </div>
  );
}

function PostCreator({ form, setForm, title, btnTitle, open, setOpen, onSubmit, formTypes }) {
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

        const defaultValues = { topics: [], type: watchedPostType, content: {} };
        reset(defaultValues);
      };
      initializeForm();
    }

    return function cleanUp() {
      isMounted = false;
    };
  }, [setForm, watchedPostType, reset, getValues]);

  const ModalData = (
    <Root>
      <div className={classes.modalData}>
        <form
          className={classes.form}
          onSubmit={handleSubmit((data) => areTopicsUnique && onSubmit(data))}
        >
          <TopContainer title={title} handleClose={handleClose} />
          <MiddleContainer
            form={form}
            setAreTopicsUnique={setAreTopicsUnique}
            formTypes={formTypes}
          />
          <BottomContainer btnTitle={btnTitle} onSubmit={onSubmit} />
        </form>
      </div>
    </Root>
  );

  return <Modal open={open} onClose={handleClose} disableRestoreFocus>{ModalData}</Modal>;
}

PostCreator.defaultProps = {
  btnTitle: 'share',
};

export default PostCreator;
