const initialState = {
  name: "",
  nik: "",
  email: "",
  link: "",
  bio: "",
  photo: "",
  id: "",
  birth: "",
  messages: {},
  posts: {},
  following: [],
  followers: [],
  followingUsers: [],
};

const otherUser = (state = initialState, action) => {
  switch (action.type) {
    case "OTHER_USER_INFO":
      return {
        ...action.payload,
      };
    case "OTHER_USER_FOLLOWERS":
      return {
        ...state,
        followers: action.payload,
      };
    case "OTHER_USER_POSTS":
      return {
        ...state,
        posts: action.payload,
      };

    case "OTHER_USER_FOLLOWING":
      return {
        ...state,
        followingUsers: action.payload,
      };

    case "OTHER_USER_FOLLOWING_DELETE":
      return {
        ...state,
        following: state.following.filter((item) => item !== action.payload),
        followingUsers: Object.values(state.followingUsers).filter(
          (item) => item.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default otherUser;
