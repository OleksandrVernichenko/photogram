import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { useNavigate } from "react-router-dom";

export const VideoPage = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          style={{
            position: "absolute",
            left: 0,
            border: 0,
            background: "inherit",
          }}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIosRoundedIcon />
        </button>
        <h2>Video</h2>
      </div>
      <h3 style={{ margin: "30px auto" }}>No videos yet 🥺</h3>
    </div>
  );
};
