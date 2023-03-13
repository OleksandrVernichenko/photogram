import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";
import { useTranslation, Trans } from "react-i18next";

import "./profileInfo.scss";

export const ProfileInfo = (props) => { 
  const { i18n } = useTranslation();
  const { bio, link } = props;
  const links = link ? link.split(" ") : [];

  return (
    <div className="profile_info">
      <p className="profile_info-bio">{bio}</p>
      <ul className="profile_info-links">
        {links.map((l) => (
          <li key={l}>
            <a href={"https://" + l} target="_blank" rel="noreferrer">
              <InsertLinkRoundedIcon
                sx={{ rotate: "-30deg" }}
                fontSize="small"
              />
              <span> {l.split(".")[0]}</span>
            </a>
          </li>
        ))}
      </ul>

      <Button>
        <Link to="/profile/edit">
          <Trans i18nKey="profile.edit"></Trans>
        </Link>
      </Button>
    </div>
  );
};
