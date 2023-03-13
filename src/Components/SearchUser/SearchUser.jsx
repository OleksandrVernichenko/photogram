import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import "./searchUser.scss";
import { useTranslation, Trans } from "react-i18next";
import { Avatar } from "@mui/material";
import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { database } from "../../firebase/firebaseConfig";

export const SearchUser = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const { i18n } = useTranslation();

  const onSearchUser = (e) => {
    e.preventDefault();

    const usersRef = collection(database, "users");
    const q = query(usersRef, where("nik", "==", `${text}`));
    getDocs(q).then((res) =>
      res.forEach((element) => {
        setUsers((prevState) => [...prevState, element.data()]);
      })
    );
  };

  console.log(users.followingUsers);
  return (
    <div className="search_user">
      <div className="search_nav">
        <button onClick={() => navigate(-1)}>
          <ArrowBackIosRoundedIcon />
        </button>
        <h2><Trans i18nKey="search.search"></Trans></h2>
      </div>
      <form name="search" onSubmit={onSearchUser}>
        <TextField
          id="search-name"
          label={<Trans i18nKey="search.name"></Trans>}
          variant="outlined"
          value={text}
          sx={{ width: "70%" }}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit" sx={{ height: 55 }} variant="contained">
        <Trans i18nKey="search.search"></Trans>
        </Button>
      </form>

      <div className="users_to_show">
        {users.length !== 0
          ? users.map((user) => (
              <Link
                to={`/user/${user.id}`}
                key={user.id}
                className={"single_user"}
              >
                <Avatar src={user.photo} sx={{ height: 50, width: 50 }} />

                <div className="user_info">
                  <span className="name">{user.name}</span>
                  <span className="nik">{user.nik}</span>
                </div>
              </Link>
            ))
          : null}
        {console.log(users)}
      </div>
    </div>
  );
};
