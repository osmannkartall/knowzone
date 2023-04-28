import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Post from '../components/post/Post';
import getPostById from '../api/posts/getPostById';
import getFormByTypeId from '../api/forms/getFormByTypeId';

function SinglePost() {
  const { preFetchedForm, preFetchedPost } = useLocation().state ?? {};
  const { postId } = useParams();

  const [post, setPost] = useState({});
  const [form, setForm] = useState({});

  useEffect(() => {
    let mounted = true;

    async function fetchPostAndForm() {
      const postResult = await getPostById(postId);
      const formResult = await getFormByTypeId(postResult?.type?.id);

      if (mounted) {
        setPost(postResult);
        setForm(formResult);
      }
    }

    if (!preFetchedForm && !preFetchedPost) {
      fetchPostAndForm();
    } else {
      setPost(preFetchedPost);
      setForm(preFetchedForm);
    }

    return () => {
      mounted = false;
    };
  }, [postId, preFetchedForm, preFetchedPost]);

  return (
    <div style={{ padding: 16 }}>
      <Post content={form?.content} post={post} />
    </div>
  );
}

export default SinglePost;
