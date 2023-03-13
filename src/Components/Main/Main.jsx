import MessageIcon from "@mui/icons-material/Message";
import { Link } from "react-router-dom";
import withAuth from "./mainPageHOC";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";
import { StoriesSlider } from "./Stories/Stories";
import { MainPostList } from "./MainPostList/MainPostList";

import { database } from "../../firebase/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import "./main.scss";
import { useEffect, useState } from "react";

const Main = () => {
  const user = createSelector(
    (state) => state.currentUser,
    (currentUser) => {
      return {
        currentUser: currentUser,
      };
    }
  );

  const { currentUser } = useSelector(user);

  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);

  const getPosts = () => {
    currentUser.following?.forEach((user) => {
      onSnapshot(doc(database, "posts", user), (res) => {
        if (res.exists()) {
          setPosts((post) => [...post, res.data()]);
        } else {
          console.log("no data");
        }
      });
    });
  };

  const getStories = () => {
    currentUser.following?.forEach((user) => {
      onSnapshot(doc(database, "story", user), (res) => {
        if (res.exists()) {
          setStories((story) => [...story, res.data()]);
        } else {
          console.log("no data");
        }
      });
    });
  };

  useEffect(() => {
    getPosts();
    getStories();
  }, []);

  return (
    <div className="main_page">
      <div className="main_page-nav">
        <h2>Photogram</h2>
        <Link to="messages">
          <MessageIcon />
        </Link>
      </div>

      <StoriesSlider user={currentUser} stories={stories} />
      <MainPostList posts={posts} />
    </div>
  );
};

export default withAuth(Main);
