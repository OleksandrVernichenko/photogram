import { createSelector } from "reselect";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { Badge } from "@mui/material";
import ModeCommentRoundedIcon from "@mui/icons-material/ModeCommentRounded";
import { Avatar } from "@mui/material";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import { useNavigate } from "react-router-dom";
import {
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";

import { database } from "../../../firebase/firebaseConfig";
import "./otherUserPosts.scss";
import { setOtherUserPosts } from "../../../actions";

export const OtherUserPosts = () => {
  const user = createSelector(
    (state) => state.otherUser,
    (state) => state.currentUser,
    (otherUser, currentUser) => {
      return {
        currentUser: currentUser,
        otherUser,
      };
    }
  );

  useEffect(() => {
    onSnapshot(doc(database, "posts", otherUser.id), (onSnap) => {
      if (onSnap.exists()) {
        dispatch(setOtherUserPosts(onSnap.data()));
      } else {
        console.log("no doc");
      }
    });
  }, []);

  const { otherUser, currentUser } = useSelector(user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [muted, setMuted] = useState(true);
  const addLike = (id) => {
    updateDoc(doc(database, "posts", otherUser.id), {
      [`${id}.liked`]: arrayUnion(currentUser.id),
    });
  };

  const onRemoveLike = (id) => {
    updateDoc(doc(database, "posts", otherUser.id), {
      [`${id}.liked`]: arrayRemove(currentUser.id),
    });
  };

  return (
    <div className="other_user_posts">
      <div className="other_user_posts_nav">
        <button onClick={() => navigate(`/user/${otherUser.id}`)}>
          <ArrowBackIosRoundedIcon />
        </button>
        <h2>{otherUser.name}</h2>
        <span>Posts</span>
      </div>
      {otherUser.posts &&
        Object.values(otherUser.posts)
          .sort((a, b) => (a.time < b.time ? 1 : -1))
          .map((post) => (
            <div className="other_user_post" key={post.id}>
              <div className="other_user_info">
                <Avatar src={otherUser.photo} />
                <span>{otherUser.name}</span>
              </div>
              {post.type === "image" ? (
                <img src={post.image} alt="post" />
              ) : (
                <div className="other_user_video">
                  <button onClick={() => setMuted(!muted)}>
                    {muted ? <VolumeOffRoundedIcon /> : <VolumeUpRoundedIcon />}
                  </button>
                  <video src={post.image} autoPlay muted={muted} loop></video>
                </div>
              )}

              <p>{post.text}</p>
              <div className="post_actions">
                <button
                  onClick={() => {
                    post.liked?.some((item) => item === currentUser.id)
                      ? onRemoveLike(post.id)
                      : addLike(post.id);
                  }}
                  style={
                    post.liked?.some((item) => item === currentUser.id)
                      ? { color: "red" }
                      : {}
                  }
                >
                  <Badge
                    color="primary"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    badgeContent={post.liked?.length || 0}
                  >
                    {post.liked?.includes(currentUser.id) ? (
                      <FavoriteRoundedIcon />
                    ) : (
                      <FavoriteBorderRoundedIcon color="action" />
                    )}
                  </Badge>
                </button>
                <Link to={`/posts_list/comments/${post.id}`}>
                  <Badge>
                    <ModeCommentRoundedIcon color="action" />
                  </Badge>
                </Link>
              </div>
            </div>
          ))}
    </div>
  );
};
