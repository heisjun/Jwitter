import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  return (
    <nav>
      <ul>
        <li onClick={() => navigate("./")}>Home</li>
        <li onClick={() => navigate("./profile")}>Profile</li>
      </ul>
    </nav>
  );
};

export default Navigation;
