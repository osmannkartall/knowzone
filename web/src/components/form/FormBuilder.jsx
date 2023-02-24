import { Button, IconButton, makeStyles, MenuItem, Modal, TextField } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { useState } from 'react';
import { toast } from 'react-toastify';
import createForm from '../../api/createForm';
import { GRAY3, PRIMARY, WHITE } from '../../constants/colors';
import FORM_COMPONENT_TYPES from '../../constants/form-components-types';
import FileUploader from '../common/FileUploader';
import LinearProgressModal from '../common/LinearProgressModal';
import MarkdownEditor from '../common/MarkdownEditor';
import TagPicker from '../common/TagPicker/TagPicker';

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
}));

const BottomContainer = ({ handleSubmit }) => {
  const classes = useStyles();

  return (
    <div className={classes.bottomContainer}>
      <Button variant="contained" color="primary" type="button" onClick={handleSubmit}>
        Create
      </Button>
    </div>
  );
};

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

const defaultFormSetting = { name: '', type: '' };

const defaultFormSettings = {
  0: defaultFormSetting,
  1: defaultFormSetting,
  2: defaultFormSetting,
  3: defaultFormSetting,
  4: defaultFormSetting,
  5: defaultFormSetting,
  6: defaultFormSetting,
  7: defaultFormSetting,
  8: defaultFormSetting,
  9: defaultFormSetting,
};

const { IMAGE, ...rest } = FORM_COMPONENT_TYPES;

const MiddleContainer = ({ formSettings, setFormSettings, formType, setFormType }) => {
  const classes = useStyles();

  const [selectedImageComponentKey, setSelectedImageComponentKey] = useState(null);

  const onChangeName = (e, key) => {
    const copyFormSettings = { ...formSettings };
    const copyFormSetting = { ...copyFormSettings[key] };

    copyFormSetting.name = e.target.value;
    copyFormSettings[key] = copyFormSetting;

    setFormSettings(copyFormSettings);
  };

  const onChangeType = (e, key) => {
    const copyFormSettings = { ...formSettings };
    const copyFormSetting = { ...copyFormSettings[key] };

    copyFormSetting.type = e.target.value;
    copyFormSettings[key] = copyFormSetting;

    if (copyFormSetting.type === IMAGE) {
      setSelectedImageComponentKey(key);
    } else if (key === selectedImageComponentKey) {
      setSelectedImageComponentKey(null);
    }

    setFormSettings(copyFormSettings);
  };

  return (
    <div className={classes.middleContainer}>
      <div className={classes.middleInnerContainer}>
        <div style={{ borderRight: `1px solid ${GRAY3}`, width: '40%' }}>
          <TextField
            id="outlined-basic"
            label="Form Type Name"
            variant="outlined"
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            size="small"
            style={{ margin: '20px 20px', width: 'calc(100% - 40px)' }}
          />
          {Object.entries(formSettings).map(([key, value]) => (
            <div className={classes.middleInnerContainer} key={key}>
              <TextField
                id="outlined-basic-name"
                data-testid="outlined-basic-name"
                fullWidth
                label="Name"
                variant="outlined"
                value={selectedImageComponentKey && selectedImageComponentKey === key ? 'images' : value.name}
                onChange={(e) => onChangeName(e, key)}
                style={{ margin: '4px 20px' }}
                size="small"
                disabled={selectedImageComponentKey && selectedImageComponentKey === key}
              />
              <TextField
                id="outlined-select-component-type"
                data-testid="outlined-select-component-type"
                select
                label="Select component type"
                variant="outlined"
                value={value.type}
                onChange={(e) => onChangeType(e, key)}
                fullWidth
                style={{ margin: '4px 20px' }}
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
            </div>
          ))}
        </div>
        <div style={{ width: '60%', padding: 20 }}>
          {Object.entries(formSettings).map(([k, v]) => {
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

const FormBuilder = ({ open, setOpen, setSidebarItems }) => {
  const classes = useStyles();

  const [formType, setFormType] = useState('');
  const [formSettings, setFormSettings] = useState(defaultFormSettings);
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      setIsLinearProgressModalOpen(true);

      if (!formType) {
        throw new Error('Form type name is required');
      }

      const formSettingsKeys = [];
      const newForm = { type: formType, fields: {} };
      Object.values(formSettings).forEach((fs) => {
        if (fs.type === IMAGE) {
          newForm.fields.images = IMAGE;
          formSettingsKeys.push('images');
        } else if (fs.name && fs.type) {
          newForm.fields[fs.name] = fs.type;
          formSettingsKeys.push(fs.name);
        }
      });

      if (formSettingsKeys.length !== new Set(formSettingsKeys).size) {
        throw new Error('Each name of form field must be unique');
      }

      const result = await createForm(newForm);

      if (result.status === 'success') {
        setFormSettings(defaultFormSettings);
        setOpen(false);
        setSidebarItems((prev) => [{ id: formType, type: formType }, ...prev]);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLinearProgressModalOpen(false);
    }
  };

  const ModalData = (
    <div className={classes.modalData}>
      <form
        className={classes.form}
        onSubmit={handleSubmit}
        noValidate
        aria-label="create-form-form"
      >
        <TopContainer title="Create Form" handleClose={handleClose} />
        <MiddleContainer
          formSettings={formSettings}
          setFormSettings={setFormSettings}
          formType={formType}
          setFormType={setFormType}
        />
        <BottomContainer handleSubmit={handleSubmit} />
      </form>
    </div>
  );
  return (
    <LinearProgressModal isOpen={isLinearProgressModalOpen}>
      <Modal open={open} onClose={handleClose} disableRestoreFocus>{ModalData}</Modal>
    </LinearProgressModal>
  );
};

export default FormBuilder;
