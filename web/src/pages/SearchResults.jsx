import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Post from '../components/post/Post';
import ContentWrapper from '../components/common/ContentWrapper';
import LinearProgressModal from '../components/common/LinearProgressModal';
import getSearchResults from '../api/search/getSearchResults';
import ShowMore from '../components/common/ShowMore';
import usePagination from '../hooks/usePagination';

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
  const { forms, posts } = formsAndPosts;

  const {
    page,
    getFirstPage,
    getNextPage,
  } = usePagination(getSearchResults, { body: location.state });

  useEffect(() => {
    let mounted = true;

    const fetchResults = async () => {
      if (mounted) {
        setIsLinearProgressModalOpen(true);

        const searchResults = await getFirstPage();

        setFormsAndPosts({
          forms: searchResults?.forms ?? {},
          posts: searchResults?.records ?? [],
        });

        setIsLinearProgressModalOpen(false);
      }
    };

    fetchResults();

    return function cleanup() {
      mounted = false;
    };
  }, [location.state]);

  const handleOnClickShowMore = async () => {
    const nextPage = await getNextPage();
    setFormsAndPosts(
      {
        posts: [...posts, ...(nextPage?.records ?? [])],
        forms: { ...forms, ...nextPage?.forms },
      },
    );
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
          onClickShowMore={handleOnClickShowMore}
          showNoNextText={posts?.length && !page?.hasNext}
          noNextText="Retrieved all the posts"
        />
      </ContentWrapper>
    </LinearProgressModal>
  );
}

export default SearchResults;
