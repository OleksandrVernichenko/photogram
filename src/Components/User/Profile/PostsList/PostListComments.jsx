import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { v4 } from "uuid";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { useTranslation, Trans } from "react-i18next";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { database } from "../../../../firebase/firebaseConfig";

export const PostListComments = () => {
  const user = createSelector(
    (state) => state.currentUser,
    (currentUser) => {
      return {
        currentUser: currentUser,
      };
    }
  );
  const { currentUser } = useSelector(user);
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [comments, setComments] = useState({});
  const [text, setText] = useState("");

  const commentsToMap =
    comments &&
    Object.values(comments).sort((a, b) => (a.time < b.time ? -1 : 1));

  useEffect(() => {
    onSnapshot(doc(database, "comments", `${id}`), (docSnap) => {
      if (docSnap.exists()) {
        setComments(docSnap.data());
      } else {
        console.log("no such document");
      }
    });
  }, []);

  const addComment = (e, id) => {
    e.preventDefault();
    const commentId = v4();

    const comment = {
      [commentId]: {
        text: text,
        nik: currentUser.nik || "",
        photo: currentUser.photo || "",
        time: new Date().getTime(),
        id: v4(),
      },
    };

    setDoc(doc(database, "comments", `${id}`), comment, { merge: true });
    setText("");
  };

  return (
    <div className="comments_list">
      <div className="comments_list-nav">
        <button onClick={() => navigate(-1)}>
          <ArrowBackIosRoundedIcon />
        </button>
        <span>
          <Trans i18nKey="comments.comments"></Trans>
        </span>
      </div>

      <div className="comments_list-comment">
        {comments &&
          commentsToMap.map((item) => (
            <div key={item.id} className="single_comment">
              <Avatar src={item.photo} sx={{ height: 40, width: 40 }} />
              <div className="comment-text">
                <span>{item.nik}</span>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
      </div>

      <form name="comments" onSubmit={(e) => addComment(e, id)}>
        <Avatar src={currentUser.photo} sx={{ height: 50, width: 50 }} />

        <TextField
          className="input-comment"
          id="comment-size-small"
          size="small"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ width: "60%" }}
          variant="standard"
        />
        <button
          style={{ opacity: text.length === 0 ? 0.5 : 1 }}
          disabled={text.length === 0 ? true : false}
        >
          <Trans i18nKey="comments.add"></Trans>
        </button>
      </form>
    </div>
  );
};
