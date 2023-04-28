import { Button, Divider, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { GRAY1, GRAY3, WHITE } from '../../constants/colors';
import usePagination from '../../hooks/usePagination';
import { BE_ROUTES, FE_ROUTES } from '../../constants/routes';
import PopularTopics from './PopularTopics';
import STYLES from '../../constants/styles';

const Container = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: STYLES.TOPBAR_HEIGHT + STYLES.MUI_SPACING_UNIT + 1,
  border: `1px solid ${GRAY3}`,
  borderRadius: 4,
  backgroundColor: WHITE,
  height: `calc(100vh - ${STYLES.TOPBAR_HEIGHT + STYLES.MUI_SPACING_UNIT * 2 + 3}px)`,
  overflowY: 'auto',
  marginRight: theme.spacing(2),
}));

const InnerContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

const MAX_NUM_POST = 4;

function ExploreSideContent() {
  const { data } = usePagination({
    url: `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.SEARCH}`,
    method: 'POST',
    body: {},
  });
  const { forms, posts } = data ?? {};
  const navigate = useNavigate();

  return (
    <Container>
      <InnerContainer>
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: 18 }}>Latest Posts</div>
          </div>
          {(posts ?? []).slice(0, MAX_NUM_POST).map((post, index) => (
            <div key={post.id} style={{ margin: '24px 0px' }}>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div>
                  <PostAddIcon fontSize="small" />
                </div>
                <div
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    marginLeft: 8,
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>
                    <Link
                      component={RouterLink}
                      to={`/${FE_ROUTES.POSTS}/share/${post.type?.id}`}
                      state={{
                        preFetchedPost: posts[index],
                        preFetchedForm: forms[post.type?.id],
                      }}
                      underline="hover"
                      color={GRAY1}
                    >
                      {post.type?.name}
                    </Link>
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    <Link
                      component={RouterLink}
                      to={`/${FE_ROUTES.HOME}`}
                      state={{ type: post.type }}
                      underline="hover"
                      color={GRAY1}
                    >
                      @
                      {post.owner.username}
                    </Link>
                  </div>
                </div>
              </div>
              {index + 1 < MAX_NUM_POST ? <Divider style={{ margin: '24px 0px' }} /> : null}
            </div>
          ))}
          <Button
            fullWidth
            onClick={() => navigate(`/${FE_ROUTES.EXPLORE}`)}
            endIcon={<ArrowForwardIcon />}
          >
            Show More
          </Button>
        </div>
      </InnerContainer>
      <InnerContainer>
        <PopularTopics />
      </InnerContainer>
    </Container>
  );
}

export default ExploreSideContent;
