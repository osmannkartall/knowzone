import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogTitle, Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Post from '../common/Post';
import { useAuthState } from '../contexts/AuthContext';
import PostForm from '../common/PostForm';
import POST_TYPES from '../constants/post-types';
import {
  getChangesInObject,
  isObjectEmptyOrNotValid,
  areObjectsEqual,
} from '../utils';
import { BE_ROUTES } from '../constants/routes';
import ContentWrapper from '../common/ContentWrapper';
import { IRREVERSIBLE_ACTION, PRIMARY, WHITE } from '../constants/colors';
import LinearProgressModal from '../common/LinearProgressModal';
import postFormSchema from '../common/postFormSchema';

const isNewImage = (image) => image instanceof File;

const YourPosts = () => {
  const [posts, setPosts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [action, setAction] = useState('update');
  const [openDialog, setOpenDialog] = useState(false);
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);
  const user = useAuthState();

  const handleClose = () => setOpenDialog(false);

  const { setValue, getValues, ...methods } = useForm({
    resolver: yupResolver(postFormSchema),
    defaultValues: {
      type: POST_TYPES.get('tip').value,
      description: '',
      topics: [],
      links: [],
      images: [],
    },
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
      const selectedPost = getValues();

      if (selectedPost && selectedPost.id) {
        const idx = posts.findIndex((p) => p.id === selectedPost.id);

        if (idx !== -1 && !areObjectsEqual(selectedPost, posts[idx])) {
          const changes = getChangesInObject(posts[idx], selectedPost);
          const { route } = POST_TYPES.get(selectedPost.type);

          if (!isObjectEmptyOrNotValid(changes)) {
            const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${route}/${selectedPost.id}`;
            const fd = new FormData();

            Object.entries(changes).forEach(([k, v]) => {
              if (k === 'images') {
                const oldImages = [];
                v.forEach((image) => {
                  if (isNewImage(image)) {
                    fd.append('image', image);
                  } else {
                    oldImages.push(image);
                  }
                });
                fd.append('oldImages', JSON.stringify(oldImages));
              } else {
                fd.append(k, JSON.stringify(v));
              }
            });

            const response = await fetch(url, { method: 'PUT', body: fd, credentials: 'include' });
            const result = await response.json();
            const newPosts = [...posts];
            newPosts[idx] = { ...result, type: selectedPost.type };
            setPosts(newPosts);
          }
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOpenForm(false);
      setOpenDialog(false);
      setIsLinearProgressModalOpen(false);
    }
  };

  const deletePost = () => {
    const selectedPost = getValues();

    if (selectedPost && selectedPost.type && selectedPost.id) {
      setIsLinearProgressModalOpen(true);
      const { route } = POST_TYPES.get(selectedPost.type);
      const idx = posts.findIndex((p) => p.id === selectedPost.id);

      if (idx !== -1) {
        const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${route}/${selectedPost.id}`;

        fetch(url, {
          headers: { 'Content-Type': 'application/json' },
          method: 'DELETE',
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((result) => {
            console.log(result.message);
            const newPosts = [...posts];
            newPosts.splice(idx, 1);
            setPosts(newPosts);
            setOpenDialog(false);
          })
          .catch((error) => console.log(error.message))
          .finally(() => setIsLinearProgressModalOpen(false));
      }
    }
  };

  const handleConfirm = () => {
    if (action === 'update') {
      updatePost();
    } else if (action === 'delete') {
      deletePost();
    }
  };

  useEffect(() => {
    let mounted = true;

    function getPosts() {
      fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.SEARCH}?owner=${user.id}`, {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then(
          (data) => {
            if (mounted) {
              setPosts(data);
            }
          },
          (error) => {
            console.log(error.message);
          },
        );
    }

    getPosts();

    return function cleanup() {
      mounted = false;
    };
  }, [user.id]);

  return (
    <LinearProgressModal isOpen={isLinearProgressModalOpen}>
      <ContentWrapper title="Your Posts">
        {Array.isArray(posts) && posts.length ? (
          posts.map((p) => (
            <Post
              key={p.id}
              showType
              editable
              type={p.type}
              owner={p.owner}
              content={{
                links: p.links,
                images: p.images,
                lastModifiedDate: p.updatedAt,
                insertDate: p.createdAt,
                topics: p.topics,
                description: p.description,
                error: p.error,
                solution: p.solution,
              }}
              onClickUpdate={() => setForUpdate(p)}
              onClickDelete={() => setForDelete(p)}
            />
          ))) : null}
      </ContentWrapper>
      <FormProvider {...methods} getValues={getValues}>
        <PostForm
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

export default YourPosts;
