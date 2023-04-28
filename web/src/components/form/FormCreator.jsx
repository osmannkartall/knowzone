import { FormHelperText, MenuItem, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { GRAY1, GRAY3 } from '../../constants/colors';
import FORM_COMPONENT_TYPES from './formComponentTypes';
import FORM_SCHEMA_CONFIGS from './formSchemaConfigs';
import formCreatorSchema from './formCreatorSchema';
import getContentPreview from './contentPreviews/getContentPreview';
import Creator from '../common/Creator';
import STYLES from '../../constants/styles';

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

const FormDataRow = styled('div')(({ theme }) => ({
  margin: theme.spacing(2),
}));

const MiddleContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const ContentFieldsContainer = styled('div')(({ theme }) => ({
  borderRight: `1px solid ${GRAY3}`,
  width: '40%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    border: 'none',
  },
}));

const PreviewContainer = styled('div')(({ theme }) => ({
  width: '60%',
  padding: 20,
  [theme.breakpoints.down('md')]: {
    width: 'calc(100% - 40px)',
  },
}));

const ContentFieldRow = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

const ContentPreviewLabel = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: GRAY1,
}));

function FormCreator({ open, setOpen, handler }) {
  const [selectedImageComponentKey, setSelectedImageComponentKey] = useState(null);

  const { getValues, formState: { errors }, control, handleSubmit, watch, reset } = useForm({
    resolver: joiResolver(formCreatorSchema),
    defaultValues: { type: { name: '' }, content: defaultContent },
  });

  const watchedContent = watch('content');

  const onSubmit = async () => {
    const isSuccessful = await handler(getValues());
    if (isSuccessful) {
      reset();
    }
  };

  return (
    <Creator
      title="Create Form"
      isOpen={open}
      setIsOpen={setOpen}
      onSubmit={handleSubmit(onSubmit)}
    >
      <MiddleContainer>
        <ContentFieldsContainer>
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
              name="type.name"
              shouldUnregister
            />
          </FormDataRow>
          <FormDataRow>
            {errors.type?.name && (
              <FormHelperText role="alert" error={errors.type?.name !== undefined}>
                {errors.type?.name?.message}
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
              <ContentFieldRow>
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
                      inputProps={{ maxLength: FORM_SCHEMA_CONFIGS.MAX_LEN_KEY_OF_CONTENT }}
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
              </ContentFieldRow>
            </FormDataRow>
          ))}
        </ContentFieldsContainer>
        <PreviewContainer>
          <span style={{ fontWeight: 'bold' }}>
            Your Form
          </span>
          {Object.entries(watchedContent ?? {}).map(([k, v]) => {
            const ContentPreview = getContentPreview(v.type);

            if (ContentPreview) {
              return (
                <div
                  data-testid="component-type-preview"
                  style={{ margin: `${STYLES.MUI_SPACING_UNIT}px 0px` }}
                  key={k}
                >
                  {v.name && (
                    <ContentPreviewLabel>
                      {v.type === IMAGE ? 'images' : v.name}
                    </ContentPreviewLabel>
                  )}
                  <ContentPreview />
                </div>
              );
            }

            return null;
          })}
        </PreviewContainer>
      </MiddleContainer>
    </Creator>
  );
}

export default FormCreator;
