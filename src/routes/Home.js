import React, { useEffect, useState, useRef, useCallback } from "react";
import { dbService, dbGetDoc, dbCollection, storageService } from "fbase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import Navigation from "components/Navigation";
import Nweet from "components/Nweet";
import styled from "styled-components";
import { IoImageOutline } from "react-icons/io5";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const textRef = useRef();

  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createTime", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (fileUrl !== "") {
      //파일 경로 참조 만들기
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuid()}`);
      //storage 참조 경로로 파일 업로드 하기
      const response = await uploadString(attachmentRef, fileUrl, "data_url");
      //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const nweetObj = {
      text: nweet,
      createdAt: new Date().toString(),
      createTime: new Date(),
      creatorId: userObj.uid,
      creatorPic: userObj.photoURL,
      creatorName: userObj.displayName,
      postId: uuid(),
      comment: [],
      attachmentUrl,
    };

    try {
      await addDoc(collection(dbService, "nweets"), nweetObj);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setNweet("");
    setFileUrl("");
  };
  const onChange = ({ target: { value } }) => {
    setNweet(value);
  };

  const onFileChange = (e) => {
    const theFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileUrl(e.currentTarget.result);
    };
    reader.readAsDataURL(theFile);
  };

  const imgRef = useRef(null);

  const onClickFileBtn = () => {
    imgRef.current.click();
  };
  return (
    <StyledHomeContainer>
      <Navigation userObj={userObj} />
      <HomeContainer>
        <TweetContainer onSubmit={onSubmit}>
          {userObj.photoURL ? (
            <UserImg src={userObj.photoURL} />
          ) : (
            <UserImg src="avatar.png" />
          )}
          <div style={{ width: "100%" }}>
            <StyledTextArea
              type="text"
              placeholder="무슨일이 일어났나요?"
              maxLength={120}
              onChange={onChange}
              value={nweet}
              ref={textRef}
            />
            {fileUrl && (
              <div style={{ position: "relative" }}>
                <StyledUploadImg src={fileUrl} />
                <StyledDeleteBtn onClick={() => setFileUrl()}>
                  X
                </StyledDeleteBtn>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
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

              <StyledSubmitBtn type="submit" value="Jweet" />
            </div>
          </div>
        </TweetContainer>

        <NweetContainer>
          {nweets.map((item, index) => (
            <Nweet
              nweetObj={item}
              userObj={userObj}
              key={index}
              isOwner={item.creatorId === userObj.uid ? true : false}
            />
          ))}
        </NweetContainer>
      </HomeContainer>
    </StyledHomeContainer>
  );
};

const StyledHomeContainer = styled.div`
  display: flex;
  padding-left: 5%;
`;
const StyledSubmitBtn = styled.input`
  border: none;
  border-radius: 20px;
  background-color: #3f86f4;
  padding: 0px 10px;
  color: white;
  font-weight: 300;
`;
const StyledUploadImg = styled.img`
  position: relative;
  border-radius: 10px;
  width: 100%;
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

const TweetContainer = styled.form`
  display: flex;
  padding: 10px;
  box-sizing: border-box;
  width: 600px;
  height: auto;
  textarea:focus {
    outline: none;
  }
`;
const UserImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  margin-right: 12px;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  resize: none;
  height: auto;
  border: none;
  font-size: 20px;
  padding: 10px 0px;
`;

const HomeContainer = styled.div`
  position: relative;
  left: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
`;

const NweetContainer = styled.div`
  border-top: 1px solid #eff3f4;
  border-right: 1px solid #eff3f4;
  border-left: 1px solid #eff3f4;
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
export default Home;
