import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Box } from "@mui/system";
import { useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ColorModeContext } from "../Theme/theme.context";

import { LoginPage } from "../Pages";
import { CreateAccountPage } from "../Pages/CreateAccountPage";
import { CreateAccountDate } from "../User/CreateAccount/CreateAccountDate";
import { ProfilePage } from "../Pages";
import { EditProfile } from "../Pages";
import { MainNav } from "../Main/MainNav/MainNav";
import { SettingsPage } from "../Pages";
import { AddPostPage } from "../Pages";
import { MessagesPage } from "../Pages";
import { Chat } from "../Messages/Chat";
import { MainPage } from "../Pages";
import { FollowersPage } from "../Pages";
import { FollowingPage } from "../Pages";
import { PostsList } from "../User/Profile/PostsList/PostsList";
import { PostListComments } from "../User/Profile/PostsList/PostListComments";
import { SearchPage } from "../Pages";
import { OtherUser } from "../OtherUsers/OtherUsers";
import { OtherUserPosts } from "../OtherUsers/OtherUserPosts/OtherUserPosts";
import { AddStory } from "../AddStory/AddStory";
import { VideoPage } from "../Pages";
import "./app.scss";

const App = () => {
  return (
    <Box
      className="box_insta"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        transition: ".5s ease",
        overflow: "scroll",
        height: "100vh",
        position: "relative",
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/videos" element={<VideoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/create" element={<CreateAccountPage />} />
          <Route path="/login/create/date" element={<CreateAccountDate />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/posts_list" element={<PostsList />} />
          <Route
            path="/posts_list/comments/:id"
            element={<PostListComments />}
          />
          <Route path="/user/:id" element={<OtherUser />} />
          <Route path="/user/user_posts" element={<OtherUserPosts />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/settings" element={<SettingsPage />} />
          <Route path="/add_post" element={<AddPostPage />} />
          <Route path="/add_story" element={<AddStory />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/chat/:id" element={<Chat />} />
          <Route path="/followers" element={<FollowersPage />} />
          <Route path="/following" element={<FollowingPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
        <MainNav />
      </BrowserRouter>
    </Box>
  );
};

export const AppWrapped = () => {
  const [mode, setMode] = useState("dark");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: (mode) => {
        setMode(mode);
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
