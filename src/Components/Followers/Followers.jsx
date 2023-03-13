import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Avatar } from "@mui/material";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import { useTranslation, Trans } from "react-i18next";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { database } from "../../firebase/firebaseConfig";
import {
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
  deleteField,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { onFollowingDelete, onAddFollowing } from "../../actions";
import "./followers.scss";

export const Followers = () => {
  const user = createSelector(
    (state) => state.currentUser,
    (currentUser) => {
      return {
        currentUser,
      };
    }
  );
  const { currentUser } = useSelector(user);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  const onFollowUser = useCallback(
    (id) => {
      // add following to currentUser, add follower to a user clicked;
      // add follower to a user you are clicked;
      const follower = {
        [currentUser.id]: {
          name: currentUser.name,
          nik: currentUser.nik,
          photo: currentUser.photo,
          id: currentUser.id,
        },
      };

      // set data to a user which you follow;
      setDoc(doc(database, "followers", id), follower, { merge: true }).then(
        dispatch(onAddFollowing(follower))
      );

      // update currentUser add id to arr of following for future calculation;
      updateDoc(doc(database, "users", currentUser.id), {
        following: arrayUnion(id),
      });

      // set data to userCurrent you start follow in following database;
      getDoc(doc(database, "users", id)).then((res) => {
        console.log(res);
        const following = {
          [res.id]: {
            name: res.data().name,
            nik: res.data().nik,
            // in this case, image will not be updated after user change it;
            // then has to be another way to set current user image
            photo: res.data().photo || "",
            id: res.id,
          },
        };

        // set data to currentUser in following database
        setDoc(doc(database, "following", currentUser.id), following, {
          merge: true,
        });
      });
    },
    [currentUser.followers]
  );

  const onUnfollowUser = useCallback(
    (id) => {
      const userRef = doc(database, "followers", id);
      // delete following CurrentUser from in user followers
      updateDoc(userRef, {
        [currentUser.id]: deleteField(),
      });
      // delete following user in current user database
      updateDoc(doc(database, "following", currentUser.id), {
        [id]: deleteField(),
      });

      // delete user id from currentUser following array
      updateDoc(doc(database, "users", currentUser.id), {
        following: arrayRemove(id),
      }).then(() => dispatch(onFollowingDelete(id)));
    },
    [currentUser.following]
  );

  return (
    <div className="followers">
      <div className="followers-head">
        <Link to="/profile">
          <ArrowBackIosRoundedIcon />
        </Link>
        <h2>
          <Trans i18nKey="followers.head"></Trans>
        </h2>
      </div>
      <div className="followers-box">
        {currentUser.followers &&
          Object.values(currentUser.followers)
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((item) => (
              <Link to={`/user/${item.id}`} key={item.id} className="follower">
                <div className="user_info">
                  <Avatar src={item.photo} sx={{ height: 50, width: 50 }} />
                  <div className="follower-name">
                    <span className="nik">{item.nik}</span>
                    <span className="name">{item.name}</span>
                  </div>
                </div>
                {currentUser.following &&
                currentUser.following.includes(item.id) ? (
                  <Button
                    variant="contained"
                    onClick={() => onUnfollowUser(item.id)}
                  >
                    <Trans i18nKey="followers.follow"></Trans>
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => onFollowUser(item.id)}
                  >
                    <Trans i18nKey="followers.unfollow"></Trans>
                  </Button>
                )}
              </Link>
            ))}
      </div>
    </div>
  );
};
