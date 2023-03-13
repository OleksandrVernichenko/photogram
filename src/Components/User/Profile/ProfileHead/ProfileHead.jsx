import LockPersonIcon from "@mui/icons-material/LockPerson";
import MenuIcon from "@mui/icons-material/Menu";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useTranslation, Trans } from "react-i18next";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import "./profileHead.scss";

export const ProfileHead = (props) => {
  const { i18n } = useTranslation();
  const { nik, name, photo, followers, following, posts } = props;

  return (
    <div className="user_wrap">
      <div className="user_info">
        <div className="user_info-nik">
          <LockPersonIcon fontSize="small" /> {nik}
        </div>
        <div className="user_info-menu">
          <Button>
            <Link
              to="/profile/settings"
              style={{ display: "flex", alignItems: "center" }}
            >
              <MenuIcon fontSize="small" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="user_info--info">
        <div className="user_photo">
          <Avatar sx={{ width: 120, height: 120 }} src={photo} alt="user" />
        </div>
        <HashLink smooth to="/profile#posts" className="user_posts">
          <span className="number">
            {(posts && Object.keys(posts).length) || 0}
          </span>
          <span>
            <Trans i18nKey="profile.post"></Trans>
          </span>
        </HashLink>
        <Link to="/followers" className="user_followers">
          <span className="number">
            {(followers && Object.keys(followers).length) || 0}
          </span>
          <span>
            <Trans i18nKey="profile.followers"></Trans>
          </span>
        </Link>
        <Link to={"/following"} className="user_following">
          <span className="number">{(following && following.length) || 0}</span>
          <span>
            <Trans i18nKey="profile.following"></Trans>
          </span>
        </Link>
      </div>
      <span>{name}</span>
    </div>
  );
};
