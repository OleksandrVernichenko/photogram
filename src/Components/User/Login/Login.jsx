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
import { Link, useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { database } from "../../../firebase/firebaseConfig";
import { collection, setDoc, doc, getDoc } from "firebase/firestore";

import "./login.scss";
import ua from "../../../assets/ua.png";
import uk from "../../../assets/uk.png";

export const Login = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState("en");
  const collectionRef = collection(database, "users");
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    pass: "",
  });
  const auth = getAuth();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

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

  const onStateChangeHandle = (e) => {
    const inputs = { [e.target.name]: e.target.value };
    setUserData({ ...userData, ...inputs });
  };
  const onSignIn = (e) => {
    e.preventDefault();
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, userData.email, userData.pass);
      })
      .then((res) => {
        console.log(res);
        navigate("/profile");
      })
      .catch((e) => console.log(e));
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

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="login">
      <Button
        sx={{ width: "max-content", justifySelf: "end" }}
        onClick={() => {
          setLang(lang === "en" ? "ua" : "en");
          i18n.changeLanguage(lang === "en" ? "ua" : "en");
        }}
      >
        <img src={lang === "ua" ? ua : uk} alt="" height={15} width={25} />
      </Button>
      <h1>Photogram</h1>
      <form name="login" onSubmit={onSignIn}>
        <TextField
          className="add_shadow"
          variant="outlined"
          type={"email"}
          name="email"
          value={userData.email}
          onChange={onStateChangeHandle}
          label={<Trans i18nKey="login.email"></Trans>}
        />
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            <Trans i18nKey="login.pass"></Trans>
          </InputLabel>
          <OutlinedInput
            className="add_shadow"
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            name="pass"
            autoComplete="on"
            value={userData.pass}
            onChange={onStateChangeHandle}
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
            label={<Trans i18nKey="login.pass"></Trans>}
          />
        </FormControl>
        <Button variant="contained" type="submit" sx={{ height: 55 }}>
          <Trans i18nKey="login.log"></Trans>
        </Button>
      </form>

      <Box component={"span"} className="variant">
        <Trans i18nKey="login.or"></Trans>
      </Box>

      <div className="facebook">
        <Button
          sx={{
            textAlign: "center",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
          onClick={onLoginWithFB}
        >
          <FacebookIcon />
          <span>
            <Trans i18nKey="login.logWFB"></Trans>
          </span>
        </Button>
      </div>
      <div className="create_account">
        <Box component={"span"}>
          <Trans i18nKey="login.noAcc"></Trans>
        </Box>
        <Button>
          <Link to={"/login/create"}>
            <Trans i18nKey="login.signup"></Trans>
          </Link>
        </Button>
      </div>
    </div>
  );
};
