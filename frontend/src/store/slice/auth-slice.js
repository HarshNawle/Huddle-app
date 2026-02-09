
// createAuthSlice = "Who am I?"
// userInfo = "My details"
// setUserInfo = "Update who I am"


const createAuthSlice = (set) => (
    {
        userInfo: undefined,
        setUserInfo: (userInfo) => set({ userInfo })
    }
);

export default createAuthSlice;