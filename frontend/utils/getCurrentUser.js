import store from '../app/lib/store';

export const getCurrentUser = () => {
    const state = store.getState();
    return state.auth.user;
};