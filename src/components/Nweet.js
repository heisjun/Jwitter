import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import styled from "styled-components";
import React, { useState } from "react";
import TimeAgo from "./TimeAgo";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Nweet = ({ nweetObj, isOwner, userObj }) => {
  console.log("nweetObj", nweetObj);
  const navigate = useNavigate();
  const [editing, setEditig] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [isModal, setIsModal] = useState(false);
  const desertRef = ref(storageService, nweetObj.attachmentUrl);
  const deleteClick = async () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
    if (ok) {
      try {
        //해당하는 트윗 파이어스토어에서 삭제
        await deleteDoc(NweetTextRef);
        //삭제하려는 트윗에 이미지 파일이 있는 경우 이미지 파일 스토리지에서 삭제
        if (nweetObj.attachmentUrl !== "") {
          await deleteObject(desertRef);
        }
      } catch (error) {
        window.alert("트윗을 삭제하는 데 실패했습니다!");
      }
    }
  };

  const toggleEditting = () => {
    setEditig((prev) => !prev);
  };

  const onChange = (e) => {
    setNewNweet(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });
    setEditig(false);
  };

  const onDropDown = () => {
    setIsModal((prev) => !prev);
  };

  const sendHandler = async (e) => {
    let comments = nweetObj.comment;
    e.preventDefault();
    const newComment = {
      text: "댓글",
      createdAt: new Date().toString(),
      createTime: new Date(),
    };

    comments.push(newComment);

    const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
    await updateDoc(NweetTextRef, {
      comment: comments,
    });
    setEditig(false);
  };

  const onGoDetail = () => {
    const dataToSend = {
      displayName: userObj.displayName,
      photoURL: userObj.photoURL,
      email: userObj.email,
    };
    navigate(`./${nweetObj.postId}`, { state: dataToSend });
  };

  return (
    <div style={{ width: 600 }} onClick={onGoDetail}>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="수정할 내용을 쓰시오"
              value={newNweet}
              onChange={onChange}
              required
            />
            <input type="submit" value="수정" />
          </form>
          <div>{nweetObj.createdAt}</div>
          <img src={nweetObj.creatorPic} />
          <button onClick={toggleEditting}>Cancle</button>
        </>
      ) : (
        <NweetContainer>
          <UserInfoContainer>
            {nweetObj.creatorPic ? (
              <UserImg src={nweetObj.creatorPic} />
            ) : (
              <UserImg src="avatar.png" />
            )}

            <div style={{ width: 600 }}>
              <UserHeader>
                <div style={{ display: "flex" }}>
                  <span style={{ fontWeight: "bold", paddingRight: 10 }}>
                    {nweetObj.creatorName}
                  </span>
                  <TimeAgo timestamp={nweetObj.createdAt} />
                </div>

                {isOwner && (
                  <div onClick={onDropDown}>
                    <IoEllipsisHorizontal style={{ fontSize: 20 }} />
                  </div>
                )}
                {isModal && (
                  <ModalDropDown>
                    <ModalContent onClick={deleteClick}>삭제</ModalContent>
                    <ModalContent onClick={toggleEditting}>수정</ModalContent>
                  </ModalDropDown>
                )}
              </UserHeader>
              <div>{nweetObj.text}</div>
              <div>
                {nweetObj.attachmentUrl && (
                  <img
                    src={nweetObj.attachmentUrl}
                    style={{ width: 500, borderRadius: 10, marginTop: 10 }}
                  />
                )}
              </div>
              <div style={{ display: "flex" }}>
                <div>댓글{nweetObj.comment.length}</div>
              </div>
            </div>
          </UserInfoContainer>
        </NweetContainer>
      )}
    </div>
  );
};

const NweetContainer = styled.div`
  width: 100%;
  border-bottom: 1px solid #eff3f4;
  padding: 10px;
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

const ModalDropDown = styled.div`
  :hover {
    background-color: lightgray;
  }
  background-color: white;
  position: absolute;
  right: 0px;
  bottom: -50px;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 2px 5px gray;
  box-sizing: border-box;
  border-radius: 5px;
`;

const ModalContent = styled.div`
  position: relative;
  z-index: 100;
  line-height: 150%;
  width: 60px;
  border-radius: 5px;
  padding: 5px;
`;
export default Nweet;
