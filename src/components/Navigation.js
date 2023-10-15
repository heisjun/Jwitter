import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import { IoPersonOutline, IoPerson } from "react-icons/io5";
import { HiHome, HiOutlineHome } from "react-icons/hi";

const Navigation = ({ userObj }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <NavigationContainer>
      <UlContainer>
        <StyledLogo src="logo.png" />
        <span onClick={() => navigate("/")}>
          {location.pathname === "/" ? (
            <HiHome style={{ paddingRight: 20, paddingLeft: 10 }} />
          ) : (
            <HiOutlineHome style={{ paddingRight: 20, paddingLeft: 10 }} />
          )}
          Home
        </span>
        <span onClick={() => navigate("/profile")}>
          {location.pathname === "/profile" ? (
            <IoPerson style={{ paddingRight: 20, paddingLeft: 10 }} />
          ) : (
            <IoPersonOutline style={{ paddingRight: 20, paddingLeft: 10 }} />
          )}
          Profile
        </span>
      </UlContainer>
      <ProfileCard userObj={userObj} />
    </NavigationContainer>
  );
};

const NavigationContainer = styled.div`
  width: 250px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
`;

const StyledLogo = styled.img`
  width: 150px;
  cursor: pointer;
`;

const UlContainer = styled.div`
  list-style-type: none;
  display: inline-flex;
  flex-direction: column;
  span {
    display: flex;
    align-items: center;
    font-family: "Oswald", sans-serif;
    padding: 10px;
    box-sizing: border-box;
    font-size: 30px;
    cursor: pointer;
    border-radius: 30px;
    &:hover {
      background-color: #e7e7e8;
    }
  }
`;

export default Navigation;
