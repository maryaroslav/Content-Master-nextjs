import { createSlice } from '@reduxjs/toolkit';

const colors = [
    { bg: '#E5F6FF', icon: '#E5F6FF' },
    { bg: '#F1E9FF', icon: '#B792E5' },
    { bg: '#EEFFE3', icon: '#82D62E' },
    { bg: '#FFFCE3', icon: '#FFE000' },
    { bg: '#E9FFF0', icon: '#72B7A7' },
];

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        list: [],
    },
    reducers: {
        mergePosts: (state, action) => {
            const fetchedPosts = action.payload.map((post, index) => {
                const overallIndex = state.list.length + index;
                const color = colors[overallIndex % colors.length];
                return { ...post, ...color, removable: false };
            });
            state.list = [...state.list, ...fetchedPosts];
        },
        addPost: (state, action) => {
            const newPost = action.payload;
            const index = state.list.length;
            const color = colors[index % colors.length];
            state.list.unshift({ ...newPost, ...color, removable: true });
        },
        deletePost: (state, action) => {
            state.list = state.list.filter((post) => post.id !== action.payload);
        },
    },
});

export const { mergePosts, addPost, deletePost } = postsSlice.actions;
export default postsSlice.reducer;