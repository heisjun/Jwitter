import React, { useEffect, useState } from "react";
import { dbService, storageService } from "fbase";
import { useLocation } from "react-router-dom";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import styled from "styled-components";
import Navigation from "components/Navigation";

const NweetDetail = () => {
  const location = useLocation();
  const state = location.state;

  const path = String(location.pathname).substring(1);
  const [nweet, setNweet] = useState();
  const [newComment, setNewComment] = useState("");
  const q = query(collection(dbService, "nweets"), where("postId", "==", path));

  const getNweets = async () => {
    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // 일치하는 문서가 하나 이상 존재하는 경우
        querySnapshot.forEach((doc) => {
          const nweetData = doc.data();
          console.log(nweetData);
          setNweet(nweetData);
        });
      } else {
        console.log("일치하는 문서가 없습니다.");
      }
    } catch (error) {
      console.error("문서 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    getNweets();
  }, []);

  const onChange = (e) => {
    setNewComment(e.target.value);
  };

  const sendHandler = async (e) => {
    let comments = nweet.comment;
    e.preventDefault();
    const Comment = {
      text: newComment,
      createdAt: new Date().toString(),
      createTime: new Date(),
    };

    comments.push(Comment);

    const NweetTextRef = doc(dbService, "nweets", `${nweet.id}`);
    await updateDoc(NweetTextRef, {
      comment: comments,
    });
  };
  return (
    <div>
      {nweet && (
        <StyledHomeContainer>
          <Navigation userObj={[]} />
          <NweetContainer>
            <UserInfoContainer>
              {nweet.creatorPic ? (
                <UserImg src={nweet.creatorPic} />
              ) : (
                <UserImg src="avatar.png" />
              )}

              <div style={{ width: 600 }}>
                <UserHeader>
                  <div style={{ display: "flex" }}>
                    <span style={{ fontWeight: "bold", paddingRight: 10 }}>
                      {nweet.creatorName}
                    </span>
                  </div>
                </UserHeader>
                <div>{nweet.text}</div>
                <div>
                  {nweet.attachmentUrl && (
                    <img
                      src={nweet.attachmentUrl}
                      style={{ width: 500, borderRadius: 10, marginTop: 10 }}
                    />
                  )}
                </div>
                <div style={{ display: "flex" }}>
                  <div>댓글{nweet.comment.length}</div>
                </div>
              </div>
            </UserInfoContainer>
            <TweetContainer onSubmit={sendHandler}>
              {state.photoURL ? (
                <UserImg src={state.photoURL} />
              ) : (
                <UserImg src="avatar.png" />
              )}
              <div style={{ width: "100%" }}>
                <StyledTextArea
                  type="text"
                  placeholder="무슨일이 일어났나요?"
                  maxLength={120}
                  onChange={onChange}
                  value={newComment}
                />

                <StyledSubmitBtn type="submit" value="Jweet" />
              </div>
            </TweetContainer>
          </NweetContainer>
        </StyledHomeContainer>
      )}
    </div>
  );
};

const StyledHomeContainer = styled.div`
  display: flex;
  padding-left: 5%;
`;
const NweetContainer = styled.div`
  position: relative;
  left: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;

  border-bottom: 1px solid #eff3f4;
  box-sizing: border-box;
`;
const UserInfoContainer = styled.div`
  display: flex;
`;
const UserImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  margin-right: 12px;
`;
const UserHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  height: 30px;
  justify-content: space-between;
  position: relative;
  div {
    cursor: pointer;
  }
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

export default NweetDetail;
