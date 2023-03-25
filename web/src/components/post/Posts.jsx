import { useState } from 'react';
import { Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { joiResolver } from '@hookform/resolvers/joi';
import Post from './Post';
import PostCreator from './PostCreator';
import ContentWrapper from '../common/ContentWrapper';
import { IRREVERSIBLE_ACTION, PRIMARY, WHITE } from '../../constants/colors';
import LinearProgressModal from '../common/LinearProgressModal';
import { BE_ROUTES } from '../../constants/routes';
import postCreatorSchema from '../../schemas/postCreatorSchema';

const isNewImage = (image) => image instanceof File;

function Posts({ title, forms, form, setForm, posts, setPosts }) {
  const [openForm, setOpenForm] = useState(false);
  const [action, setAction] = useState('update');
  const [openDialog, setOpenDialog] = useState(false);
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);

  const handleClose = () => setOpenDialog(false);

  const { setValue, getValues, reset, ...methods } = useForm({
    resolver: joiResolver(postCreatorSchema),
    defaultValues: { type: '' },
  });

  const setFormValues = (post) => {
    Object.entries(post).forEach(([k, v]) => {
      setValue(k, v);
    });
  };

  const setForUpdate = (post) => {
    setAction('update');
    if (post) {
      setFormValues(post);
      setOpenForm(true);
    }
  };

  const setForDelete = (post) => {
    setAction('delete');
    if (post) {
      setFormValues(post);
      setOpenDialog(true);
    }
  };

  const updatePost = async () => {
    try {
      setIsLinearProgressModalOpen(true);
      const updatedPost = getValues();

      if (updatedPost && updatedPost.id) {
        const idx = posts.findIndex((p) => p.id === updatedPost.id);

        if (idx !== -1) {
          const fd = new FormData();
          const { images, ...rest } = updatedPost.content;
          const filledContentFields = {};

          Object.entries(rest).forEach(([k, v]) => { if (v) filledContentFields[k] = v; });

          if (images) {
            const oldImages = [];
            (images ?? []).forEach((image) => {
              if (isNewImage(image)) {
                if (image.preview) {
                  URL.revokeObjectURL(image.preview);
                }
                fd.append('image', image);
              } else {
                oldImages.push(image);
              }
            });
            fd.append('oldImages', JSON.stringify(oldImages));
          }

          fd.append('content', JSON.stringify(filledContentFields));
          fd.append('topics', JSON.stringify(updatedPost.topics));

          const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.POSTS}/${updatedPost.id}`;
          const response = await fetch(url, { method: 'PUT', body: fd, credentials: 'include' });
          const result = await response.json();

          if (result?.status === 'fail') {
            toast.error(result.message);
          } else {
            const newPosts = [...posts];
            newPosts[idx] = { ...result, type: updatedPost.type };
            setPosts(newPosts);
            setOpenForm(false);
            reset();
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOpenDialog(false);
      setIsLinearProgressModalOpen(false);
    }
  };

  const deletePost = async () => {
    try {
      const selectedPost = getValues();

      if (selectedPost && selectedPost.type && selectedPost.id) {
        setIsLinearProgressModalOpen(true);
        const idx = posts.findIndex((p) => p.id === selectedPost.id);

        if (idx !== -1) {
          const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.POSTS}/${selectedPost.id}`;

          const response = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            method: 'DELETE',
            credentials: 'include',
          });
          const result = response.json();

          console.log(result.message);
          const newPosts = [...posts];
          newPosts.splice(idx, 1);
          setPosts(newPosts);
          setOpenDialog(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLinearProgressModalOpen(false);
    }
  };

  const handleConfirm = () => {
    if (action === 'update') {
      updatePost();
    } else if (action === 'delete') {
      deletePost();
    }
  };

  const getFormByType = (selectedType) => {
    if (forms && Array.isArray(forms) && forms.length) {
      return forms.find((f) => f.type === selectedType);
    }
    if (form) {
      return form;
    }
    return {};
  };

  return (
    <LinearProgressModal isOpen={isLinearProgressModalOpen}>
      <ContentWrapper title={title}>
        {Array.isArray(posts) && posts.length ? (
          posts.map((p) => (
            <Post
              key={p.id}
              showType
              editable
              content={getFormByType(p.type)?.content ?? {}}
              post={p}
              onClickUpdate={() => setForUpdate(p)}
              onClickDelete={() => setForDelete(p)}
            />
          ))) : null}
      </ContentWrapper>
      <FormProvider {...methods} getValues={getValues}>
        <PostCreator
          form={getFormByType(getValues('type'))}
          setForm={setForm}
          title="Update Post"
          btnTitle="update"
          open={openForm}
          setOpen={setOpenForm}
          onSubmit={() => setOpenDialog(true)}
        />
      </FormProvider>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure you want to ${action} the post?`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            style={{
              backgroundColor: action === 'update' ? PRIMARY : IRREVERSIBLE_ACTION,
              color: WHITE,
            }}
            autoFocus
          >
            {action}
          </Button>
        </DialogActions>
      </Dialog>
    </LinearProgressModal>
  );
}

export default Posts;
