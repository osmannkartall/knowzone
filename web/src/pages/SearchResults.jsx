import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, styled } from '@mui/material';
import Post from '../components/post/Post';
import ContentWrapper from '../components/common/ContentWrapper';
import LinearProgressModal from '../components/common/LinearProgressModal';
import getSearchResults from '../api/search/getSearchResults';

const LoadMoreContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

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
  const [formsAndPosts, setFormsAndPosts] = useState({});
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);
  const [cursor, setCursor] = useState({ hasNext: true, next: null });
  const { forms, posts } = formsAndPosts;
  const { from, ...body } = location.state ?? {};

  useEffect(() => {
    let mounted = true;

    const fetchResults = async () => {
      if (mounted) {
        setIsLinearProgressModalOpen(true);
        const searchResults = await getSearchResults(body);

        setFormsAndPosts({
          forms: searchResults?.forms ?? {},
          posts: searchResults?.postsResult?.records ?? [],
        });
        setCursor({
          hasNext: searchResults?.postsResult?.hasNext,
          next: searchResults?.postsResult?.next,
        });

        setIsLinearProgressModalOpen(false);
      }
    };

    fetchResults();

    return function cleanup() {
      mounted = false;
    };
  }, [location.state]);

  const getNextPage = async () => {
    const nextPage = await getSearchResults(body, cursor?.next);
    setFormsAndPosts(
      {
        posts: [...posts, ...(nextPage?.postsResult?.records ?? [])],
        forms: { ...forms, ...nextPage?.forms },
      },
    );
    setCursor({ hasNext: nextPage?.postsResult?.hasNext, next: nextPage?.postsResult?.next });
  };

  return (
    <LinearProgressModal isOpen={isLinearProgressModalOpen}>
      <ContentWrapper Header={<h2>Search Results</h2>}>
        <p>{searchResultMessage(posts?.length)}</p>
        {Array.isArray(posts) && posts.length ? (
          posts.map((p) => (
            <Post
              key={p.id}
              showType
              content={(forms?.[p.type])?.content ?? {}}
              post={p}
            />
          ))) : null}
        {cursor?.hasNext && (
          <LoadMoreContainer>
            <Button
              variant="outlined"
              onClick={getNextPage}
            >
              Load More
            </Button>
          </LoadMoreContainer>
        )}
        {posts?.length && !cursor?.hasNext ? (
          <LoadMoreContainer>Retrieved all the posts</LoadMoreContainer>
        ) : null}
      </ContentWrapper>
    </LinearProgressModal>
  );
}

export default SearchResults;
