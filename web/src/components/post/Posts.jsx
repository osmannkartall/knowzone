import { useState } from 'react';
import { Dialog, DialogActions, DialogTitle, Button } from '@material-ui/core';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Post from './Post';
import PostBuilder from './PostBuilder';
import { getChangesInObject, isObjectNotEmptyAndValid, areObjectsEqual } from '../../utils';
import ContentWrapper from '../common/ContentWrapper';
import { IRREVERSIBLE_ACTION, PRIMARY, WHITE } from '../../constants/colors';
import LinearProgressModal from '../common/LinearProgressModal';
import FORM_COMPONENT_TYPES from '../../constants/form-components-types';
import { BE_ROUTES } from '../../constants/routes';

const isNewImage = (image) => image instanceof File;

const Posts = ({ title, forms, form, setForm, posts, setPosts }) => {
  const [openForm, setOpenForm] = useState(false);
  const [action, setAction] = useState('update');
  const [openDialog, setOpenDialog] = useState(false);
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);

  const handleClose = () => setOpenDialog(false);

  const { setValue, getValues, ...methods } = useForm({ defaultValues: { type: '' } });

  const setFormValues = (post) => {
    Object.entries(post).forEach(([k, v]) => {
      if (k === 'content') {
        Object.entries(post.content).forEach(([k2, v2]) => {
          setValue(k2, v2);
        });
      } else {
        setValue(k, v);
      }
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

  const flattenOldPost = (oldPost) => {
    const { content, ...flattenedOldPost } = { ...oldPost, ...oldPost.content };
    return flattenedOldPost;
  };

  const updatePost = async () => {
    try {
      setIsLinearProgressModalOpen(true);
      const updatedPost = getValues();

      if (updatedPost && updatedPost.id) {
        const idx = posts.findIndex((p) => p.id === updatedPost.id);

        if (idx !== -1 && !areObjectsEqual(updatedPost, posts[idx])) {
          const flattenedOldPost = flattenOldPost(posts[idx]);
          const {
            updatedAt,
            type,
            createdAt,
            ...changes
          } = getChangesInObject(flattenedOldPost, updatedPost);
          const content = {};

          if (isObjectNotEmptyAndValid(changes)) {
            const fd = new FormData();

            Object.entries(changes).forEach(([k, v]) => {
              if (form?.fields?.[k] === FORM_COMPONENT_TYPES.IMAGE) {
                const oldImages = [];
                (v ?? []).forEach((image) => {
                  if (isNewImage(image)) {
                    if (image.preview) {
                      // Revoke the data uri to avoid memory leaks
                      URL.revokeObjectURL(image.preview);
                    }
                    fd.append('image', image);
                  } else {
                    oldImages.push(image);
                  }
                });
                fd.append('oldImages', JSON.stringify(oldImages));
              } else if (k === 'topics') {
                fd.append('topics', JSON.stringify(v));
              } else {
                content[k] = v;
              }
            });

            if (isObjectNotEmptyAndValid(content)) {
              fd.append('content', JSON.stringify(content));
            }

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
            }
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
              fields={getFormByType(p.type)?.fields ?? {}}
              post={p}
              onClickUpdate={() => setForUpdate(p)}
              onClickDelete={() => setForDelete(p)}
            />
          ))) : null}
      </ContentWrapper>
      <FormProvider {...methods} getValues={getValues}>
        <PostBuilder
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
};

export default Posts;
