import { Button, Dialog, FormHelperText, IconButton, MenuItem, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Close from '@mui/icons-material/Close';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { GRAY3, PRIMARY, WHITE } from '../../constants/colors';
import FORM_COMPONENT_TYPES from '../../constants/form-components-types';
import FileUploader from '../common/FileUploader';
import MarkdownEditor from '../common/MarkdownEditor';
import TagPicker from '../common/TagPicker/TagPicker';
import formCreatorSchema from '../../schemas/formCreatorSchema';

const PREFIX = 'FormCreator';

const classes = {
  modalData: `${PREFIX}-modalData`,
  form: `${PREFIX}-form`,
  topContainer: `${PREFIX}-topContainer`,
  middleContainer: `${PREFIX}-middleContainer`,
  middleInnerContainer: `${PREFIX}-middleInnerContainer`,
  contentFieldRow: `${PREFIX}-contentFieldRow`,
  bottomContainer: `${PREFIX}-bottomContainer`,
  formDataRow: `${PREFIX}-formDataRow`,
  preview: `${PREFIX}-preview`,
  contentFields: `${PREFIX}-contentFields`,
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
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

  [`& .${classes.middleInnerContainer}`]: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },

  [`& .${classes.contentFields}`]: {
    borderRight: `1px solid ${GRAY3}`,
    width: '40%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      border: 'none',
    },
  },

  [`& .${classes.contentFieldRow}`]: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  [`& .${classes.preview}`]: {
    width: '60%',
    padding: 20,
    [theme.breakpoints.down('md')]: {
      width: 'calc(100% - 40px)',
    },
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

  [`& .${classes.formDataRow}`]: {
    margin: theme.spacing(2),
  },
}));

const { IMAGE, ...rest } = FORM_COMPONENT_TYPES;

const defaultField = { name: '', type: '' };

const defaultContent = {
  k0: defaultField,
  k1: defaultField,
  k2: defaultField,
  k3: defaultField,
  k4: defaultField,
  k5: defaultField,
  k6: defaultField,
  k7: defaultField,
  k8: defaultField,
  k9: defaultField,
};

function FormDataRow({ children }) {
  return (
    <div className={classes.formDataRow}>
      {children}
    </div>
  );
}

