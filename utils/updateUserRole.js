export const updateUserRole = (email, newRole) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const updatedUsers = users.map((user) => {
        if (user.email === email) {
            return { ...user, role: newRole };
        }
        return user;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.email === email) {
        const updatedCurrentUser = { ...currentUser, role: newRole };
        localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
    }
};
