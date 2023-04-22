import { useLayoutEffect, useRef } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import Post from './Post';
import ContentWrapper from '../common/ContentWrapper';
import FetchResult from '../common/FetchResult';

function Posts({
  editable,
  errorMessage,
  form,
  forms,
  getNextPage,
  LeftHeader,
  RightHeader,
  onClickDelete,
  onClickUpdate,
  posts,
  status,
}) {
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
    <ContentWrapper LeftHeader={LeftHeader} RightHeader={RightHeader}>
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
                    editable={editable}
                    content={
                      form?.content ?? (forms?.[posts[virtualRow.index]?.type?.name])?.content ?? {}
                    }
                    onClickDelete={() => onClickDelete(posts[virtualRow.index])}
                    onClickUpdate={() => onClickUpdate(posts[virtualRow.index])}
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
        />
      </div>
    </ContentWrapper>
  );
}

export default Posts;
