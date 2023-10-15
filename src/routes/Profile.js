import React, { useEffect, useState, useRef } from "react";
import { authService, dbService, storageService } from "fbase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuid } from "uuid";
import { updateProfile } from "@firebase/auth";
import Navigation from "components/Navigation";
import styled from "styled-components";
import { IoImageOutline } from "react-icons/io5";

const Profile = ({ userObj, refreshUser }) => {
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState("");
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  //쿼리문(필터링)
  const getMyNweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid)
    );
    await getDocs(q);
  };

  const onChange = (e) => {
    setNewDisplayName(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = "";
    if (fileUrl !== "") {
      //파일 경로 참조 만들기
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuid()}`);
      //storage 참조 경로로 파일 업로드 하기
      const response = await uploadString(attachmentRef, fileUrl, "data_url");
      //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
      attachmentUrl = await getDownloadURL(response.ref);
    }
    if (userObj.displayName !== newDisplayName || fileUrl !== "") {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
        photoURL: attachmentUrl,
      });
      refreshUser();
    }
  };
  useEffect(() => {
    getMyNweets();
  }, []);

  const imgRef = useRef(null);
  const onFileChange = (e) => {
    const theFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileUrl(e.currentTarget.result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClickFileBtn = () => {
    imgRef.current.click();
  };

  return (
    <div style={{ display: "flex", paddingLeft: "5%", paddingRight: "5%" }}>
      <Navigation userObj={userObj} />
      <StyledFormContainer onSubmit={onSubmit}>
        {fileUrl && (
          <div style={{ position: "relative" }}>
            <StyledUploadImg src={fileUrl} />
            <StyledDeleteBtn onClick={() => setFileUrl()}>X</StyledDeleteBtn>
          </div>
        )}
        <StyledPreviewBtn onClick={onClickFileBtn}>
          <IoImageOutline style={{ fontSize: 20 }} />
        </StyledPreviewBtn>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ display: "none" }}
          ref={imgRef}
        />
        <input
          type="text"
          placeholder="display Name"
          value={newDisplayName}
          onChange={onChange}
        />
        <input type="submit" value="update Profile" />
        <button onClick={onLogOutClick}>Log Out</button>
      </StyledFormContainer>
    </div>
  );
};

const StyledFormContainer = styled.form`
  position: relative;
  left: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
`;

const StyledPreviewBtn = styled.div`
  cursor: pointer;
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  &:hover {
    background-color: #e7e7e8;
  }
`;

const StyledUploadImg = styled.img`
  position: relative;
  border-radius: 10px;
  width: 50%;
`;
const StyledDeleteBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: black;
  opacity: 0.7;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  border: none;
  font-size: 20px;
  z-index: 10;
  &:hover {
    opacity: 0.5;
  }
`;

export default Profile;
