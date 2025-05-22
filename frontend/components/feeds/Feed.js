"use client";

import Image from 'next/image';
import AddPost from '../AddPost';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPosts, deletePost } from '@/reducers/postsSlice';
import { fetchWithAuth } from '@/app/lib/apiClient';
import '@/styles/feed.css';
import PostOptionsModal from '@/components/modals/PostOptionsModal';

const Feed = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.list);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchPostsFromServer = async () => {
    try {
      const data = await fetchWithAuth('http://localhost:5000/api/posts');
      console.log(data);

      dispatch(setPosts(data));
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await fetchWithAuth('http://localhost:5000/api/user/me');
      setCurrentUser(user);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchPostsFromServer();
  }, []);

  return (
    <div className="feed-container">
      <AddPost onPostCreated={fetchPostsFromServer} />
      <div className="feed-posts-container">
        {posts.map((post) => (
          <FeedPost
            key={post.post_id}
            post={post}
            currentUserId={currentUser?.user_id}
          />
        ))}
      </div>
    </div>
  );
};

const FeedPost = ({ post, currentUserId }) => {
  const [expanded, setExpanded] = useState(false);
  const [orientation, setOrientation] = useState(null);
  const dispatch = useDispatch();

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    const orient = naturalHeight > naturalWidth ? 'vertical' : 'horizontal';
    setOrientation(orient);
    if (orient === 'vertical') {
      setExpanded(true);
    }
  };

  const handleDelete = async () => {
    try {
      await fetchWithAuth(`http://localhost:5000/api/posts/${post.post_id}`, {
        method: 'DELETE'
      });

      dispatch(deletePost(post.post_id));
    } catch (err) {
      console.error('Error when deleting a post: ', err);
    }
  };

  const isOwner = currentUserId === post.author_id;

  return (
    <div className="feed-posts-user">
      <div className="feed-user-avatar">
        <Image
          src={
            post.author?.profile_picture
              ? `http://localhost:5000/uploads${post.author.profile_picture}`
              : '/img/icons/user.svg' // заглушка
          }
          alt={post.author?.username || 'user'}
          width={50}
          height={50}
          style={{ borderRadius: '50%' }}
        />
      </div>
      <div className="feed-posts-info">
        <p>{post.title}</p>
        <div className="feed-info" style={{ position: 'relative' }}>
          <p className="feed-info-p p-blue">{post.author?.username}</p>
          <div className="separator"></div>
          <p className="feed-info-p p-grey">
            {new Date(post.created_at).toLocaleString('cs-CZ', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              timeZone: 'Europe/Prague'
            })}
          </p>
          {isOwner && (
            <PostOptionsModal
              onDelete={handleDelete}
              onEdit={() => console.log('edit')}
            />
          )}
        </div>
        <div className={`feed-post-title-img ${orientation === 'vertical' ? 'vertical' : 'horizontal'}`}>
          <div style={{ display: 'flex' }}>
            {Array.isArray(post.image_url) && post.image_url.map((img, i) => (
              <div key={i} className={`feed-posts-image ${orientation}`}>
                <Image
                  src={`http://localhost:5000${img}`}
                  alt="post" onLoad={handleImageLoad}
                  width={500}
                  height={300} />
              </div>
            ))}
          </div>
          <div className={`feed-posts-title ${expanded ? 'expanded' : ''}`}>
            <p>{post.content}</p>
          </div>
          {orientation === 'horizontal' && (
            <span className="view-more" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'View Less' : '... View More'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
