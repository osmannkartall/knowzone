import { styled } from '@mui/material/styles';
import { FormHelperText, FormControl } from '@mui/material';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { GRAY1 } from '../../constants/colors';
import getContentPart from './contentParts/getContentPart';
import Topics from './defaultParts/Topics';
import Creator from '../common/Creator';
import postCreatorSchema from './postCreatorSchema';
import { NUMERIC_KEY_PREFIX, addNumericKeyPrefix } from './postCreatorUtils';

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

const FormDataRow = styled('div')(({ theme }) => ({
  margin: theme.spacing(2),
}));

function TopicsPart() {
  const { control, formState: { errors } } = useFormContext();

  return (
    <FormDataRow>
      <Controller
        render={
        ({ field: { onChange, value } }) => (
          <FormControl style={{ display: 'flex', flexDirection: 'column' }}>
            <Label htmlFor="topics">Topics</Label>
            <Topics inputId="topics" onChange={onChange} value={value} errors={errors.topics} />
          </FormControl>
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
              name={`content.${NUMERIC_KEY_PREFIX}${k}`}
              shouldUnregister
            />
          </FormDataRow>
        );
      }

      return null;
    }));
};

const newPostDefaultValues = (type) => ({
  type: type ?? '',
  topics: [],
  content: {},
});

const oldPostDefaultValues = (oldPost) => ({
  id: oldPost?.id ?? '',
  type: oldPost?.type ?? '',
  topics: oldPost?.topics ?? [],
  content: addNumericKeyPrefix(oldPost?.content) ?? {},
});

function PostCreator({ buttonTitle, open, setOpen, handler, form, oldPost }) {
  const useFormMethods = useForm({
    resolver: joiResolver(postCreatorSchema),
    defaultValues: oldPost ? oldPostDefaultValues(oldPost) : newPostDefaultValues(form?.type),
  });
  const { formState: { errors }, handleSubmit, reset, getValues } = useFormMethods;

  const onSubmit = async () => {
    const isSuccessful = await handler(getValues());

    if (isSuccessful) {
      reset();
    }
  };

  return (
    <Creator
      title={form?.type}
      buttonTitle={buttonTitle}
      isButtonDisabled={!form?.type}
      isOpen={open}
      setIsOpen={setOpen}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormProvider {...useFormMethods}>
        <FormDataRow>
          <Title>Content</Title>
          {errors.content && (
          <FormHelperText role="alert" error={errors.content !== undefined}>
            {errors.content?.message}
          </FormHelperText>
          )}
        </FormDataRow>
        <ContentParts content={form?.content} />
        <TopicsPart />
      </FormProvider>
    </Creator>
  );
}

PostCreator.defaultProps = {
  buttonTitle: 'share',
};

export default PostCreator;
