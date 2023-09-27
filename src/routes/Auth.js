import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { authService } from "fbase";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      //기본행위 방지
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      const auth = getAuth();
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  const onSocialLogIn = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    if (name === "google") {
      //구글 로그인
      console.log("구글 로그인");
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      //깃헙로그인
      console.log("깃헙 로그인");
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          autoComplete="email"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          autoComplete="new-password"
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Loged IN"}
        />
      </form>
      {error}
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : " Create Account"}
      </span>
      <div>
        <button name="google" onClick={onSocialLogIn}>
          Continue Google
        </button>
        <button name="github" onClick={onSocialLogIn}>
          {" "}
          Continue Github
        </button>
      </div>
    </div>
  );
};

export default Auth;
