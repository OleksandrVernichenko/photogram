import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const withAuth = (Component) => {
  const auth = getAuth();
  const AuthenticatedComponent = (props) => {
    if (auth.currentUser) {
      return <Component {...props} />;
    }

    return <Navigate to="/login" />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
