import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { Link } from "react-router-dom";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTranslation, Trans } from "react-i18next";
import { useState, useContext } from "react";
import { ColorModeContext } from "../../Theme/theme.context";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

import ua from "../../../assets/ua.png";
import en from "../../../assets/uk.png";

import "./settings.scss";
import { Button } from "@mui/material";

export const Settings = () => {
  const auth = getAuth();
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [mode, setMode] = useState("dark");
  const navigate = useNavigate();
  const colorMode = useContext(ColorModeContext);

  const handleAlignment = (event, lng) => {
    if (lng !== null) {
      setLang(lng);
    }
  };

  const onModeSet = (e, value) => {
    if (value !== null) {
      setMode(value);
    }
  };

  const onLogOut = () => {
    signOut(auth)
      .then(() => {
        console.log("user logged out");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const langButtons = [
    {
      value: "ua",
      buttonStyle: { height: "37px", width: "45px" },
      img: ua,
      imgStyle: { height: 25, width: 35 },
    },
    {
      value: "en",
      buttonStyle: { height: "37px", width: "45px" },
      img: en,
      imgStyle: { height: 25, width: 35 },
    },
  ];

  const themeButtons = [
    {
      value: "light",
      type: "submit",
      style: { height: "37px", width: "45px" },
      icon: <LightModeIcon fontSize="large" />,
    },
    {
      value: "dark",
      type: "submit",
      style: { height: "37px", width: "45px" },
      icon: <DarkModeIcon fontSize="large" />,
    },
  ];

  return (
    <div className="settings">
      <div className="settings-nav">
        <Link to={"/profile"}>
          <ArrowBackIosRoundedIcon fontSize="small" />
        </Link>
        <span>
          <Trans i18nKey="settings.logo"></Trans>
        </span>
      </div>
      <div className="swithers">
        <div className="settings-lang_select">
          <span>
            <Trans i18nKey="settings.lang"></Trans>
          </span>
          <ToggleButtonGroup
            exclusive
            className="settings_toggle"
            onChange={handleAlignment}
            value={lang}
          >
            {langButtons.map((item) => (
              <ToggleButton
                key={item.value}
                value={item.value}
                type="submit"
                sx={item.buttonStyle}
                onClick={() => i18n.changeLanguage(item.value)}
              >
                <img src={item.img} alt="language" style={item.imgStyle} />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        <div className="theme_mode">
          <span>
            <Trans i18nKey="settings.theme"></Trans>
          </span>
          <ToggleButtonGroup
            className="settings_toggle"
            exclusive
            onChange={onModeSet}
            value={mode}
          >
            {themeButtons.map((item) => (
              <ToggleButton
                key={item.value}
                value={item.value}
                sx={item.style}
                type="submit"
                onClick={() => colorMode.toggleColorMode(item.value)}
              >
                {item.icon}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
      </div>
      <Button
        variant="contained"
        sx={{ width: 200, margin: "0 auto" }}
        onClick={onLogOut}
      >
        <Trans i18nKey="settings.out"></Trans>
      </Button>
    </div>
  );
};
