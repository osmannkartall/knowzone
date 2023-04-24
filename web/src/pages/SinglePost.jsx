import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/post/Post';
import getPostById from '../api/posts/getPostById';
import getFormByTypeId from '../api/forms/getFormByTypeId';

function SinglePost() {
  const [post, setPost] = useState({});
  const [form, setForm] = useState({});

  const { postId } = useParams();

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      const postResult = await getPostById(postId);
      const formResult = await getFormByTypeId(postResult?.type?.id);

      if (mounted) {
        setPost(postResult);
        setForm(formResult);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [postId]);

  return (
    <div style={{ padding: 16 }}>
      <Post content={form?.content} post={post} />
    </div>
  );
}

export default SinglePost;
