import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Post from '../components/post/Post';
import ContentWrapper from '../components/common/ContentWrapper';
import LinearProgressModal from '../components/common/LinearProgressModal';
import getSearchResults from '../api/search/getSearchResults';
import ShowMore from '../components/common/ShowMore';

const searchResultMessage = (posts) => {
  if (!posts) {
    return null;
  }

  if (!posts.length) {
    return 'No results found matching your search.';
  }

  if (posts.length === 1) {
    return '1 post';
  }

  return `${posts.length} posts`;
};

function SearchResults() {
  const location = useLocation();
  const [formsAndPosts, setFormsAndPosts] = useState({});
  const [isLinearProgressModalOpen, setIsLinearProgressModalOpen] = useState(false);
  const [page, setPage] = useState({ hasNext: true, cursor: null });
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
        setPage({
          hasNext: searchResults?.postsResult?.hasNext,
          cursor: searchResults?.postsResult?.next,
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
    const nextPage = await getSearchResults(body, page?.cursor);
    setFormsAndPosts(
      {
        posts: [...posts, ...(nextPage?.postsResult?.records ?? [])],
        forms: { ...forms, ...nextPage?.forms },
      },
    );
    setPage({ hasNext: nextPage?.postsResult?.hasNext, cursor: nextPage?.postsResult?.cursor });
  };

  return (
    <LinearProgressModal isOpen={isLinearProgressModalOpen}>
      <ContentWrapper Header={<h2>Search Results</h2>}>
        <p>{searchResultMessage(posts)}</p>
        {Array.isArray(posts) && posts.length ? (
          posts.map((p) => (
            <Post
              key={p.id}
              showType
              content={(forms?.[p.type])?.content ?? {}}
              post={p}
            />
          ))) : null}
        <ShowMore
          hasNext={page?.hasNext && posts}
          onClickShowMore={getNextPage}
          showNoNextText={posts?.length && !page?.hasNext}
          noNextText="Retrieved all the posts"
        />
      </ContentWrapper>
    </LinearProgressModal>
  );
}

export default SearchResults;
