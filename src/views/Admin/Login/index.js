import axios from "axios";
import { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import routes from "../../../routes/restaurant";

import userPool from "../../../components/UserPool";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import config from "../../../config.json";

import "./login.css";

const LoginPage = () => {
  const history = useHistory();
  const location = useLocation();

  const [message, setmessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const loginLogic = async (e) => {
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

    await axios
      .get(`${config.api.invokeurl}/users/isblocked/${data.email}`)
      .then((r) => {
        if (r.data.message == true) {
          setmessage(
            "email est bloquer,Attentat la validation par notre admin "
          );
          setMessageType("ko");
          setLoading(false);
        } else if (r.data.message == false) {
          cognitoUser.authenticateUser(authDetails, {
            onSuccess: (result) => {
              let jwtToken = result.getIdToken().getJwtToken();
              localStorage.setItem("token", jwtToken);

              const log = loginCognitoUser();
              setMessageType("ok");
              setmessage("Connexion success : Login ok");
            },

            onFailure: (e) => {
              const msg = e.message || JSON.stringify(e);
              setmessage(msg);
              setMessageType("ko");
              setLoading(false);
            },

            newPasswordRequired: (data) => {
              console.log("newPasswordRequired", data);
            },
          });
        }
      })
      .catch((err) => {
        setmessage("Oops, Something Went Wrong !");
        setMessageType("ko");
        setLoading(false);
      });

    const loginCognitoUser = async () => {
      await axios
        .get(`${config.api.invokeurl}/users/${data.email}`)
        .then((r) => {
          localStorage.setItem("user", JSON.stringify(r.data));

          setLoading(false);
          registerForm.reset();

          const url_before_login = new URLSearchParams(location.search).get(
            "next"
          );
          const isAuthorized = Object.values(routes).includes(url_before_login);

          history.push(isAuthorized ? url_before_login : routes.adminHomePage);
        })
        .catch((e) => {
          const msg = e.message || JSON.stringify(e);
          setmessage(msg);
          setMessageType("ko");
          setLoading(false);
        });
    };
  };

  return (
    <div className="login-container">
      <div className="container-left">
        <img alt="loading" src="../img/login1.jpg" />
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
          <div className="links">
            <Link className="login-link" to={routes.adminForgotPassword}>
              Mot de passe oublié ?
            </Link>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <Link className="login-link" to={routes.adminRegisterProPage}>
              Demande de partenariat ?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
