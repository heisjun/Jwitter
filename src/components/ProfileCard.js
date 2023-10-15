import React from "react";
import styled from "styled-components";

const ProfileCard = ({ userObj }) => {
  return (
    <StyledCardContainer>
      <img src={userObj.photoURL ? userObj.photoURL : "avatar.png"} />
      <StyledInfoBlock>
        <a>{userObj.displayName}</a>
        <span>{userObj.email}</span>
      </StyledInfoBlock>
    </StyledCardContainer>
  );
};

const StyledCardContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 30px;
  &:hover {
    background-color: #e7e7e8;
  }
  img {
    width: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
`;

const StyledInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  a {
    font-weight: bold;
  }
  span {
    color: gray;
  }
`;
export default ProfileCard;
