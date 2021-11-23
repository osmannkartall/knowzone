import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Post from '../common/Post';
import ContentWrapper from '../common/ContentWrapper';
import LinearProgressModal from '../common/LinearProgressModal';
import { BE_ROUTES } from '../constants/routes';

const SearchResults = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.SEARCH_FILTER}`;
    const { from, ...body } = location.state;

    setIsLinearProgressModalOpen(true);

    fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(body),
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        if (mounted) {
          setPosts(data);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        if (mounted) {
          setIsLinearProgressModalOpen(false);
        }
      });

    return function cleanup() {
      mounted = false;
    };
  }, [location.state]);

  return (
    <LinearProgressModal isOpen={isLinearProgressModalOpen}>
      <ContentWrapper title="Search Results">
        {Array.isArray(posts) && posts.length ? (
          posts.map((p) => (
            <Post
              key={p.id}
              showType
              type={p.error || p.solution ? 'bugfix' : 'tip'}
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
            />
          ))) : null}
      </ContentWrapper>
    </LinearProgressModal>
  );
};

export default SearchResults;
