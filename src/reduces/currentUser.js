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
  storyToWatch: [],
};

const currentUser = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return {
        ...action.payload,
      };
    case "ON_FOLLOWING_DELETE":
      return {
        ...state,
        following: state.following.filter((item) => item !== action.payload),
        followingUsers: Object.values(state.followingUsers).filter(
          (item) => item.id !== action.payload
        ),
      };

    case "ON_FOLLOWING_ADDED":
      return {
        ...state,
        following: [action.payload],
        followingUsers: action.payload,
      };

    case "SET_STORIES_TO_WATCH":
      return {
        ...state,
        storyToWatch: [action.payload],
      };

    case "SET_USERS_FOLLOWERS":
      return {
        ...state,
        followers: action.payload,
      };
    case "SET_USERS_POSTS":
      return {
        ...state,
        posts: action.payload,
      };
    case "SET_USERS_FOLLOWING":
      return {
        ...state,
        followingUsers: action.payload,
      };
    default:
      return state;
  }
};

export default currentUser;
