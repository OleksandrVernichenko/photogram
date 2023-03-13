export const setUserName = (e) => ({
  type: "SET_USER_NAME",
  payload: e,
});

export const setUserEMail = (e) => ({
  type: "SET_USER_EMAIL",
  payload: e,
});
export const setUserNik = (e) => ({
  type: "SET_USER_NIK",
  payload: e,
});
export const setUserPass = (e) => ({
  type: "SET_USER_PASS",
  payload: e,
});
export const setUserBio = (e) => ({
  type: "SET_USER_BIO",
  payload: e,
});
export const setUserLink = (e) => ({
  type: "SET_USER_LINK",
  payload: e,
});

export const setUserBDay = (e) => ({
  type: "SET_USER_BDAY",
  payload: e,
});

export const setUserId = (e) => ({
  type: "SET_USER_ID",
  payload: e,
});

export const setDefaultState = () => ({
  type: "SET_DEFAULT_STATE",
});

export const setCurrentUser = (user) => ({
  type: "SET_CURRENT_USER",
  payload: user,
});

export const setUserFollowers = (data) => ({
  type: "SET_USERS_FOLLOWERS",
  payload: data,
});

export const setStoriesToWatch = (data) => ({
  type: "SET_STORIES_TO_WATCH",
  payload: data,
});

export const onFollowingDelete = (id) => ({
  type: "ON_FOLLOWING_DELETE",
  payload: id,
});
export const onAddFollowing = (id) => ({
  type: "ON_FOLLOWING_ADDED",
  payload: id,
});
export const onSetUserFollowing = (data) => ({
  type: "SET_USERS_FOLLOWING",
  payload: data,
});
export const onSetUserPosts = (posts) => ({
  type: "SET_USERS_POSTS",
  payload: posts,
});

export const setOtherUser = (user) => ({
  type: "OTHER_USER_INFO",
  payload: user,
});
export const setOtherUserFollowers = (data) => ({
  type: "OTHER_USER_FOLLOWERS",
  payload: data,
});
export const setOtherUserPosts = (data) => ({
  type: "OTHER_USER_POSTS",
  payload: data,
});
export const setOtherUserFollowing = (data) => ({
  type: "OTHER_USER_FOLLOWING",
  payload: data,
});
export const setOtherUserFollowingDeleted = (id) => ({
  type: "OTHER_USER_FOLLOWING_DELETE",
  payload: id,
});
