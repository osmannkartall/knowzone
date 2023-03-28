import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Post from '../components/post/Post';
import ContentWrapper from '../components/common/ContentWrapper';
import LinearProgressModal from '../components/common/LinearProgressModal';
import { BE_ROUTES } from '../constants/routes';

const searchResultMessage = (length) => {
  if (!length) {
    return 'No results found matching your search.';
  }

  if (length === 1) {
    return `${length} post`;
  }

  return `${length} posts`;
};

function SearchResults() {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [forms, setForms] = useState([]);
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const url = `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.SEARCH}`;
    const { from, ...body } = location.state ?? {};

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
          setPosts(data?.posts);
          setForms(data?.forms);
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
        <p>{searchResultMessage(posts?.length)}</p>
        {Array.isArray(posts) && posts.length ? (
          posts.map((p) => (
            <Post
              key={p.id}
              showType
              content={(forms ?? []).find((f) => f.type === p.type)?.content ?? {}}
              post={p}
            />
          ))) : null}
      </ContentWrapper>
    </LinearProgressModal>
  );
}

export default SearchResults;
