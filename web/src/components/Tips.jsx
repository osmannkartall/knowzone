import { useState, useEffect } from 'react';
import Post from '../common/Post';
import { BE_ROUTES } from '../constants/routes';
import POST_TYPES from '../constants/post-types';
import ContentWrapper from '../common/ContentWrapper';

const Tips = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;

    fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.TIPS}`)
      .then((response) => response.json())
      .then((data) => {
        if (mounted) {
          setPosts(data);
        }
      })
      .catch((error) => console.error(error));

    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <ContentWrapper title={POST_TYPES.get('tip').pluralName}>
      {Array.isArray(posts) && posts.length ? (
        posts.map((p) => (
          <Post
            key={p.id}
            owner={p.owner}
            content={{
              links: p.links,
              images: p.images,
              lastModifiedDate: p.updatedAt,
              insertDate: p.createdAt,
              topics: p.topics,
              description: p.description,
            }}
          />
        ))) : null}
    </ContentWrapper>
  );
};

export default Tips;
