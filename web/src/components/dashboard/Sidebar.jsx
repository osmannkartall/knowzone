import { useLayoutEffect, useState, useRef, useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { List, ListItemText, Button, ListItemIcon, ListItemButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import BookmarkBorder from '@mui/icons-material/BookmarkBorder';
import Bookmark from '@mui/icons-material/Bookmark';
import { toast } from 'react-toastify';
import { useVirtualizer } from '@tanstack/react-virtual';
import { GRAY2, GRAY3, PRIMARY, WHITE } from '../../constants/colors';
import STYLES from '../../constants/styles';
import LinearProgressModal from '../common/LinearProgressModal';
import FormCreator from '../form/FormCreator';
import createForm from '../../api/forms/createForm';
import FORM_COMPONENT_TYPES from '../form/formComponentTypes';
import usePagination from '../../hooks/usePagination';
import { BE_ROUTES, FE_ROUTES } from '../../constants/routes';
import FetchResult from '../common/FetchResult';

const PREFIX = 'Sidebar';

const classes = {
  sidebar: `${PREFIX}-sidebar`,
  sidebarContainer: `${PREFIX}-sidebarContainer`,
  sidebarBottomContainer: `${PREFIX}-sidebarBottomContainer`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.sidebar}`]: {
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    borderBottom: `1px solid ${GRAY3}`,
    padding: theme.spacing(2),
    paddingBottom: 0,
  },

  [`& .${classes.sidebarContainer}`]: {
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    [theme.breakpoints.down('md')]: {
      position: 'fixed',
      zIndex: 1000,
    },
    top: STYLES.TOPBAR_HEIGHT + 1,
    height: `calc(100vh - ${STYLES.TOPBAR_HEIGHT + 1}px)`,
    width: STYLES.SIDEBAR_WIDTH,
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

function SidebarItem({ type }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveRoute = () => (
    decodeURIComponent(location.pathname.replace(/\+/g, ' ')) === `/${FE_ROUTES.POSTS}/${type?.id}`
  );

  return (
    <ListItemButton
      selected={isActiveRoute()}
      onClick={() => navigate(`/${FE_ROUTES.POSTS}/${type?.id}`, { state: { type } })}
      key={type?.id}
      sx={{ borderRadius: 2 }}
    >
      <ListItemIcon
        style={{
          fontSize: 14,
          minWidth: '32px',
          color: isActiveRoute() ? PRIMARY : GRAY2,
        }}
      >
        {isActiveRoute() ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
      </ListItemIcon>
      <ListItemText
        primary={type?.name}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          color: isActiveRoute() ? PRIMARY : GRAY2,
        }}
      />
    </ListItemButton>
  );
}

function Sidebar({ isSidebarOpen, handleIsSidebarOpen }) {
  const [isFormCreatorOpen, setIsFormCreatorOpen] = useState(false);
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);
  const prevSidebarWidth = useRef(null);

  const { data, setData, getNextPage, status, errorMessage } = usePagination({
    url: `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.FORMS}/filter`,
    method: 'POST',
    body: { projection: { type: 1 } },
  });

  const memoizedHandleIsSidebarOpen = useCallback((sidebarStatus) => {
    handleIsSidebarOpen(sidebarStatus);
  }, [handleIsSidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (prevSidebarWidth.current === window.innerWidth) {
        return;
      }
      if (window.innerWidth < STYLES.md) {
        memoizedHandleIsSidebarOpen(false);
      } else {
        memoizedHandleIsSidebarOpen(true);
      }
      prevSidebarWidth.current = window.innerWidth;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [memoizedHandleIsSidebarOpen]);

  const parentRef = useRef(null);

  const parentOffsetRef = useRef(0);

  useLayoutEffect(() => { parentOffsetRef.current = parentRef.current?.offsetTop ?? 0; }, []);

  const virtualizer = useVirtualizer({
    count: data?.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

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
        setData((prev) => [{ type: result.type }, ...prev]);
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

  const handleOnClickShowMore = () => getNextPage();

  return (
    isSidebarOpen && (
      <LinearProgressModal isOpen={isLinearProgressModalOpen}>
        <Root>
          <div className={classes.sidebarContainer}>
            <div className={classes.sidebar}>
              <List disablePadding>
                <div ref={parentRef}>
                  <div
                    style={{
                      height: `${virtualizer.getTotalSize()}px`,
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    {virtualizer.getVirtualItems().map((virtualRow) => (
                      <div
                        key={virtualRow.index}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <SidebarItem type={data?.[virtualRow.index].type} />
                      </div>
                    ))}
                  </div>
                </div>
              </List>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: `${STYLES.MUI_SPACING_UNIT}px 0px`,
                }}
              >
                <FetchResult
                  status={status}
                  errorMessage={errorMessage}
                  handleOnClickShowMore={handleOnClickShowMore}
                />
              </div>
            </div>
            <div className={classes.sidebarBottomContainer}>
              <Button
                className={classes.createButton}
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => setIsFormCreatorOpen(true)}
                startIcon={<Bookmark fontSize="small" />}
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
    )
  );
}

export default Sidebar;
