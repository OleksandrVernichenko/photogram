import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useTranslation, Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import { database, storage } from "../../firebase/firebaseConfig";
import { v4 } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import "./addPost.scss";

export const AddPost = () => {
  const user = createSelector(
    (state) => state.currentUser,
    (currentUser) => {
      return {
        currentUser: currentUser,
      };
    }
  );

  const { currentUser } = useSelector(user);
  const { i18n } = useTranslation();
  const [currentImage, setCurrentImage] = useState("");
  const [data, setData] = useState("");
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [type, setType] = useState("");
  const [text, setText] = useState("");
  const [created, setCreated] = useState(false);

  const onSetImages = (img) => {
    setCurrentImage(img);
  };
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    onSetImages(base64);
    setData(file);
    setType(data.type.split("/")[0]);
    onSetURL();
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
        onSetImages();
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onSetURL = () => {
    const postsRef = ref(storage, `posts/${data.name}`);
    const uploadTask = uploadBytesResumable(postsRef, data);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // can be used to show upload progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (e) => {
        console.log(e);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          setUrl(downloadURL);
        });
      }
    );
  };

  useEffect(() => {
    let interval;
    if (open) {
      interval = setInterval(() => setOpen(false), 2000);
    }
    return () => clearInterval(interval, 2000);
  }, [open]);

  const testPost = (e) => {
    e.preventDefault();
    const id = v4();
    const postsRef = doc(database, "posts", currentUser.id);

    const post = {
      id: id,
      by: currentUser.name,
      userId: currentUser.id,
      avatar: currentUser.photo || "",
      // url from uploaded photo to storage
      image: url,
      type: type,
      text: text,
      time: new Date().getTime(),
    };

    if (!currentImage) {
      setOpen(true);
    } else {
      // create a new post in post data with user id
      setDoc(postsRef, { [id]: post }, { merge: true });

      setCreated(true);
      setText("");
      setCurrentImage("");
      setData("");
      setUrl("");
    }
  };

  return (
    <div className="add_post">
      <div className="add_post-nav">
        <Link to="/">
          <CloseIcon />
        </Link>
        <span>
          <Trans i18nKey="add_post.new"></Trans>
        </span>
      </div>

      <form name="add_post" onSubmit={(e) => testPost(e)}>
        <div className="image_select">
          <label htmlFor="post_image">
            <input
              type="file"
              id="post_image"
              onInput={(e) => setData(e.target.files[0])}
              onChange={uploadImage}
            />
            <div className="select">
              <span>
                <Trans i18nKey="add_post.select"></Trans>
              </span>
              <AddPhotoAlternateIcon />
            </div>
          </label>

          {currentImage && data.type.split("/")[0] === "image" ? (
            progress === 0 || progress === 100 ? (
              <img src={currentImage} alt="post" />
            ) : (
              <CircularProgress variant="determinate" value={progress} />
            )
          ) : progress === 0 || progress === 100 ? (
            <video src={url} muted autoPlay loop></video>
          ) : (
            <CircularProgress variant="determinate" value={progress} />
          )}

          <Box
            sx={{
              width: "100%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Collapse in={open}>
              <Alert
                severity={"warning"}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                <Trans i18nKey="add_post.select"></Trans>
              </Alert>
            </Collapse>
          </Box>

          <Box
            sx={{
              width: "100%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Collapse in={created}>
              <Alert
                severity={"success"}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setCreated(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                <Trans i18nKey="add_post.done"></Trans>
              </Alert>
            </Collapse>
          </Box>
        </div>

        <div className="description">
          <TextField
            sx={{ width: "100%" }}
            id="post_text"
            label={<Trans i18nKey="add_post.descr"></Trans>}
            multiline
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            variant="standard"
          />
          <Button type="submit" variant="contained">
            <Trans i18nKey="add_post.add"></Trans>
          </Button>
        </div>
      </form>
    </div>
  );
};
