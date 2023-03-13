import CakeIcon from "@mui/icons-material/Cake";
import TextField from "@mui/material/TextField";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import { useTranslation, Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { setUserBDay } from "../../../actions";

// firebase
import { database } from "../../../firebase/firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore";

import "./createAccount.scss";

export const CreateAccountDate = () => {
  const { i18n } = useTranslation();
  const auth = getAuth();
  const dispatch = useDispatch();

  const collectionRef = collection(database, "users");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const onSetStringDate = (e, fn) => {
    const date = `${e.$D} ${months[e.$M]} ${e.$y}`;
    dispatch(fn(date));
  };

  const userInputs = createSelector(
    (state) => state.createUser,
    (createUser) => {
      return {
        createUser,
      };
    }
  );
  const user = useSelector(userInputs);
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

  const onCreate = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(
      auth,
      user.createUser.email,
      user.createUser.pass
    )
      .then((res) => {
        console.log(res.user);
        addUserToDatabase(
          user.createUser.name,
          user.createUser.nik,
          user.createUser.email,
          user.createUser.birth,
          res.user.uid
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="date_select">
      <div className="icons">
        <CakeIcon fontSize="large" /> <CakeIcon fontSize="large" />
        <CakeIcon fontSize="large" />
      </div>
      <h3>
        <Trans i18nKey="create.set"></Trans>
      </h3>
      <form name="date" onSubmit={(e) => onCreate(e)}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            label="Birthday"
            value={user.createUser.birth}
            onChange={(e) => onSetStringDate(e, setUserBDay)}
            inputFormat="DD/MM/YYYY"
            renderInput={(params) => <TextField {...params} required />}
          />
        </LocalizationProvider>
        <Button
          onClick={(e) => onCreate(e)}
          variant="contained"
          type="submit"
          sx={{ height: 55 }}
        >
          <Link to="/login">
            <Trans i18nKey="create.done"></Trans>
          </Link>
        </Button>
      </form>

      <div className="select_date_login">
        <Box component={"span"}>
          <Trans i18nKey="create.have"></Trans>{" "}
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
