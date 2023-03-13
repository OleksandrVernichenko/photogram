import { useParams } from "react-router-dom";
import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { database } from "../../firebase/firebaseConfig";
import { useEffect, useState, useRef } from "react";
import {  useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useTranslation, Trans } from "react-i18next";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Chat = () => {
  const user = createSelector(
    (state) => state.currentUser,
    (currentUser) => {
      return {
        currentUser: currentUser,
      };
    }
  );

  const { currentUser } = useSelector(user);

  const [messages, setMessages] = useState("");
  const [text, setText] = useState("");
  const { id } = useParams();
  const { i18n } = useTranslation();
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const otherMember =
    messages && messages.members.filter((user) => user !== currentUser.id)[0];

  const chatTime = (time) => {
    const date = new Date(time);
    return `${date.getDay()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
  };
  const getMessageTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    onSnapshot(doc(database, "messages", id), (doc) => {
      setMessages(doc.data());
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  const onSendMessage = (e) => {
    e.preventDefault();

    const message = {
      from: currentUser.id,
      text: text,
      time: new Date().getTime(),
    };
    const messageRef = doc(database, "messages", id);

    updateDoc(messageRef, {
      text: arrayUnion(message),
    });
    setText("");
  };

  return (
    <div className="chat">
      <div className="chat_nav">
        <button onClick={() => navigate("/messages")}>
          <ArrowBackIosRoundedIcon />
        </button>
        <h2>
          {messages && messages[otherMember].name}
          <Avatar src={messages && messages[otherMember].photo} />
        </h2>
      </div>

      <div
        className="text_list"
        style={{ height: "100%", overflowY: "scroll" }}
      >
        <span className="date">
          {messages && chatTime(messages.chatStarted)}
        </span>
        {(messages &&
          messages.text?.map((ms) => (
            <Box
              sx={
                ms.from === currentUser.id
                  ? { bgcolor: "info.light" }
                  : { bgcolor: "primary.main" }
              }
              key={ms.text}
              className={ms.from === currentUser.id ? "right" : "left"}
            >
              <Avatar
                sx={
                  ms.from === currentUser.id
                    ? { height: 20, width: 20, position: "absolute", right: 3 }
                    : { height: 20, width: 20, position: "absolute", left: 3 }
                }
                src={
                  ms.from === currentUser.id
                    ? messages[currentUser.id].photo
                    : messages[otherMember].photo
                }
              />
              <Box
                component={"span"}
                sx={{ color: "info.contrastText" }}
                className="text"
              >
                {ms.text}
              </Box>
              <Box
                component={"span"}
                sx={{ color: "info.contrastText" }}
                className="time"
              >
                {getMessageTime(ms.time)}
              </Box>
            </Box>
          ))) || (
          <span>
            <Trans i18nKey="messages.noMs"></Trans>
          </span>
        )}
        <div ref={messagesEndRef} style={{ height: 30 }} />
      </div>

      <form name="message" onSubmit={onSendMessage}>
        <TextField
          id="message"
          variant="filled"
          value={text}
          sx={{ width: "80%" }}
          onChange={(e) => setText(e.target.value)}
        />
        <button disabled={text ? false : true}>
          <SendRoundedIcon fontSize="large" />
        </button>
      </form>
    </div>
  );
};
