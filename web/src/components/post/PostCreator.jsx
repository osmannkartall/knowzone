/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { IconButton, Button, Modal, FormHelperText, FormControl } from '@mui/material';
import Close from '@mui/icons-material/Close';
import { Controller, useFormContext } from 'react-hook-form';
import { WHITE, GRAY3, PRIMARY, GRAY1 } from '../../constants/colors';
import getFormByType from '../../api/forms/getFormByType';
import getContentPart from './contentParts/getContentPart';
import Type from './defaultParts/Type';
import Topics from './defaultParts/Topics';

const PREFIX = 'PostCreator';

const classes = {
  modalData: `${PREFIX}-modalData`,
  form: `${PREFIX}-form`,
  topContainer: `${PREFIX}-topContainer`,
  middleContainer: `${PREFIX}-middleContainer`,
  formDataRow: `${PREFIX}-formDataRow`,
  bottomContainer: `${PREFIX}-bottomContainer`,
  label: `${PREFIX}-label`,
  title: `${PREFIX}-title`,
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
    padding: theme.spacing(2, 2),

  },

  [`& .${classes.formDataRow}`]: {
    marginBottom: theme.spacing(2),
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
    marginBottom: theme.spacing(2),
    color: GRAY1,
  },

  [`& .${classes.title}`]: {
    display: 'block',
    marginBottom: theme.spacing(2),
    color: GRAY1,
    fontWeight: 'bold',
  },
}));

const isNewPost = (id) => id === null || id === undefined;

function Title({ children }) {
  return (
    <span className={classes.title}>
      {children}
    </span>
  );
}

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
            ({ field: { onChange, onBlur, value } }) => (
              <label>
                Post Type
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

function TopicsFormPart({ setAreTopicsUnique }) {
  const { control, formState: { errors } } = useFormContext();

  return (
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
                  <label
                    htmlFor={k}
                    className={classes.label}
                  >
                    {k}
                  </label>
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
          <Title>Content</Title>
          {errors.content && (
            <FormHelperText role="alert" error={errors.content !== undefined}>
              {errors.content?.message}
            </FormHelperText>
          )}
          <ContentParts content={form?.content} />
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
