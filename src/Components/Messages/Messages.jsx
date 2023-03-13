import "./messages.scss";
import { database } from "../../firebase/firebaseConfig";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { Avatar } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useEffect, useState } from "react";

export const Messages = () => {
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
  const [messages, setMessages] = useState([]);
  const userMessagesRef = collection(database, "messages");
  const q = query(
    userMessagesRef,
    where("members", "array-contains-any", [currentUser.id])
  );

  useEffect(() => {
    onSnapshot(q, (doc) => {
      doc &&
        doc.docs.map((item) =>
          setMessages((prev) => [...prev, { data: item.data(), id: item.id }])
        );
    });
  }, []);

  const otherUserId = (data) => {
    return data.filter((id) => id !== currentUser.id)[0];
  };

  const timePassed = (time) => {
    const now = new Date().getTime();
    const passed = now - time;

    const minutesPassed = Math.floor(passed / (1000 * 60));
    const hoursPassed = Math.floor(passed / (1000 * 60 * 60));
    const daysPassed = Math.floor(passed / (1000 * 60 * 60 * 24));

    return daysPassed > 1
      ? daysPassed + " days"
      : hoursPassed >= 1
      ? hoursPassed + " hour"
      : minutesPassed > 1
      ? minutesPassed + " minutes"
      : "now";
  };
  console.log(messages);
  return (
    <div className="messages">
      <div className="messages_nav">
        <button onClick={() => navigate("/")}>
          <ArrowBackIosRoundedIcon />
        </button>
        <h2>
          <Trans i18nKey="messages.ms"></Trans>
        </h2>
      </div>

      <div className="messages_list">
        {messages.length !== 0 ? (
          messages
            .sort((a, b) =>
              a.data.text.at(-1).time < b.data.text.at(-1).time ? 1 : -1
            )
            .map((ms) => (
              <Link to={`/messages/chat/${ms.id}`} key={ms.id}>
                <Avatar src={ms.data[otherUserId(ms.data.members)].photo} />
                <div className="last_message">
                  <span className="name">
                    {ms.data[otherUserId(ms.data.members)].name}
                  </span>
                  <div className="last_message-data">
                    <span className="text">{ms.data.text.at(-1).text}</span> ⋅
                    <span className="time">
                      {timePassed(ms.data.text.at(-1).time)}
                    </span>
                  </div>
                  <Divider light />
                </div>
              </Link>
            ))
        ) : (
          <span>
            <Trans i18nKey="messages.noChats"></Trans>
          </span>
        )}
      </div>
    </div>
  );
};
