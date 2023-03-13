import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button } from "@mui/material";
import { useState } from "react";
import { Box } from "@mui/system";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSelector } from "reselect";
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { database } from "../../../firebase/firebaseConfig";
import { collection, setDoc, doc, getDoc } from "firebase/firestore";

import {
  setUserName,
  setUserEMail,
  setUserNik,
  setUserPass,
} from "../../../actions";
import "./createAccount.scss";

export const CreateAccount = () => {
  const { i18n } = useTranslation();
  const auth = getAuth();
  const collectionRef = collection(database, "users");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const userInputs = createSelector(
    (state) => state.createUser,
    (createUser) => {
      return {
        createUser,
      };
    }
  );
  const user = useSelector(userInputs);
  const dispatch = useDispatch();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const onCreateUser = (e) => {
    e.preventDefault();
  };
  const addUserToDatabase = (name, nik, email, birth, id) => {
    const user = {
      name: name,
      nik: nik,
      email: email,
      birth: birth,
      id: id,
    };

    setDoc(doc(collectionRef, id), user);
  };
  const onLoginWithFB = () => {
    const provider = new FacebookAuthProvider();

    signInWithPopup(auth, provider)
      .then((res) => {
        console.log(res);

        getDoc(doc(database, "users", res.user.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            navigate("/profile");
          } else {
            addUserToDatabase(
              res.user.displayName,
              res.user.email,
              res.user.uid
            );
            navigate("/profile");
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="create_user">
      <h1>Photogram</h1>
      <h2>
        <Trans i18nKey="create.create"></Trans>
      </h2>

      <div className="create_facebook">
        <Button
          onClick={onLoginWithFB}
          sx={{
            textAlign: "center",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FacebookIcon />
          <span>
            <Trans i18nKey="create.logWFB"></Trans>
          </span>
        </Button>
      </div>
      <Box component={"span"} className="variant_create">
        <Trans i18nKey="create.or"></Trans>
      </Box>
      <form name="create" onSubmit={(e) => onCreateUser(e)}>
        <TextField
          className="add_shadow"
          variant="outlined"
          value={user.createUser.email}
          onChange={(e) => dispatch(setUserEMail(e.target.value))}
          label={<Trans i18nKey="create.email"></Trans>}
        />
        <TextField
          className="add_shadow"
          variant="outlined"
          value={user.createUser.name}
          onChange={(e) => dispatch(setUserName(e.target.value))}
          label={<Trans i18nKey="create.name&last"></Trans>}
        />
        <TextField
          className="add_shadow"
          variant="outlined"
          value={user.createUser.nik}
          onChange={(e) => dispatch(setUserNik(e.target.value))}
          label={<Trans i18nKey="create.user"></Trans>}
        />
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            <Trans i18nKey="create.pass"></Trans>
          </InputLabel>
          <OutlinedInput
            value={user.createUser.pass}
            onChange={(e) => dispatch(setUserPass(e.target.value))}
            className="add_shadow"
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label={<Trans i18nKey="create.pass"></Trans>}
          />
        </FormControl>
        <Button variant="contained" type="submit" sx={{ height: 55 }}>
          <Link to="/login/create/date">
            <Trans i18nKey="create.next"></Trans>
          </Link>
        </Button>
      </form>

      <div className="create_account_login">
        <Box component={"span"}>
          <Trans i18nKey="create.have"></Trans>
        </Box>
        <Button>
          <Link to={"/login"}>
            <Trans i18nKey="create.login"></Trans>
          </Link>
        </Button>
      </div>
    </div>
  );
};
