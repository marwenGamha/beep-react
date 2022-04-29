import axios from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useState } from "react";

import routes from "../../../routes/superAdmin";
import Popup from "./popUp";
import userPool from "../../../components/UserPool";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import config from "../../../config.json";

import "./login.css";

const LoginAdminPage = () => {
  const history = useHistory();
  const location = useLocation();

  const [message, setmessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  async function loginLogic(e) {
    e.preventDefault();
    setLoading(true);
    setmessage("");
    const registerForm = document.querySelector("form");
    const formData = new FormData(registerForm);

    const tmp = [];
    for (var value of formData.values()) tmp.push(value);

    const data = {
      email: tmp.shift(),
      password: tmp.shift(),
    };

    const authData = {
      Username: data.email,
      Password: data.password,
    };
    const authDetails = new AuthenticationDetails(authData);

    const userData = {
      Username: data.email,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        let jwtToken = result.getIdToken().getJwtToken();
        localStorage.setItem("admin-token", jwtToken);
        setMessageType("ok");
        setmessage("Connexion success : Login ok");
        loginCognitoUser();
      },

      onFailure: (e) => {
        setmessage("Connexion faild ");
        setMessageType("ko");
        setLoading(false);
      },

      newPasswordRequired: (userAttributes, requiredAttributes) => {
        this.setState({
          isFirstLogin: true,
          user: cognitoUser,
          userAttr: userAttributes,
        });

        console.log("userAttributes", userAttributes);
        console.log("requiredAttributes", requiredAttributes);

        // cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
        //   onSuccess(result) {
        //     console.log(result);
        //   },
        //   onFailure(err) {
        //     console.log(err);
        //   },
        // });

        // setOpenPopup(true);

        // cognitoUser.completeNewPasswordChallenge(newPw, userAttributes, {
        //     onSuccess: result => { },)
      },
    });

    const loginCognitoUser = async () => {
      await axios
        .get(`${config.api.invokeurl}/users/${data.email}`)
        .then((r) => {
          setLoading(false);

          const url_before_login = new URLSearchParams(location.search).get(
            "next"
          );
          const isAuthorized = Object.values(routes).includes(url_before_login);

          history.push(
            isAuthorized ? url_before_login : routes.superAdminHomePage
          );
        })
        .catch((e) => {
          const msg = e?.request?.response
            ? JSON.parse(e.request.response).message
            : e.message;
          setmessage(msg);
          setMessageType("ko");
          setLoading(false);
        });
    };
  }

  return (
    <div className="login-container">
      <div className="container-left">
        <img alt="loading" src="../img/login2.jpg" />
      </div>
      <div className="container-right">
        <div className="login">
          <Link to="/">
            <img alt="loading" src="../img/Group73.png"></img>
          </Link>
          <div className="login-title">C'est parti !</div>
          <form onSubmit={loginLogic}>
            <input
              type="email"
              placeholder="Adresse e-mail"
              name="email"
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              name="password"
              required
              autocompele="on"
            />
            {message && (
              <div className={"alert-message " + messageType}>{message}</div>
            )}
            <button type="submit" disabled={loading} className="btn btn-submit">
              Connexion
            </button>
          </form>
          {/* <button
            type="text"
            className="btn btn-submit"
            onClick={() => setOpenPopup(true)}
          >
            popup
          </button> */}
        </div>
      </div>
      <Popup openPopup={openPopup} setOpenPopup={setOpenPopup}></Popup>
    </div>
  );
};

export default LoginAdminPage;
