import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Avatar } from "@mui/material";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { useTranslation, Trans } from "react-i18next";
import add from "../../../assets/add.png";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Stories from "react-insta-stories";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import {
  arrayUnion,
  doc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { database } from "../../../firebase/firebaseConfig";
import "./slider.scss";

export const StoriesSlider = (props) => {
  const sliderSettings = {
    className: "slider",
    centerPadding: "30px",
    slidesToShow: 4.5,
    infinite: false,
    swipeToSlide: true,
    dots: false,
    arrows: false,
  };

  const stories =
    props.stories &&
    Object.values(props.stories).map((item) => Object.values(item));

  const { i18n } = useTranslation();
  const [imo, setImo] = useState(false);
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(false);
  const [text, setText] = useState("");
  const emoji = ["😁", "😆", "😍", "🥰", "😕", "🥺", "🔥", "💦"];

  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 25,
    height: 25,
    background: "white",
    border: `2px solid ${theme.palette.background.paper}`,
  }));

  const storyContent = {
    maxWidth: "100%",
    maxHeight: "max-content",
    margin: "auto",
  };

  const onSendMessage = (e, userId, userPhoto, userName) => {
    e.preventDefault();
    const messages = collection(database, "messages");

    const message = {
      from: props.user.id,
      text: `story reaction:  ${text}`,
      time: new Date().getTime(),
    };

    const q1 = query(
      messages,
      // exact matching [[user1, user2]]
      where("members", "in", [[userId, props.user.id]])
    );

    const q2 = query(
      messages,
      where("members", "in", [[props.user.id, userId]])
    );

    getDocs(q1).then((res) => {
      if (res.docs.map((item) => item.data()).length === 0) {
        // if q1 has now chat
        getDocs(q2).then((res) => {
          // if q2 has chat
          if (res.docs.map((item) => item.data()).length !== 0) {
            const messageId = res.docs.map((item) => item.id)[0];
            updateDoc(doc(database, "messages", messageId), {
              text: arrayUnion(message),
            });
          } else {
            let messageId;
            // if q2 && q1 has no chat
            // create new chat
            console.log("new doc");
            // if no any docs find, create a new doc with 2 members etc.
            addDoc(collection(database, "messages"), {
              members: arrayUnion(props.user.id, userId),
              chatStarted: new Date().getTime(),

              [`${[props.user.id]}`]: {
                name: props.user.name,
                photo: props.user.photo || "",
              },
              [`${[userId]}`]: {
                name: userName,
                photo: userPhoto || "",
              },
            })
              .then((res) => (messageId = res.id))
              .then(() => {
                updateDoc(doc(database, "messages", messageId), {
                  text: arrayUnion(message),
                });
              })
              .catch((e) => console.log(e));
          }
        });
      } else {
        // if q1 has chat
        const messageId = res.docs.map((item) => item.id)[0];
        updateDoc(doc(database, "messages", messageId), {
          text: arrayUnion(message),
        });
      }
    });

    setText("");
    setImo(false);
    setPaused(false);
    console.log(userId);
    console.log(userPhoto);
  };

  return (
    <div className="stories_list">
      <Slider {...sliderSettings}>
        <Link className="add_story" to={"add_story"}>
          <Badge
            style={{
              marginRight: 20,
            }}
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={<SmallAvatar alt="Remy Sharp" src={add} />}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 61,
                width: 61,
                borderRadius: "50%",
                background: "linear-gradient(to right, red, orange)",
              }}
            >
              <Avatar
                alt="Travis Howard"
                sx={{
                  height: 57,
                  width: 57,
                }}
                src={props.user.photo}
              />
            </div>
          </Badge>
          <p>
            <Trans i18nKey="main.story"></Trans>
          </p>
        </Link>
        {stories.map((user, i) => (
          <div key={i} className={"test"}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                height: 61,
                width: 61,
                borderRadius: "50%",
                background: "linear-gradient(to right, red, orange)",
              }}
            >
              <Avatar
                sx={{ height: 57, width: 57 }}
                src={user[0].header.profileImage}
                onClick={() => {
                  setIndex(`${i}`);
                }}
              />
            </div>
          </div>
        ))}
      </Slider>

      {index !== false || index === 0 ? (
        <div
          className="user_story"
          style={
            index
              ? {
                  display: "",
                }
              : { display: "none" }
          }
        >
          <button onClick={() => setIndex(false)} className="close_story">
            <CloseRoundedIcon />
          </button>
          <Stories
            stories={stories[index]}
            defaultInterval={3500}
            width={"100%"}
            height={"100%"}
            style={{
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
            }}
            storyStyles={storyContent}
            loop={false}
            keyboardNavigation={true}
            isPaused={paused}
            onAllStoriesEnd={() => {
              setIndex(false);
            }}
          />
          <form
            name="message_story"
            className="story_replay"
            onSubmit={(e) =>
              onSendMessage(
                e,
                stories[index][0].userId,
                stories[index][0].header.profileImage,
                stories[index][0].header.heading
              )
            }
          >
            <div
              className="icon_select"
              style={imo ? { display: "" } : { display: "none" }}
            >
              {emoji.map((ico) => (
                <span
                  key={ico}
                  onClick={() => setText(ico)}
                  style={{ cursor: "pointer" }}
                >
                  {ico}
                </span>
              ))}
            </div>
            <TextField
              id="message_story"
              placeholder="Text..."
              size="small"
              required
              sx={{ width: "60%" }}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (text.length !== 0) {
                  setImo(false);
                }
              }}
              onClick={() => {
                setImo(true);
                setPaused(true);
              }}
            />
            <Button
              sx={{ height: 40 }}
              variant="contained"
              type="submit"
              onClick={() => setPaused(false)}
            >
              Send
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
};
