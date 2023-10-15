import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "routes/Home";
import Profile from "routes/Profile";
import LoginPage from "routes/LoginPage";
import NweetDetail from "./NweetDetail";

// eslint-disable-next-line import/no-anonymous-default-export
const AppRouter = ({ isLoggedIn, userObj, refreshUser }) => {
  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home userObj={userObj} />} />
            <Route
              path="/profile"
              element={<Profile userObj={userObj} refreshUser={refreshUser} />}
            />
            <Route path="/:id" element={<NweetDetail />} />
          </>
        ) : (
          <>
            <Route path="/" element={<LoginPage />} />
            <Route path="*" element={<Home />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
