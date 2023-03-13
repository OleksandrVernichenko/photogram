import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MusicVideoOutlinedIcon from "@mui/icons-material/MusicVideoOutlined";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./mainNav.scss";

export const MainNav = () => {
  const links = [
    { to: "/", icon: <HomeRoundedIcon /> },
    { to: "/search", icon: <SearchRoundedIcon /> },
    { to: "/add_post", icon: <AddBoxOutlinedIcon /> },
    { to: "/videos", icon: <MusicVideoOutlinedIcon /> },
    { to: "/profile", icon: <AccountCircleOutlinedIcon /> },
  ];
  const location = useLocation();

  console.log(location.pathname);

  return (
    <nav
      className="navigation"
      style={
        location.pathname === "/" || location.pathname === "/profile"
          ? { display: "flex" }
          : { display: "none" }
      }
    >
      {links.map((l) => (
        <NavLink
          style={({ isActive }) => (isActive ? { color: "#90caf9" } : {})}
          to={l.to}
          key={l.to}
        >
          {l.icon}
        </NavLink>
      ))}
    </nav>
  );
};
