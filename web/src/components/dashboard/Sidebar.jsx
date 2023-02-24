import { useEffect, useState } from 'react';
import {
  makeStyles,
  List,
  ListItem,
  ListItemText,
  Button,
  ListItemIcon,
} from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import BookmarkBorder from '@material-ui/icons/BookmarkBorder';
import Bookmark from '@material-ui/icons/Bookmark';
import { toast } from 'react-toastify';
import { GRAY2, GRAY3, PRIMARY, WHITE } from '../../constants/colors';
import { sidebarWidth, topbarHeight } from '../../constants/styles';
import PostBuilder from '../post/PostBuilder';
import LinearProgressModal from '../common/LinearProgressModal';
import FORM_COMPONENT_TYPES from '../../constants/form-components-types';
import { BE_ROUTES } from '../../constants/routes';
import getFormTypes from '../../api/getFormTypes';
import FormBuilder from '../form/FormBuilder';

const useStyles = makeStyles((theme) => ({
  sidebar: {
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  sidebarContainer: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: topbarHeight,
    height: `calc(100% - ${topbarHeight}px)`,
    width: sidebarWidth,
    backgroundColor: WHITE,
    borderRight: `1px solid ${GRAY3}`,
  },
  createButton: {
    margin: theme.spacing(1, 2),
    padding: theme.spacing(1, 0),
  },
  sidebarBottomContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const SidebarItem = ({ text }) => {
  const location = useLocation();

  const isActiveRoute = () => location.pathname === `/posts/${text}`;

  return (
    <ListItem
      button
      style={{
        color: isActiveRoute() ? PRIMARY : GRAY2,
        backgroundColor: isActiveRoute() ? 'rgba(20, 99, 255, 0.1)' : WHITE,
      }}
      component={Link}
      key={text}
      to={`/posts/${text}`}
    >
      <ListItemIcon
        style={{
          fontSize: 14,
          minWidth: '40px',
          color: isActiveRoute() ? PRIMARY : GRAY2,
        }}
      >
        {isActiveRoute() ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
};

const SidebarItemList = ({ sidebarItems }) => (
  <List>
    {sidebarItems.map((sidebarItem) => (
      <SidebarItem
        key={sidebarItem.id}
        text={sidebarItem.type}
      />
    ))}
  </List>
);

const Sidebar = ({ isSidebarOpen }) => {
  const classes = useStyles();

  const [isPostBuilderOpen, setIsPostBuilderOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);
  const [form, setForm] = useState({});

  const { reset, getValues, watch, ...methods } = useForm({ defaultValues: { type: '' } });
  const watchedType = watch('type');

  const onClickCreatePost = () => setIsPostBuilderOpen(true);

  const [sidebarItems, setSidebarItems] = useState([]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      const initializeFormTypes = async () => {
        const result = await getFormTypes();
        setSidebarItems(result);
      };
      initializeFormTypes();
    }

    return function cleanup() {
      isMounted = false;
    };
  }, []);

  const addPost = async () => {
    try {
      setIsLinearProgressModalOpen(true);
      const fd = new FormData();
      const { type, topics, ...dynamicFields } = getValues();
      const content = {};

      Object.entries(dynamicFields).forEach(([k, v]) => {
        if (form?.fields?.[k] === FORM_COMPONENT_TYPES.IMAGE) {
          (Array.isArray(v) ? v : []).forEach((image) => {
            if (image.preview) {
              // Revoke the data uri to avoid memory leaks
              URL.revokeObjectURL(image.preview);
            }
            fd.append('image', image);
          });
        } else {
          content[k] = v;
        }
      });

      fd.append('content', JSON.stringify(content));
      fd.append('type', JSON.stringify(type));
      fd.append('topics', JSON.stringify(topics));

      const response = await fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.POSTS}`, {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });
      const result = await response.json();
      console.log(result.status, result.message);

      if (result?.status === 'fail') {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        setIsPostBuilderOpen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLinearProgressModalOpen(false);
    }
  };

  const handleSubmit = () => {
    if (watchedType !== '') {
      addPost();
    }
  };

  return (
    <LinearProgressModal isOpen={isLinearProgressModalOpen}>
      <div
        className={classes.sidebarContainer}
        style={
          isSidebarOpen
            ? { display: 'flex' }
            : { display: 'none' }
        }
      >
        <div className={classes.sidebar}>
          <SidebarItemList sidebarItems={sidebarItems} />
        </div>
        <div className={classes.sidebarBottomContainer}>
          <Button
            className={classes.createButton}
            variant="contained"
            color="primary"
            fullWidth
            onClick={onClickCreatePost}
          >
            Create Post
          </Button>
        </div>
        <div className={classes.sidebarBottomContainer}>
          <Button
            className={classes.createButton}
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => setIsFormOpen(true)}
          >
            Create Form
          </Button>
        </div>
        <FormBuilder open={isFormOpen} setOpen={setIsFormOpen} setSidebarItems={setSidebarItems} />
        <FormProvider {...methods} getValues={getValues} watch={watch} reset={reset}>
          <PostBuilder
            form={form}
            setForm={setForm}
            title="Create Post"
            open={isPostBuilderOpen}
            setOpen={setIsPostBuilderOpen}
            onSubmit={handleSubmit}
            formTypes={sidebarItems}
          />
        </FormProvider>
      </div>
    </LinearProgressModal>
  );
};

export default Sidebar;
