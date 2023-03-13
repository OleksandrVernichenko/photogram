import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { useState } from "react";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  setUserName,
  setUserNik, 
  setUserLink,
  setUserBio,
} from "../../../../actions";
import { storage, database } from "../../../../firebase/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import "./edit.scss";

export const Edit = () => {
  const user = createSelector(
    (state) => state.createUser,

    (createUser) => {
      return {
        createUser: createUser,
      };
    }
  );
  const { createUser } = useSelector(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [photo, setPhoto] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const { i18n } = useTranslation();
  const currentUserRef = doc(database, `users/${createUser.id}/`);

  const onSetProfileInfo = () => {

    
    updateDoc(currentUserRef, {
      bio: createUser.bio,
      link: createUser.link,
      name: createUser.name,
      nik: createUser.nik,
    }).then(() => navigate("/profile"));

    const usersPhotoRef = ref(storage, `users/${photo.name}`);
    const uploadTask = uploadBytesResumable(usersPhotoRef, photo);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (e) => {
        console.log(e);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateDoc(currentUserRef, { photo: downloadURL });
        });
      }
    );
  };

  const onSetImages = (img) => {
    setCurrentImage(img);
  };
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    onSetImages(base64);
    setPhoto(file);
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

  return (
    <div className="edit_profile">
      <div className="edit_profile-buttons">
        <button>
          <Link to={"/profile"}>
            <ArrowBackIosRoundedIcon />
          </Link>
        </button>
        <span style={{ fontWeight: 600 }}>
          <Trans i18nKey="profile.editProfile"></Trans>
        </span>

        <Button onClick={onSetProfileInfo}>
          <Trans i18nKey="profile.done"></Trans>
        </Button>
      </div>

      <div className="edit_profile-photo">
        <Avatar
          sx={{ height: 120, width: 120 }}
          src={currentImage}
          alt="profile"
        />
        <label htmlFor="photo">
          {progress === 0 || progress === 100 ? (
            <>
              <input
                type="file"
                id="photo"
                onInput={(e) => setPhoto(e.target.files[0])}
                onChange={uploadImage}
              />
              <AddPhotoAlternateRoundedIcon />
              <span>
                <Trans i18nKey="profile.photo"></Trans>
              </span>
            </>
          ) : (
            <CircularProgress variant="determinate" value={progress} />
          )}
        </label>
      </div>

      <div className="edit_profile-info">
        <span className="name">
          <Trans i18nKey="profile.name"></Trans>
        </span>
        <TextField
          className="input-name"
          id="name-size-small"
          value={createUser.name}
          onChange={(e) => dispatch(setUserName(e.target.value))}
          size="small"
          sx={{ width: "100%" }}
          variant="standard"
        />
        <span className="userName">
          <Trans i18nKey="profile.username"></Trans>
        </span>
        <TextField
          className="input-userName"
          id="userName-size-small"
          value={createUser.nik || ""}
          size="small"
          onChange={(e) => dispatch(setUserNik(e.target.value))}
          sx={{ width: "100%" }}
          variant="standard"
        />
        <span className="bio">
          <Trans i18nKey="profile.bio"></Trans>
        </span>
        <TextField
          className="input-bio"
          id="userName-size-small"
          value={createUser.bio || ""}
          size="small"
          onChange={(e) => dispatch(setUserBio(e.target.value))}
          sx={{ width: "100%" }}
          variant="standard"
        />
        <span className="link">
          <Trans i18nKey="profile.links"></Trans>
        </span>
        <TextField
          className="input-link"
          id="userName-size-small"
          value={createUser.link || ""}
          size="small"
          onChange={(e) => dispatch(setUserLink(e.target.value))}
          sx={{ width: "100%" }}
          variant="standard"
        />
      </div>
    </div>
  );
};
