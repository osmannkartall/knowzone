import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Posts from '../components/post/Posts';
import getFormByType from '../api/forms/getFormByType';
import getPostsByType from '../api/posts/getPostsByType';

function PostsByType() {
  const [form, setForm] = useState({});
  const [posts, setPosts] = useState([]);

  const { type } = useParams();

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      const initializeForm = async () => {
        const result = await getFormByType(type);
        setForm(result);
      };
      initializeForm();
    }

    return function cleanup() {
      isMounted = false;
    };
  }, [type]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      const initializePosts = async () => {
        const data = await getPostsByType(type);
        setPosts(data);
      };
      initializePosts();
    }

    return function cleanup() {
      isMounted = false;
    };
  }, [type]);

  return <Posts title={type} form={form} posts={posts} setPosts={setPosts} />;
}

export default PostsByType;
