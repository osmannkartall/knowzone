import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete'; import { toast } from 'react-toastify';
import PostCreator from '../components/post/PostCreator';
import { IRREVERSIBLE_ACTION } from '../constants/colors';
import LinearProgressModal from '../components/common/LinearProgressModal';
import { BE_ROUTES, FE_ROUTES } from '../constants/routes';
import { removeNumericKeyPrefix } from '../components/post/postCreatorUtils';
import getFormByType from '../api/forms/getFormByType';
import usePagination from '../hooks/usePagination';
import Posts from '../components/post/Posts';
import ConfirmDialog from '../components/common/ConfirmDialog';

const isNewImage = (image) => image instanceof File;

function PostsByOwner() {
  const [form, setForm] = useState({});
  const [openForUpdate, setOpenForUpdate] = useState(false);
  const [openForAdd, setOpenForAdd] = useState(false);
  const [openPostDeleteDialog, setOpenPostDeleteDialog] = useState(false);
  const [openFormDeleteDialog, setOpenFormDeleteDialog] = useState(false);
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { type } = useParams();

  const { data, setData, getNextPage, status, errorMessage } = usePagination({
    url: `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.POSTS}`,
    method: 'GET',
    queryParameters: { type },
  });

  const navigate = useNavigate();

  const deleteFormDialogTitle = 'Are you sure you want to delete the form?'
    + ' This will cause the deletion of all associated posts.';

  const deletePostDialogTitle = 'Are you sure you want to delete the post?';

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      const initialize = async () => {
        setForm(await getFormByType(type));
      };
      initialize();
    }

    return function cleanup() {
      isMounted = false;
    };
  }, [type]);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);

  const handleCloseMenu = () => setAnchorEl(null);

  const handlePostDeleteCancel = () => setOpenPostDeleteDialog(false);

  const handleFormDeleteDialogCancel = () => setOpenFormDeleteDialog(false);

  const setForUpdate = (post) => {
    if (post) {
      setSelectedPost(post);
      setOpenForUpdate(true);
    }
  };

  const setForDelete = (post) => {
    if (post) {
      setSelectedPost(post);
      setOpenPostDeleteDialog(true);
    }
  };

  const updatePost = async (values) => {
    let isUpdatePostSuccessful = false;
    setIsLinearProgressModalOpen(true);

    try {
      const { id, content, topics } = values ?? {};

      if (id) {
        const idx = data.findIndex((p) => p.id === id);

        if (idx !== -1) {
          const fd = new FormData();
          const { images, ...rest } = removeNumericKeyPrefix(content);

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

          fd.append('content', JSON.stringify(rest));
          fd.append('topics', JSON.stringify(topics));

          const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.POSTS}/${id}`;
          const response = await fetch(url, { method: 'PUT', body: fd, credentials: 'include' });
          const result = await response.json();

          if (result?.status === 'fail') {
            toast.error(result.message);
          } else {
            const newPosts = [...data];
            newPosts[idx] = { ...result, type };
            setData(newPosts);
            setOpenForUpdate(false);

            isUpdatePostSuccessful = true;
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOpenPostDeleteDialog(false);
      setIsLinearProgressModalOpen(false);
    }

    return isUpdatePostSuccessful;
  };

  const deletePost = async () => {
    setIsLinearProgressModalOpen(true);

    try {
      if (selectedPost?.id) {
        const idx = data.findIndex((p) => p.id === selectedPost.id);

        if (idx !== -1) {
          const response = await fetch(
            `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.POSTS}/${selectedPost?.id}`,
            {
              headers: { 'Content-Type': 'application/json' },
              method: 'DELETE',
              credentials: 'include',
            },
          );
          const result = await response.json();

          console.log(result.message);
          const newPosts = [...data];
          newPosts.splice(idx, 1);
          setData(newPosts);
          setOpenPostDeleteDialog(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLinearProgressModalOpen(false);
    }
  };

  const addPost = async (values) => {
    let isAddPostSuccessful = false;
    setIsLinearProgressModalOpen(true);

    try {
      if (values?.type !== '') {
        const fd = new FormData();
        const { topics, content } = values;
        const { images, ...rest } = removeNumericKeyPrefix(content);
        const filledContentFields = {};

        Object.entries(rest).forEach(([k, v]) => { if (v) filledContentFields[k] = v; });

        if (images) {
          (Array.isArray(images) ? images : []).forEach((image) => {
            if (image.preview) {
              URL.revokeObjectURL(image.preview);
            }
            fd.append('image', image);
          });
        }

        fd.append('content', JSON.stringify(filledContentFields));
        fd.append('type', JSON.stringify(type));
        fd.append('topics', JSON.stringify(topics));

        const response = await fetch(
          `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.POSTS}`,
          {
            method: 'POST',
            body: fd,
            credentials: 'include',
          },
        );
        const result = await response.json();

        if (result?.status === 'fail') {
          toast.error(result?.message);
        } else {
          setOpenForAdd(false);
          setData((prev) => [result, ...prev]);
          isAddPostSuccessful = true;
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message);
    } finally {
      setIsLinearProgressModalOpen(false);
    }

    return isAddPostSuccessful;
  };

  const deleteForm = async () => {
    setIsLinearProgressModalOpen(true);

    try {
      if (form) {
        const response = await fetch(
          `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}/${form?.id}`,
          {
            headers: { 'Content-Type': 'application/json' },
            method: 'DELETE',
            credentials: 'include',
          },
        );
        const result = await response.json();

        if (response.ok) {
          navigate(`/${FE_ROUTES.HOME}`);
          window.location.reload();
        } else {
          toast.error(result?.message);
        }
        setOpenFormDeleteDialog(false);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLinearProgressModalOpen(false);
    }
  };

  const handlePostDeleteConfirm = () => deletePost();

  const handleFormDeleteConfirm = () => deleteForm();

  return (
    <LinearProgressModal isOpen={isLinearProgressModalOpen}>
      <Posts
        editable
        errorMessage={errorMessage}
        form={form}
        getNextPage={getNextPage}
        LeftHeader={<h2>{type}</h2>}
        RightHeader={form ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpenForAdd(true)}
              size="small"
              style={{ height: 40 }}
            >
              Create Post
            </Button>
            <div style={{ marginLeft: '8px' }}>
              <IconButton
                aria-label="update post"
                aria-controls="post-menu"
                aria-haspopup="true"
                onClick={handleMenu}
                size="large"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="post-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={() => {
                  setOpenFormDeleteDialog(true);
                  handleCloseMenu();
                }}
                >
                  <ListItemIcon style={{ color: IRREVERSIBLE_ACTION }}>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText style={{ color: IRREVERSIBLE_ACTION }}>Delete Form</ListItemText>
                </MenuItem>
              </Menu>
            </div>
          </div>
        ) : null}
        onClickDelete={setForDelete}
        onClickUpdate={setForUpdate}
        posts={data}
        showType
        status={status}
      />
      {openForUpdate && (
        <PostCreator
          buttonTitle="update"
          open={openForUpdate}
          setOpen={setOpenForUpdate}
          handler={updatePost}
          form={form}
          oldPost={selectedPost}
        />
      )}
      {openForAdd && (
        <PostCreator
          buttonTitle="create"
          open={openForAdd}
          setOpen={setOpenForAdd}
          handler={addPost}
          form={form}
        />
      )}
      <ConfirmDialog
        open={openPostDeleteDialog}
        dialogTitle={deletePostDialogTitle}
        onClickCancel={handlePostDeleteCancel}
        onClickConfirm={handlePostDeleteConfirm}
        confirmButtonTitle="Delete"
      />
      <ConfirmDialog
        open={openFormDeleteDialog}
        dialogTitle={deleteFormDialogTitle}
        onClickCancel={handleFormDeleteDialogCancel}
        onClickConfirm={handleFormDeleteConfirm}
        confirmButtonTitle="Delete"
      />
    </LinearProgressModal>
  );
}

export default PostsByOwner;
