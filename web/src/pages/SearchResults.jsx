import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import Post from '../components/post/Post';
import ContentWrapper from '../components/common/ContentWrapper';
import usePagination from '../hooks/usePagination';
import { topbarHeight } from '../constants/styles';
import { WHITE } from '../constants/colors';
import { BE_ROUTES } from '../constants/routes';
import FetchResult from '../components/common/FetchResult';

function SearchResults() {
  const location = useLocation();

  const { data, getNextPage, status, errorMessage } = usePagination({
    url: `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.SEARCH}`,
    method: 'POST',
    body: location.state,
  });

  const { forms, posts } = data ?? {};

  const handleOnClickShowMore = () => getNextPage();

  const parentRef = useRef(null);

  const parentOffsetRef = useRef(0);

  useLayoutEffect(() => { parentOffsetRef.current = parentRef.current?.offsetTop ?? 0; }, []);

  const virtualizer = useWindowVirtualizer({
    count: posts?.length,
    estimateSize: () => 45,
    scrollMargin: parentOffsetRef.current,
  });

  return (
    <ContentWrapper
      Header={(
        <div
          style={{
            position: 'sticky',
            top: topbarHeight,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: WHITE,
            zIndex: 100,
          }}
        >
          <h2>Search Results</h2>
        </div>
      )}
    >
      {posts && (
        <div ref={parentRef}>
          <div
            style={{
              height: virtualizer.getTotalSize(),
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${
                  (virtualizer.getVirtualItems()[0]?.start ?? 0) - virtualizer.options.scrollMargin
                }px)`,
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{ paddingBottom: 16 }}
                >
                  <Post
                    showType
                    content={(forms?.[posts[virtualRow.index].type])?.content ?? {}}
                    post={posts[virtualRow.index]}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <FetchResult
          status={status}
          errorMessage={errorMessage}
          handleOnClickShowMore={handleOnClickShowMore}
          noNextText="Retrieved all the posts"
          noResultText="No results found matching your search"
        />
      </div>
    </ContentWrapper>
  );
}

export default SearchResults;