function TopContainer({ title, handleClose }) {
  return (
    <div className={classes.topContainer}>
      <h1>{title}</h1>
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

function BottomContainer() {
  return (
    <div className={classes.bottomContainer}>
      <Button variant="contained" color="primary" type="submit">
        Create
      </Button>
    </div>
  );
}

function MiddleContainer({ control, errors, getValues, watch }) {
  const [selectedImageComponentKey, setSelectedImageComponentKey] = useState(null);

  const watchedContent = watch('content');

  return (
    <div className={classes.middleContainer}>
      <div className={classes.middleInnerContainer}>
        <div className={classes.contentFields}>
          <FormDataRow>
            <Controller
              render={({ field: { onChange, onBlur, value, name } }) => (
                <TextField
                  fullWidth
                  id="form type name"
                  label="Form Type Name"
                  variant="outlined"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  name={name}
                  size="small"
                />
              )}
              control={control}
              name="type"
              shouldUnregister
            />
          </FormDataRow>
          <FormDataRow>
            {errors.type && (
            <FormHelperText role="alert" error={errors.type !== undefined}>
              {errors.type?.message}
            </FormHelperText>
            )}
          </FormDataRow>
          <FormDataRow>
            <span style={{ fontWeight: 'bold' }}>
              Content
            </span>
            {errors.content && (
            <FormHelperText role="alert" error={errors.content !== undefined}>
              {errors.content?.message}
            </FormHelperText>
            )}
          </FormDataRow>
          {Object.keys(getValues('content') ?? {}).map((k) => (
            <FormDataRow key={k}>
              <div className={classes.contentFieldRow}>
                <Controller
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <TextField
                      id="outlined-basic-name"
                      data-testid="outlined-basic-name"
                      fullWidth
                      style={{ marginRight: 10 }}
                      label="Name"
                      variant="outlined"
                      value={
                        selectedImageComponentKey && selectedImageComponentKey === k
                          ? 'images'
                          : value
                      }
                      onChange={onChange}
                      onBlur={onBlur}
                      size="small"
                      disabled={selectedImageComponentKey && selectedImageComponentKey === k}
                      name={name}
                    />
                  )}
                  control={control}
                  name={`content.${k}.name`}
                  shouldUnregister
                />
                <Controller
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <TextField
                      id="outlined-select-component-type"
                      data-testid="outlined-select-component-type"
                      select
                      label="Component type"
                      variant="outlined"
                      value={value}
                      onChange={(e) => {
                        if (e.target.value === IMAGE) {
                          setSelectedImageComponentKey(k);
                        } else if (k === selectedImageComponentKey) {
                          setSelectedImageComponentKey(null);
                        }
                        onChange(e.target.value);
                      }}
                      onBlur={onBlur}
                      name={name}
                      fullWidth
                      style={{ marginLeft: 10 }}
                      size="small"
                    >
                      <MenuItem key="none" value="">
                        <em>Select</em>
                      </MenuItem>
                      {Object.values(rest).map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                      <MenuItem
                        disabled={selectedImageComponentKey !== null}
                        key={IMAGE}
                        value={IMAGE}
                      >
                        {IMAGE}
                      </MenuItem>
                    </TextField>
                  )}
                  control={control}
                  name={`content.${k}.type`}
                  shouldUnregister
                />
              </div>
            </FormDataRow>
          ))}
        </div>
        <div className={classes.preview}>
          <span style={{ fontWeight: 'bold' }}>
            Your Form
          </span>
          {Object.entries(watchedContent ?? {}).map(([k, v]) => {
            if (v.type === FORM_COMPONENT_TYPES.TEXT) {
              return (
                <div data-testid="component-type-preview" style={{ margin: '16px 0px' }} key={k}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label={v.name}
                    variant="outlined"
                    value="This is a text"
                    multiline
                    minRows={4}
                    maxRows={4}
                  />
                </div>
              );
            }
            if (v.type === FORM_COMPONENT_TYPES.LIST) {
              return (
                <div data-testid="component-type-preview" style={{ margin: '16px 0px' }} key={k}>
                  <TagPicker
                    tags={['example1', 'example2']}
                    setTags={() => {}}
                    placeholder={`Type a '${v.name}' and press enter to add`}
                    unique
                    border
                  />
                </div>
              );
            }
            if (v.type === FORM_COMPONENT_TYPES.EDITOR) {
              return (
                <div data-testid="component-type-preview" style={{ margin: '16px 0px' }} key={k}>
                  {v.name && <span>{v.name}</span>}
                  <MarkdownEditor
                    text={'# This is a markdown editor\n\n```js\nconsole.log("Click to SHOW PREVIEW Button")\n```'}
                    onChangeText={() => {}}
                    containerMaxHeight="50vh"
                  />
                </div>
              );
            }
            if (v.type === FORM_COMPONENT_TYPES.IMAGE) {
              return (
                <div data-testid="component-type-preview" style={{ margin: '16px 0px' }} key={k}>
                  <span>images</span>
                  <FileUploader files={[]} setFiles={() => {}} />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

function DialogData({ create, handleClose }) {
  const { getValues, formState: { errors }, control, handleSubmit, watch, reset } = useForm({
    resolver: joiResolver(formCreatorSchema),
    defaultValues: { type: '', content: defaultContent },
  });

  const onSubmit = async () => {
    const isSuccessful = await create(getValues());
    if (isSuccessful) {
      reset();
    }
  };

  return (
    <div className={classes.modalData}>
      <form
        className={classes.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TopContainer title="Create Form" handleClose={handleClose} />
        <MiddleContainer
          control={control}
          errors={errors}
          getValues={getValues}
          watch={watch}
        />
        <BottomContainer />
      </form>
    </div>
  );
}

function FormCreator({ open, setOpen, create }) {
  const handleClose = () => setOpen(false);

  return (
    <StyledDialog onClose={handleClose} open={open}>
      <DialogData create={create} handleClose={handleClose} />
    </StyledDialog>
  );
}

export default FormCreator;
