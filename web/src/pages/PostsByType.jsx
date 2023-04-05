import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Posts from '../components/post/Posts';
import getFormByType from '../api/forms/getFormByType';
import getPostsByType from '../api/posts/getPostsByType';

function PostsByType() {
  const [formAndPosts, setFormAndPosts] = useState({ form: {}, posts: [] });

  const setPosts = (newPosts) => {
    setFormAndPosts((prevState) => ({ ...prevState, posts: newPosts }));
  };

  const { type } = useParams();

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      const initialize = async () => {
        const [formResult, postsResult] = await Promise.all([
          getFormByType(type),
          getPostsByType(type),
        ]);
        setFormAndPosts({ form: formResult, posts: postsResult });
      };
      initialize();
    }

    return function cleanup() {
      isMounted = false;
    };
  }, [type]);

  return <Posts title={type} formAndPosts={formAndPosts} setPosts={setPosts} />;
}

export default PostsByType;
