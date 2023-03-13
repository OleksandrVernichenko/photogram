import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { useCallback } from "react";
import { Button } from "@mui/material";
import { useTranslation, Trans } from "react-i18next";
import { database } from "../../firebase/firebaseConfig";
import { doc, updateDoc, deleteField, arrayRemove } from "firebase/firestore";
import { onFollowingDelete } from "../../actions";

import "./following.scss";

export const Following = () => {
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
    <div className="following">
      <div className="following-head">
        <Link to="/profile">
          <ArrowBackIosRoundedIcon />
        </Link>
        <h2>
          <Trans i18nKey="followers.head2"></Trans>
        </h2>
      </div>

      <div className="following-box">
        {currentUser.followingUsers &&
          Object.values(currentUser.followingUsers)
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((user) => (
              <Link
                to={`/user/${user.id}`}
                className="following-user"
                key={user.id}
              >
                <div className="user_info">
                  <div className="avatar-wrapper">
                    <Avatar src={user.photo} sx={{ height: 50, width: 50 }} />
                    <div className="following_name">
                      <span className="nik">{user.nik}</span>
                      <span className="name">{user.name.slice(0, 10)}</span>
                    </div>
                  </div>
                  <Button
                    variant="contained"
                    onClick={() => onUnfollowUser(user.id)}
                  >
                    <Trans i18nKey="followers.unfollow"></Trans>
                  </Button>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};
