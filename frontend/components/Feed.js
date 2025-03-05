"use client";

import AddPost from './AddPost';
import CommunityCard from './CommunityCard';
import { getCurrentUser } from '../utils/getCurrentUser';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { mergePosts, deletePost } from '../reducers/postsSlice';
import '../styles/feed.css';


const Feed = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.list);
  const currentUser = getCurrentUser();

  useEffect(() => {
    fetch('/data/posts.json')
      .then((res) => res.json())
      .then((data) => {
        dispatch(mergePosts(data));
      })
      .catch((err) => console.error('Error loading posts:', err));
  }, [dispatch]);

  const handleDeletePost = (postId) => {
    if (currentUser?.role !== 'admin') {
      return alert('You do not have permission to delete posts.');
    }
    dispatch(deletePost(postId));
  };

  return (
    <div className="feed-container">
      <AddPost />
      <div className="feed-posts-container">
        {posts.map((post) => (
          <FeedPost
            key={post.id}
            post={post}
            onDelete={() => handleDeletePost(post.id)}
            isAdmin={currentUser?.role === 'admin'}
          />
        ))}
      </div>
    </div>
  );
};

const FeedPost = ({ post, onDelete, isAdmin }) => {
  const [expanded, setExpanded] = useState(false);
  const [orientation, setOrientation] = useState(null);

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    const orient = naturalHeight > naturalWidth ? 'vertical' : 'horizontal';
    setOrientation(orient);
    if (orient === 'vertical') {
      setExpanded(true);
    }
  };

  return (
    <div className="feed-posts-user">
      <CommunityCard bg={post.bg} svg={post.svg} color={post.icon} />
      <div className="feed-posts-info">
        <p>{post.title}</p>
        <div className="feed-info">
          <p className="feed-info-p p-blue">{post.author}</p>
          <div className="separator"></div>
          <p className="feed-info-p p-grey">{post.days_ago} days ago</p>
        </div>
        <div className={`feed-post-title-img ${orientation === 'vertical' ? 'vertical' : 'horizontal'}`}>
          <div className={`feed-posts-title ${expanded ? 'expanded' : ''}`}>
            <p>{post.content}</p>
          </div>
          {orientation === 'horizontal' && (
            <span className="view-more" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'View Less' : '... View More'}
            </span>
          )}
          {post.img && (
            <div className={`feed-posts-image ${orientation}`}>
              <img src={post.img} alt="post" onLoad={handleImageLoad} />
            </div>
          )}
        </div>
        {isAdmin && post.removable && (
          <button className="delete-post-button" onClick={onDelete}>
            Delete Post
          </button>
        )}
      </div>
    </div>
  );
};


export default Feed;