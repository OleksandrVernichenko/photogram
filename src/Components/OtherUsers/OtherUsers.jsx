import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useEffect, useCallback } from "react";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { Avatar } from "@mui/material";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";
import { HashLink } from "react-router-hash-link";
import MusicVideoRoundedIcon from "@mui/icons-material/MusicVideoRounded";
import GridOnRoundedIcon from "@mui/icons-material/GridOnRounded";
import {
  setOtherUser,
  setOtherUserFollowers,
  setOtherUserFollowing,
  onAddFollowing,
  onFollowingDelete,
  setOtherUserPosts,
} from "../../actions";
import {
  arrayUnion,
  setDoc,
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
  deleteField,
  arrayRemove,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import "./otherUsers.scss";
import { database } from "../../firebase/firebaseConfig";

export const OtherUser = () => {
  const user1 = createSelector(
    (state) => state.currentUser,
    (state) => state.otherUser,
    (currentUser, otherUser) => {
      return {
        currentUser: currentUser,
        otherUser,
      };
    }
  );

  const { currentUser, otherUser } = useSelector(user1);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const links = otherUser.link ? otherUser.link.split(" ") : [];

  useEffect(() => {
    onSnapshot(doc(database, "users", id), (doc) => {
      dispatch(setOtherUser(doc.data()));
    });
    onSnapshot(doc(database, "followers", id), (res) => {
      dispatch(setOtherUserFollowers(res.data()));
      getDoc(doc(database, "posts", id)).then((res) =>
        dispatch(setOtherUserPosts(res.data()))
      );
    });

    getDoc(doc(database, "following", id)).then((res) =>
      dispatch(setOtherUserFollowing(res.data()))
    );
  }, []);

  // add delete from following

  const onFollowUser = useCallback(
    (id) => {
      // add following to currentUser, add follower to a user clicked;
      // add follower to a user you are clicked;
      const follower = {
        [currentUser.id]: {
          name: currentUser.name,
          nik: currentUser.nik || "",
          photo: currentUser.photo || "",
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
            photo: res.data()?.photo || "",
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

  // send a message, check first does the message exist in messages, if not create new chat with 2 users, else continue chat redirect to chat page, ets

  const sendMessage = () => {
    const messages = collection(database, "messages");
    // get a current chat with 2 users)) from members in array
    const q1 = query(
      messages,
      // exact matching [[user1, user2]]
      where("members", "in", [[otherUser.id, currentUser.id]])
    );
    const q2 = query(
      messages,
      where("members", "in", [[currentUser.id, otherUser.id]])
    );
    // get current chat if exists
    getDocs(q1).then((res) => {
      if (res.docs.map((item) => item.data()).length === 0) {
        // if q1 isnt exists check q2
        getDocs(q2).then((res) => {
          if (res.docs.map((item) => item.data()).length !== 0) {
            // if q2 exists use these data
            // navigate to item.id
            res.docs.map((item) => navigate(`/messages/chat/${item.id}`));
          } else {
            // if no any docs find, create a new doc with 2 members etc.
            console.log("new doc");
            addDoc(collection(database, "messages"), {
              members: arrayUnion(currentUser.id, otherUser.id),
              chatStarted: new Date().getTime(),

              [`${[currentUser.id]}`]: {
                name: currentUser.name,
                photo: currentUser.photo || "",
              },
              [`${[otherUser.id]}`]: {
                name: otherUser.name,
                photo: otherUser.photo || "",
              },
            }).then((res) => navigate(`/messages/chat/${res.id}`));
          }
        });
      } else {
        // if q1 exists use these data
        // navigate to item.id

        res.docs.map((item) => navigate(`/messages/chat/${item.id}`));
      }
    });
  };

  return (
    <div className="other_user">
      <div className="other_user-nav">
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          <ArrowBackIosRoundedIcon />
        </button>
        <h2>{otherUser.name}</h2>
      </div>

      <div className="other_user-info">
        <Avatar src={otherUser.photo} sx={{ width: 120, height: 120 }} />
        <div className="other_user-info-data">
          <div className="posts_user">
            <span className="number">
              {(otherUser.posts && Object.values(otherUser.posts).length) || 0}
            </span>
            <span>
              <Trans i18nKey="profile.post"></Trans>
            </span>
          </div>
          <div className="posts_user">
            <span className="number">
              {(otherUser.followers &&
                Object.values(otherUser.followers).length) ||
                0}
            </span>
            <span>
              <Trans i18nKey="profile.followers"></Trans>
            </span>
          </div>
          <div className="posts_user">
            <span className="number">
              {(otherUser.following && otherUser.following.length) || 0}
            </span>
            <span>
              <Trans i18nKey="profile.following2"></Trans>
            </span>
          </div>
        </div>
      </div>

      <div className="user_bio">
        <p>{otherUser.bio}</p>

        <ul className="user_bio-links">
          {links.map((l) => (
            <li key={l}>
              <a href={"https://" + l} target="_blank" rel="noreferrer">
                <InsertLinkRoundedIcon
                  sx={{ rotate: "-30deg" }}
                  fontSize="small"
                />
                <span> {l.split(".")[0]}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="buttons">
        <Button variant="contained" onClick={sendMessage}>
          <Trans i18nKey="otherUser.sendMessage"></Trans>
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            currentUser.following &&
            currentUser.following.some((user) => user === id)
              ? onUnfollowUser(id)
              : onFollowUser(id);
          }}
        >
          {currentUser.following && currentUser.following.includes(id) ? (
            <Trans i18nKey="followers.unfollow"></Trans>
          ) : (
            <Trans i18nKey="followers.follow"></Trans>
          )}
        </Button>
      </div>

      <div className="user_posts">
        <span>
          <GridOnRoundedIcon />
        </span>

        <div className="user_posts-post">
          {otherUser.posts &&
            Object.values(otherUser.posts)
              .sort((a, b) => (a.time < b.time ? 1 : -1))
              .map((post) => (
                <HashLink
                  to={`/user/user_posts/#${post.id}`}
                  key={post.id}
                  className="single_post"
                >
                  {post.type === "image" ? (
                    <img src={post.image} alt="post" />
                  ) : (
                    <div className="other_user_video_list">
                      <button>
                        <MusicVideoRoundedIcon />
                      </button>
                      <video
                        src={post.image}
                        style={{ height: "100%", width: "100%" }}
                      ></video>
                    </div>
                  )}
                </HashLink>
              ))}
        </div>
      </div>
    </div>
  );
};
