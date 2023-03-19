import {
  Button,
  Dialog,
  FormHelperText,
  IconButton,
  makeStyles,
  MenuItem,
  TextField,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { GRAY3, PRIMARY, WHITE } from '../../constants/colors';
import FORM_COMPONENT_TYPES from '../../constants/form-components-types';
import FileUploader from '../common/FileUploader';
import MarkdownEditor from '../common/MarkdownEditor';
import TagPicker from '../common/TagPicker/TagPicker';
import formCreatorSchema from '../../schemas/formCreatorSchema';

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
  middleInnerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  formDataRow: {
    margin: theme.spacing(2),
  },
}));

const { IMAGE, ...rest } = FORM_COMPONENT_TYPES;

const defaultField = { name: '', type: '' };

const defaultContent = {
  0: defaultField,
  1: defaultField,
  2: defaultField,
  3: defaultField,
  4: defaultField,
  5: defaultField,
  6: defaultField,
  7: defaultField,
  8: defaultField,
  9: defaultField,
};

const FormDataRow = ({ children }) => (
  <div className={useStyles().formDataRow}>
    {children}
  </div>
);

const TopContainer = ({ title, handleClose }) => {
  const classes = useStyles();

  return (
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
  );
};

const BottomContainer = () => {
  const classes = useStyles();

  return (
    <div className={classes.bottomContainer}>
      <Button variant="contained" color="primary" type="submit">
        Create
      </Button>
    </div>
  );
};

const MiddleContainer = ({ control, errors, getValues, watch }) => {
  const classes = useStyles();

  const [selectedImageComponentKey, setSelectedImageComponentKey] = useState(null);

  const watchedContent = watch('content');

  return (
    <div className={classes.middleContainer}>
      <div className={classes.middleInnerContainer}>
        <div style={{ borderRight: `1px solid ${GRAY3}`, width: '40%' }}>
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
              <div className={classes.middleInnerContainer}>
                <Controller
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <TextField
                      id="outlined-basic-name"
                      data-testid="outlined-basic-name"
                      fullWidth
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
                      label="Select component type"
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
        <div style={{ width: '60%', padding: 20 }}>
          {Object.entries(watchedContent ?? {}).map(([k, v]) => {
            if (v.type === FORM_COMPONENT_TYPES.TEXT) {
              return (
                <div data-testid="component-type-preview" style={{ margin: '4px 0px' }} key={k}>
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
                <div data-testid="component-type-preview" style={{ margin: '8px 0px' }} key={k}>
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
                <div data-testid="component-type-preview" style={{ margin: '8px 0px' }} key={k}>
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
                <div data-testid="component-type-preview" style={{ margin: '4px 0px' }} key={k}>
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
};

const DialogData = ({ create, handleClose }) => {
  const classes = useStyles();

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
};

const FormCreator = ({ open, setOpen, create }) => {
  const handleClose = () => setOpen(false);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogData create={create} handleClose={handleClose} />
    </Dialog>
  );
};

export default FormCreator;
