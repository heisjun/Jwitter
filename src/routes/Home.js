import React, { useEffect, useState } from "react";
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
import Nweet from "components/\bNweet";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
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
      createdAt: Date.now(),
      creatorId: userObj.uid,
      creatorPic: userObj.photoURL,
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
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="무슨일이 일어났나요?"
          maxLength={120}
          onChange={onChange}
          value={nweet}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        {fileUrl && (
          <div>
            <img src={fileUrl} style={{ width: 100 }} />
            <button onClick={() => setFileUrl()}>삭제</button>
          </div>
        )}
        <input type="submit" value="Jweet" />
      </form>
      {nweets.map((item, index) => (
        <Nweet
          nweetObj={item}
          key={index}
          isOwner={item.creatorId === userObj.uid ? true : false}
        />
      ))}
    </div>
  );
};

export default Home;
