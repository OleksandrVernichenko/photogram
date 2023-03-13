import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import {
  setCurrentUser,
  setUserFollowers,
  onSetUserFollowing,
  onSetUserPosts,

} from "../../../actions";
import { database } from "../../../firebase/firebaseConfig";
import "./profile.scss";
import { Gallery } from "./Gallery/Gallery";
import { ProfileHead } from "./ProfileHead/ProfileHead";
import { ProfileInfo } from "./ProfileInfo/ProfileInfo";

export const Profile = () => {
  const user = createSelector(
    (state) => state.currentUser,
    (currentUser) => {
      return {
        currentUser: currentUser,
      };
    }
  );
  const { currentUser } = useSelector(user);
  const auth = getAuth();
  const dispatch = useDispatch();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("user in");
      localStorage.setItem("user", JSON.stringify(auth.currentUser.uid));
    } else {
      console.log("user out");
    }
  });

  useEffect(() => {
    onSnapshot(
      doc(database, "users", JSON.parse(localStorage.getItem("user"))),
      (docSnap) => {
        if (docSnap.exists()) {
          dispatch(setCurrentUser(docSnap.data()));
          getDoc(doc(database, "followers", auth.currentUser.uid)).then((res) =>
            dispatch(setUserFollowers(res.data()))
          );
          getDoc(doc(database, "following", auth.currentUser.uid)).then(
            (res) => {
              dispatch(onSetUserFollowing(res.data()));
            }
          );
          getDoc(doc(database, "posts", auth.currentUser.uid)).then((res) =>
            dispatch(onSetUserPosts(res.data()))
          );
        } else {
          console.log("No such document!");
        }
      }
    );
  }, []);


  return (
    <>
      <ProfileHead {...currentUser} />
      <ProfileInfo {...currentUser} />
      <Gallery {...currentUser} />
    </>
  );
};
