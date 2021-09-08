import React, { useState, useEffect } from 'react';
import Post from './Post';
import { BE_ROUTES } from '../constants/routes';
import POST_TYPES from '../constants/post-types';
import ContentWrapper from '../common/ContentWrapper';

const BugFixes = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let mounted = true;

    fetch(`${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.BUG_FIXES}`)
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
    <ContentWrapper title="Bug Fixes">
      {Array.isArray(posts) && posts.length ? (
        posts.map((p) => (
          <Post
            key={p.id}
            type={POST_TYPES.BUG_FIX.value}
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
  );
};

export default BugFixes;
