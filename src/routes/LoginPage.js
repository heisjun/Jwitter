import React, { useState } from "react";
import styled from "styled-components";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { authService } from "fbase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rightPanelActive, setRightPanelActive] = useState(false);
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
      if (rightPanelActive) {
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (error) {
      if (
        error.message === "Firebase: Error (auth/invalid-login-credentials)."
      ) {
        setError("비밀번호를 확인해주세요");
      } else if (error.message === "Firebase: Error (auth/invalid-email).") {
        setError("이메일을 확인해주세요");
      } else {
        setError(error.message);
      }
    }
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
    await signInWithPopup(authService, provider);
  };

  const handleSignUpClick = () => {
    setRightPanelActive(true);
  };

  const handleSignInClick = (e) => {
    setRightPanelActive(false);
  };

  return (
    <AuthContainer>
      <Container>
        <FormSignUpContainer $rightpanelactive={rightPanelActive}>
          <FormContainer action="#">
            <h1>Create Account</h1>
            <div className="social-container">
              <img src="github-mark.png" />
              <img src="google-mark.png" />
            </div>
            <span>or use your email for registration</span>
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
            <span style={{ color: "red", fontSize: 12, padding: 5 }}>
              {error}
            </span>
            <button onClick={onSubmit}>회원가입</button>
          </FormContainer>
        </FormSignUpContainer>
        <FormSignInContainer $rightpanelactive={rightPanelActive}>
          <FormContainer action="#">
            <img src="logo.png" style={{ width: 100 }} />

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
            <span style={{ color: "red", fontSize: 12, padding: 5 }}>
              {error}
            </span>
            <button onClick={onSubmit}>로그인</button>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 16,
                marginBottom: 16,
              }}
            >
              <div
                style={{ height: 1, width: "25%", backgroundColor: "black" }}
              />
              <span>or use your account</span>
              <div
                style={{ height: 1, width: "25%", backgroundColor: "black" }}
              />
            </div>

            <div className="social-container">
              <img
                src="github-mark.png"
                name="github"
                onClick={onSocialLogIn}
              />
              <img
                src="google-mark.png"
                name="google"
                onClick={onSocialLogIn}
              />
            </div>
          </FormContainer>
        </FormSignInContainer>
        <OverlayContainer $rightpanelactive={rightPanelActive}>
          <OverlayContents $rightpanelactive={rightPanelActive}>
            <OverlayContentsLeft $rightpanelactive={rightPanelActive}>
              <h1>Welcome Back!</h1>
              <p>계정이 있다면 로그인하세요!</p>
              <button className="ghost" id="signIn" onClick={handleSignInClick}>
                로그인
              </button>
            </OverlayContentsLeft>
            <OverlayContentsRight $rightpanelactive={rightPanelActive}>
              <h1>Jwitter!</h1>
              <p>간단한 회원가입을 통해 Jwitter를 이용해보세요!</p>
              <button className="ghost" id="signUp" onClick={handleSignUpClick}>
                회원가입
              </button>
            </OverlayContentsRight>
          </OverlayContents>
        </OverlayContainer>
      </Container>
    </AuthContainer>
  );
};
const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
`;

const AuthContainer = styled.div`
  background: #f6f5f7;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  height: 100vh;
  margin: -20px 0 50px;
  button {
    border-radius: 20px;
    border: 1px solid #1c9bef;
    background-color: #1c9bef;
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
  }

  button:active {
    transform: scale(0.95);
  }

  button:focus {
    outline: none;
  }

  button.ghost {
    background-color: transparent;
    border-color: #ffffff;
  }
  h1 {
    font-weight: bold;
    margin: 0;
  }

  h2 {
    text-align: center;
  }

  p {
    font-size: 14px;
    font-weight: 100;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 20px 0 30px;
  }

  span {
    font-size: 12px;
  }

  a {
    color: #333;
    font-size: 14px;
    text-decoration: none;
    margin: 15px 0;
  }
`;

const FormContainer = styled.form`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
  input {
    background-color: #eee;
    border: none;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
  }
  .social-container {
    margin: 20px 0;
  }

  .social-container img {
    border: 1px solid #dddddd;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    height: 40px;
    width: 40px;
  }
`;

const FormSignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  transform: ${(props) => (props.$rightpanelactive ? "translateX(100%)" : "")};
`;

const FormSignUpContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: ${(props) => (props.$rightpanelactive ? 1 : 0)};
  z-index: ${(props) => (props.$rightpanelactive ? 5 : 1)};
  transform: ${(props) => (props.$rightpanelactive ? "translateX(100%)" : "")};
  animation: ${(props) => (props.$rightpanelactive ? " show 0.6s" : "")};

  @keyframes show {
    0%,
    49.99% {
      opacity: 0;
      z-index: 1;
    }

    50%,
    100% {
      opacity: 1;
      z-index: 5;
    }
  }
`;

const OverlayContents = styled.div`
  background: #1c9bef;
  background: -webkit-linear-gradient(to right, #3b7ef3, #1c9bef);
  background: linear-gradient(to right, #3b7ef3, #1c9bef);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: ${(props) =>
    props.$rightpanelactive ? "translateX(50%)" : "translateX(0)"};
  transition: transform 0.6s ease-in-out;
`;

const OverlayContentsLeft = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  box-sizing: border-box;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transition: transform 0.6s ease-in-out;
  transform: ${(props) =>
    props.$rightpanelactive ? "translateX(0)" : "translateX(-20%)"};
  h1 {
    font-family: "Montserrat", sans-serif;
  }
`;

const OverlayContentsRight = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0px 40px;
  box-sizing: border-box;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transition: transform 0.6s ease-in-out;
  right: 0px;
  transform: ${(props) =>
    props.$rightpanelactive ? "translateX(20%)" : "translateX(0)"};

  h1 {
    font-family: "Montserrat", sans-serif;
  }
`;

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  transform: ${(props) => (props.$rightpanelactive ? "translateX(-100%)" : "")};
`;
export default LoginPage;
