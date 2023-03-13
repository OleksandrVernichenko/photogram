const initialState = {
  name: "",
  nik: "",
  email: "",
  link: "",
  bio: "",
  photo: "",
  id: "",
  birth: new Date(),
  pass: "",
};

const createUser = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_NAME":
      return {
        ...state,
        name: action.payload,
      };
    case "SET_USER_EMAIL":
      return {
        ...state,
        email: action.payload,
      };
    case "SET_USER_NIK":
      return {
        ...state,
        nik: action.payload,
      };
    case "SET_USER_PASS":
      return {
        ...state,
        pass: action.payload,
      };
    case "SET_USER_BIO":
      return {
        ...state,
        bio: action.payload,
      };
    case "SET_USER_LINK":
      return {
        ...state,
        link: action.payload,
      };
    case "SET_USER_BDAY":
      return {
        ...state,
        birth: action.payload,
      };
    case "SET_USER_ID":
      return {
        ...state,
        id: action.payload,
      };
    case "SET_DEFAULT_STATE":
      return {
        ...initialState,
      };
    case "SET_CURRENT_USER":
      return {
        ...action.payload,
      };

    default:
      return state;
  }
};

export default createUser;
