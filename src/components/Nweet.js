import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";

import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditig] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
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

  return (
    <div>
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
          <button onClick={toggleEditting}>Cancle </button>
        </>
      ) : (
        <>
          {nweetObj.attachmentUrl && (
            <img src={nweetObj.attachmentUrl} style={{ width: 500 }} />
          )}
          <h4>{nweetObj.text}</h4>
          <div>{nweetObj.createdAt}</div>
          <img src={nweetObj.creatorPic} />
          {isOwner && <button onClick={deleteClick}>Delete</button>}
          {isOwner && <button onClick={toggleEditting}>Edit</button>}
        </>
      )}
    </div>
  );
};

export default Nweet;
