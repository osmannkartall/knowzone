import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Post from '../common/Post';
import ContentWrapper from '../common/ContentWrapper';
import LinearProgressModal from '../common/LinearProgressModal';

const SearchResults = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const route = 'search/filter';
    const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${route}`;

    setIsLinearProgressModalOpen(true);

    fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(location.state),
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
