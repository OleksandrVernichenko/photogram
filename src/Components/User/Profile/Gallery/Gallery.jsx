import GridOnSharpIcon from "@mui/icons-material/GridOnSharp";
import MusicVideoIcon from "@mui/icons-material/MusicVideo";

import { useTranslation, Trans } from "react-i18next";
import { HashLink } from "react-router-hash-link";

import "./gallery.scss";

export const Gallery = (props) => {
  const { posts } = props;
  const { i18n } = useTranslation();

  const postsToMap =
    (posts &&
      Object.values(posts).sort((a, b) => (a.time < b.time ? 1 : -1))) ||
    [];
  console.log(postsToMap);

  return (
    <div className="galley" id="posts">
      <div className="gallery_switch">
        <button>
          <GridOnSharpIcon fontSize="small" />
        </button>
        <button>
          <MusicVideoIcon fontSize="small" />
        </button>
      </div>
      <div className="posts">
        {(posts &&
          postsToMap.map((post) => (
            <HashLink
              key={post.id}
              className="single_post"
              to={`/posts_list#${post.id}`}
            >
              {post.type === "image" ? null : (
                <MusicVideoIcon
                  sx={{ position: "absolute", top: 5, right: 5, zIndex: 10 }}
                />
              )}
              {post.type === "image" ? (
                <img src={post.image} alt="post" />
              ) : (
                <video src={post.image}></video>
              )}
            </HashLink>
          ))) || (
          <span className="no_posts">
            <Trans i18nKey="profile.no_posts"></Trans>
          </span>
        )}
      </div>
    </div>
  );
};
