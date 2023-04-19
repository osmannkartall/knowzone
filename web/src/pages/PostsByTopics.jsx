import { useParams } from 'react-router-dom';
import TagIcon from '@mui/icons-material/Tag';
import { BE_ROUTES } from '../constants/routes';
import usePagination from '../hooks/usePagination';
import Posts from '../components/post/Posts';

function PostsByTopics() {
  const { topic } = useParams();

  const { data, getNextPage, status, errorMessage } = usePagination({
    url: `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.TOPICS}`,
    method: 'POST',
    body: { topics: [topic] },
  });

  const { forms, posts } = data ?? {};

  return (
    <Posts
      errorMessage={errorMessage}
      forms={forms}
      getNextPage={getNextPage}
      LeftHeader={(
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TagIcon sx={{ fontSize: 40 }} />
          <h2>{topic}</h2>
        </div>
      )}
      posts={posts}
      status={status}
    />
  );
}

export default PostsByTopics;
