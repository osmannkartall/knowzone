import { useParams } from 'react-router-dom';
import { useLayoutEffect, useRef } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import TagIcon from '@mui/icons-material/Tag';
import ContentWrapper from '../components/common/ContentWrapper';
import { topbarHeight } from '../constants/styles';
import { PRIMARY, WHITE } from '../constants/colors';
import { BE_ROUTES } from '../constants/routes';
import Post from '../components/post/Post';
import FetchResult from '../components/common/FetchResult';
import usePagination from '../hooks/usePagination';

function PostsByTopics() {
  const { topic } = useParams();

  const { data, getNextPage, status, errorMessage } = usePagination({
    url: `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.TOPICS}`,
    method: 'POST',
    body: { topics: [topic] },
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
            alignItems: 'center',
            backgroundColor: WHITE,
            color: PRIMARY,
            fontSize: 16,
            fontWeight: 'bold',
            padding: '16px 0px',
            zIndex: 100,
          }}
        >
          <TagIcon />
          {topic}
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
          noResultText="No results found for this topic"
        />
      </div>
    </ContentWrapper>
  );
}

export default PostsByTopics;
