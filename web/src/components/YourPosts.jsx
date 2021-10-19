import React, { useState, useEffect, useContext } from 'react';
import { Dialog, DialogActions, DialogTitle, Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import Post from '../common/Post';
import { AuthContext } from '../contexts/AuthContext';
import PostForm from '../common/PostForm';
import POST_TYPES from '../constants/post-types';
import {
  createFile,
  getChangesInObject,
  isObjectEmptyOrNotValid,
  areObjectsEqual,
} from '../utils';
import { BE_ROUTES } from '../constants/routes';
import ContentWrapper from '../common/ContentWrapper';
import { IRREVERSIBLE_ACTION, PRIMARY, WHITE } from '../constants/colors';

const YourPosts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [action, setAction] = useState('update');
  const [openDialog, setOpenDialog] = useState(false);
  const [user] = useContext(AuthContext);

  const handleClose = () => setOpenDialog(false);

  const handleChangeForm = (key, value) => {
    setSelectedPost((prevState) => ({ ...prevState, [key]: value }));
  };

  const setForUpdate = (post) => {
    setAction('update');
    if (post) {
      setSelectedPost({ ...post });
      setOpenForm(true);
    }
  };

  const setForDelete = (post) => {
    setAction('delete');
    if (post) {
      setSelectedPost({ ...post });
      setOpenDialog(true);
    }
  };

  const updatePost = async () => {
    try {
      if (selectedPost && selectedPost.id) {
        const idx = posts.findIndex((p) => p.id === selectedPost.id);
        if (idx !== -1 && !areObjectsEqual(selectedPost, posts[idx])) {
          const changes = getChangesInObject(posts[idx], selectedPost);
          const { route } = POST_TYPES.get(selectedPost.type);

          if (!isObjectEmptyOrNotValid(changes)) {
            const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${route}/${selectedPost.id}`;
            const fd = new FormData();
            changes.saveImage = changes.images !== undefined;

            Object.entries(changes).forEach(([k, v]) => {
              if (k === 'images') {
                v.forEach((image) => {
                  let imageObject = image;
                  if (!(image instanceof File)) {
                    imageObject = createFile(image);
                  }
                  fd.append('image', imageObject);
                });
              } else {
                fd.append(k, JSON.stringify(v));
              }
            });

            const response = await fetch(url, { method: 'PUT', body: fd });
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
    }
  };

  const deletePost = () => {
    if (selectedPost && selectedPost.type && selectedPost.id) {
      const { route } = POST_TYPES.get(selectedPost.type);
      const idx = posts.findIndex((p) => p.id === selectedPost.id);

      if (idx !== -1) {
        const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${route}/${selectedPost.id}`;

        fetch(url, {
          headers: { 'Content-Type': 'application/json' },
          method: 'DELETE',
        })
          .then((res) => res.json())
          .then(
            (result) => {
              console.log(result.message);
              const newPosts = [...posts];
              newPosts.splice(idx, 1);
              setPosts(newPosts);
              setOpenDialog(false);
            },
            (error) => {
              console.log(error.message);
            },
          );
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

    fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.SEARCH}?owner=${user.id}`)
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

    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <>
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
      <PostForm
        title="Update Post"
        btnTitle="update"
        open={openForm}
        setOpen={setOpenForm}
        form={selectedPost}
        handleChangeForm={handleChangeForm}
        onClickBtn={() => setOpenDialog(true)}
      />
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
    </>
  );
};

export default YourPosts;
