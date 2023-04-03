import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { List, ListItem, ListItemText, Button, ListItemIcon } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import BookmarkBorder from '@mui/icons-material/BookmarkBorder';
import Bookmark from '@mui/icons-material/Bookmark';
import { toast } from 'react-toastify';
import { GRAY2, GRAY3, PRIMARY, WHITE } from '../../constants/colors';
import { sidebarWidth, topbarHeight } from '../../constants/styles';
import LinearProgressModal from '../common/LinearProgressModal';
import getFormTypes from '../../api/forms/getFormTypes';
import FormCreator from '../form/FormCreator';
import createForm from '../../api/forms/createForm';
import FORM_COMPONENT_TYPES from '../form/formComponentTypes';

const PREFIX = 'Sidebar';

const classes = {
  sidebar: `${PREFIX}-sidebar`,
  sidebarContainer: `${PREFIX}-sidebarContainer`,
  sidebarBottomContainer: `${PREFIX}-sidebarBottomContainer`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.sidebar}`]: {
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
  },

  [`& .${classes.sidebarContainer}`]: {
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

  [`& .${classes.sidebarBottomContainer}`]: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(1, 2),
    padding: theme.spacing(1, 0),
  },
}));

function SidebarItem({ text }) {
  const location = useLocation();

  const isActiveRoute = () => (
    decodeURIComponent(location.pathname.replace(/\+/g, ' ')) === `/posts/${text}`
  );

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
}

function SidebarItemList({ sidebarItems }) {
  return (
    <List>
      {(sidebarItems ?? []).map((sidebarItem) => (
        <SidebarItem
          key={sidebarItem.id}
          text={sidebarItem.type}
        />
      ))}
    </List>
  );
}

function Sidebar({ isSidebarOpen }) {
  const [isFormCreatorOpen, setIsFormCreatorOpen] = useState(false);
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);
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

  const addForm = async (values) => {
    let isAddFormSuccessful = false;

    try {
      setIsLinearProgressModalOpen(true);

      const { type, content } = values;
      const newForm = { type, content: {} };

      Object.values(content).forEach((fs) => {
        if (fs.type === FORM_COMPONENT_TYPES.IMAGE) {
          newForm.content.images = FORM_COMPONENT_TYPES.IMAGE;
        } else if (fs.name && fs.type) {
          newForm.content[fs.name.toString()] = fs.type;
        }
      });

      const result = await createForm(newForm);

      if (result?.status === 'fail') {
        toast.error(result?.message);
      } else {
        setIsFormCreatorOpen(false);
        setSidebarItems((prev) => [{ id: type, type }, ...prev]);
        isAddFormSuccessful = true;
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message);
    } finally {
      setIsLinearProgressModalOpen(false);
    }

    return isAddFormSuccessful;
  };

  return (
    <LinearProgressModal isOpen={isLinearProgressModalOpen}>
      <Root>
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
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => setIsFormCreatorOpen(true)}
            >
              Create Form
            </Button>
          </div>
          {isFormCreatorOpen && (
            <FormCreator
              open={isFormCreatorOpen}
              setOpen={setIsFormCreatorOpen}
              handler={addForm}
            />
          )}
        </div>
      </Root>
    </LinearProgressModal>
  );
}

export default Sidebar;
