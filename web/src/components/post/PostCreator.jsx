/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { FormHelperText, FormControl } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { GRAY1 } from '../../constants/colors';
import getFormByType from '../../api/forms/getFormByType';
import getContentPart from './contentParts/getContentPart';
import Type from './defaultParts/Type';
import Topics from './defaultParts/Topics';
import Creator from '../common/Creator';

const Title = styled('span')(({ theme }) => ({
  display: 'block',
  marginBottom: theme.spacing(2),
  color: GRAY1,
  fontWeight: 'bold',
}));

const Label = styled('label')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: GRAY1,
}));

const isNewPost = (id) => id === null || id === undefined;

const FormDataRow = styled('div')(({ theme }) => ({
  margin: theme.spacing(2),
}));

function TypePart({ formTypes }) {
  const { control, formState: { errors }, getValues } = useFormContext();

  return (
    isNewPost(getValues('id')) && (
      <FormDataRow>
        <Controller
          render={
            ({ field: { onChange, onBlur, value } }) => (
              <label>
                <Title>Post Type</Title>
                <Type onChange={onChange} onBlur={onBlur} value={value} formTypes={formTypes} />
              </label>
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

function TopicsPart({ setAreTopicsUnique }) {
  const { control, formState: { errors } } = useFormContext();

  return (
    <FormDataRow>
      <Controller
        render={
        ({ field: { onChange, value } }) => (
          <label>
            <Title>Topics</Title>
            <Topics
              onChange={onChange}
              value={value}
              errors={errors}
              setAreTopicsUnique={setAreTopicsUnique}
            />
          </label>
        )
      }
        control={control}
        name="topics"
        shouldUnregister
      />
    </FormDataRow>
  );
}

const ContentParts = ({ content }) => {
  const { control } = useFormContext();

  return (
    Object.entries(content ?? {}).map(([k, v]) => {
      const ContentPart = getContentPart(v);

      if (ContentPart) {
        return (
          <FormDataRow key={k}>
            <Controller
              render={
              ({ field: { onChange, onBlur, value } }) => (
                <FormControl style={{ display: 'flex', flexDirection: 'column' }}>
                  <Label htmlFor={k}>{k}</Label>
                  <ContentPart field={k} onChange={onChange} onBlur={onBlur} value={value} />
                </FormControl>
              )
            }
              control={control}
              name={`content.${k}`}
              shouldUnregister
            />
          </FormDataRow>
        );
      }

      return null;
    }));
};
function PostCreator({
  form,
  setForm,
  title,
  submitButtonTitle,
  open,
  setOpen,
  onSubmit,
  formTypes,
}) {
  const [areTopicsUnique, setAreTopicsUnique] = useState(true);

  const { handleSubmit, watch, reset, getValues, formState: { errors } } = useFormContext();

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

  return (
    <Creator
      title={isNewPost(getValues('id')) ? title : getValues('type')}
      submitButtonTitle={submitButtonTitle}
      open={open}
      setOpen={setOpen}
      onSubmit={handleSubmit((data) => areTopicsUnique && onSubmit(data))}
      submitButtonDisabled={!getValues('type')}
    >
      <TypePart formTypes={formTypes} />
      {getValues('type') && (
        <>
          <FormDataRow>
            <Title>Content</Title>
            {errors.content && (
            <FormHelperText role="alert" error={errors.content !== undefined}>
              {errors.content?.message}
            </FormHelperText>
            )}
          </FormDataRow>
          <ContentParts content={form?.content} />
          <TopicsPart setAreTopicsUnique={setAreTopicsUnique} />
        </>
      )}
    </Creator>
  );
}

PostCreator.defaultProps = {
  submitButtonTitle: 'share',
};

export default PostCreator;
