import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation, Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import { database, storage } from "../../firebase/firebaseConfig";
import { v4 } from "uuid";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import "./addStory.scss";

export const AddStory = () => {
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
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");
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
    const storiesRef = ref(storage, `stories/${data.name}`);
    const uploadTask = uploadBytesResumable(storiesRef, data);
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
    const postsRef = doc(database, "story", currentUser.id);

    const post = {
      id: id,
      userId: currentUser.id,
      header: {
        heading: currentUser.name,
        subheading: currentUser.nik || "",
        profileImage: currentUser.photo || "",
      },
      // url from uploaded photo to storage
      url: url,
      type: type,
      time: new Date().getTime() + 24 * 60 * 60 * 1000,
    };

    if (!currentImage) {
      setOpen(true);
    } else {
      // create a new post in post data with user id
      setDoc(postsRef, { [id]: post }, { merge: true });

      updateDoc(doc(database, "users", currentUser.id), {
        story: arrayUnion(id),
      });

      setCreated(true);
      setCurrentImage("");
      setData("");
      setUrl("");
    }
  };

  return (
    <div className="add_stories">
      <div className="add_stories-nav">
        <Link to="/">
          <CloseIcon />
        </Link>
        <span>
          <Trans i18nKey="add_post.new"></Trans>
        </span>
      </div>

      <form name="add_stories" onSubmit={(e) => testPost(e)}>
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
                <Trans i18nKey="add_post.story"></Trans>
              </Alert>
            </Collapse>
          </Box>
        </div>

        <div className="description">
          <Button type="submit" variant="contained">
            add story
          </Button>
        </div>
      </form>
    </div>
  );
};
