import '../styles/addPost.css'

import user from '../img/user.svg';
import uploadIcon from '../img/imagesButton.svg';
import gifIcon from '../img/gifButton.svg';
import emojiIcon from '../img/emojiButton.svg';
import defaultImage from '../img/13.svg'

import { use, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPost } from '../reducers/postsSlice'
import { getCurrentUser } from '../utils/getCurrentUser';

const AddPost = () => {
    const dispatch = useDispatch();
    const currentUser = getCurrentUser();

    const [postContent, setPostContent] = useState('');
    const [image, setImage] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    }

    const handleSubmit = () => {
        if (!postContent.trim()) return;

        const words = postContent.trim().split(' ');
        const title = words.slice(0, 2).join(' ')

        const newPost = {
            id: Date.now(),
            title,
            content: postContent,
            author: currentUser.name,
            days_ago: 0,
            svg: defaultImage,
            img: image,
            removable: true,
          };

        dispatch(addPost(newPost));
        setPostContent('');
        setImage(null);
    }


    return (
        <div className="addpost-container">
            <div className="addpost-user-img">
                <img src={user} alt="" />
            </div>
            <div className="addpost-input">
                <input
                    type="text"
                    placeholder='Share your thoughts or a post'
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSubmit();
                        }
                    }}
                />
                <div className="addpost-buttons">
          <button>
            <label>
              <img src={uploadIcon} alt="Upload Photo" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
          </button>
                    <button>
                        <img src={gifIcon} alt="Upload GIF" />
                    </button>
                    <button>
                        <img src={emojiIcon} alt="Choose Emoji" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddPost;