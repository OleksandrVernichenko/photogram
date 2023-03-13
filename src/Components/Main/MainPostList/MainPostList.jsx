import { Avatar } from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ModeCommentRoundedIcon from "@mui/icons-material/ModeCommentRounded";
import { Badge } from "@mui/material";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import Divider from "@mui/material/Divider";
import "./mainPostList.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { database } from "../../../firebase/firebaseConfig";

export const MainPostList = (props) => {
  const user = createSelector(
    (state) => state.currentUser,
    (currentUser) => {
      return {
        currentUser: currentUser,
      };
    }
  );

  const { currentUser } = useSelector(user);
  const [muted, setMuted] = useState(true);

  const postsToMap =
    props.posts &&
    props.posts
      .map((item) => Object.values(item))
      .flat()
      .sort((a, b) => (a.time < b.time ? 1 : -1));

  const uniqueArray = postsToMap.filter((obj, index, arr) => {
    return arr.findIndex((t) => t.id === obj.id) === index;
  });

  const addLike = (id, userId) => {
    updateDoc(doc(database, "posts", userId), {
      [`${id}.liked`]: arrayUnion(currentUser.id),
    });
  };

  const onRemoveLike = (id, userId) => {
    updateDoc(doc(database, "posts", userId), {
      [`${id}.liked`]: arrayRemove(currentUser.id),
    });
  };

  return (
    <div className="main_posts_list">
      {uniqueArray.map((post) => (
        <div key={post.id} className="main_posts_single">
          <Link to={`/user/${post.userId}`} className="by_user">
            <Avatar src={post.avatar} />
            <span>{post.by}</span>
          </Link>
          {post.type === "image" ? (
            <img src={post.image} alt="" height={"100%"} width="100%" />
          ) : (
            <div className="video_main">
              <button onClick={() => {
                console.log('ckciic')
                setMuted(!muted)}} style={{ zIndex: 10 }}>
                {muted ? <VolumeOffRoundedIcon /> : <VolumeUpRoundedIcon />}
              </button>
              <video src={post.image} autoPlay muted={muted} loop></video>
            </div>
          )}

          <div className="post_actions">
            <button
              onClick={() => {
                post.liked?.some((item) => item === currentUser.id)
                  ? onRemoveLike(post.id, post.userId)
                  : addLike(post.id, post.userId);
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
              <ModeCommentRoundedIcon color="action" />
            </Link>
          </div>
          <p>{post.text}</p>

          <Divider />
        </div>
      ))}
    </div>
  );
};
