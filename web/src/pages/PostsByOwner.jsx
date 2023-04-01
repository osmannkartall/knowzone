import { useState, useEffect } from 'react';
import getForms from '../api/forms/getForms';
import getPosts from '../api/posts/getPosts';
import { useAuthState } from '../contexts/AuthContext';
import Posts from '../components/post/Posts';

function PostsByOwner() {
  const [forms, setForms] = useState([]);
  const [form, setForm] = useState({});
  const [posts, setPosts] = useState([]);

  const user = useAuthState();

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      const initializeForms = async () => {
        const result = await getForms();
        setForms(result);
      };
      initializeForms();
    }

    return function cleanup() {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      const initializePosts = async () => {
        const data = await getPosts();
        setPosts(data);
      };
      initializePosts();
    }

    return function cleanup() {
      mounted = false;
    };
  }, [user.id]);

  return (
    <Posts
      title="Your Posts"
      forms={forms}
      form={form}
      setForm={setForm}
      posts={posts}
      setPosts={setPosts}
    />
  );
}

export default PostsByOwner;
