import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useDispatch } from "react-redux";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { useTranslation, Trans } from "react-i18next";
import ModeCommentRoundedIcon from "@mui/icons-material/ModeCommentRounded";
import VolumeOffRoundedIcon from "@mui/icons-material/VolumeOffRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import {
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { database } from "../../../../firebase/firebaseConfig";
import { onSetUserPosts } from "../../../../actions";
import Badge from "@mui/material/Badge";
import { Link } from "react-router-dom";

import "./postsList.scss";
import { useEffect, useState } from "react";

export const PostsList = () => {
  const user = createSelector(
    (state) => state.currentUser,
    (currentUser) => {
      return {
        currentUser: currentUser,
      };
    }
  );
  const { currentUser } = useSelector(user);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const [muted, setMuted] = useState(true);
  const posts = Object.values(currentUser.posts).sort((a, b) =>
    a.time < b.time ? 1 : -1
  );

  const addLike = (id) => {
    updateDoc(doc(database, "posts", currentUser.id), {
      [`${id}.liked`]: arrayUnion(currentUser.id),
    });
  };

  const onRemoveLike = (id) => {
    updateDoc(doc(database, "posts", currentUser.id), {
      [`${id}.liked`]: arrayRemove(currentUser.id),
    });
  };

  useEffect(() => {
    onSnapshot(doc(database, "posts", currentUser.id), (onSnap) => {
      if (onSnap.exists()) {
        dispatch(onSetUserPosts(onSnap.data()));
      } else {
        console.log("no doc");
      }
    });
  }, []);

  return (
    <div className="posts_list">
      <div className="list_head">
        <button onClick={() => navigate(-1)}>
          <ArrowBackIosRoundedIcon />
        </button>
        <div className="posts_by">
          <span className="user_name">{posts[0].by}</span>
          <span>
            <Trans i18nKey="profile.post"></Trans>
          </span>
        </div>
      </div>

      <div className="posts_column">
        {posts.map((item) => (
          <div key={item.id} id={item.id} className="single_post">
            <Link to="/profile" className="user_post">
              <Avatar src={currentUser.photo} sx={{ height: 35, width: 35 }} />
              <span>{currentUser.name}</span>
            </Link>
            {item.type === "image" ? (
              <img src={item.image} alt="post" />
            ) : (
              <div className="video_mute">
                <button onClick={() => setMuted(!muted)}>
                  {muted ? <VolumeOffRoundedIcon /> : <VolumeUpRoundedIcon />}
                </button>
                <video muted={muted} autoPlay loop src={item.image}></video>
              </div>
            )}

            <p className="user_text"> {item.text} </p>
            <div className="service_box">
              <button
                onClick={() => {
                  item.liked?.some((item) => item === currentUser.id)
                    ? onRemoveLike(item.id)
                    : addLike(item.id);
                }}
              >
                <Badge
                  color="primary"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  badgeContent={item.liked?.length || 0}
                >
                  {item.liked?.includes(currentUser.id) ? (
                    <FavoriteRoundedIcon />
                  ) : (
                    <FavoriteBorderRoundedIcon color="action" />
                  )}
                </Badge>
              </button>
              <Link to={`/posts_list/comments/${item.id}`}>
                <Badge>
                  <ModeCommentRoundedIcon color="action" />
                </Badge>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
