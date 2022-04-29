import axios from "axios";
import config from "../../../config.json";

import { useState } from "react";
import { Link } from "react-router-dom";
import userPool from "../../../components/UserPool";
import { CognitoUser } from "amazon-cognito-identity-js";
import { useHistory } from "react-router-dom";

import "./confirm.css";

const ConfirmUser = () => {
  const history = useHistory();

  const [message, setmessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const loginLogic = async (e) => {
    e.preventDefault();
    setLoading(true);
    setmessage("");
    const resetPasswordForm = document.querySelector("form");
    const formData = new FormData(resetPasswordForm);

    const tmp = [];
    for (var value of formData.values()) tmp.push(value);

    const data = {
      email: tmp.shift(),
      code: tmp.shift(),
    };

    const userData = {
      Username: data.email,
      Pool: userPool,
    };

    const cognitUser = new CognitoUser(userData);

    const params = {
      email: data.email,
    };

    cognitUser.confirmRegistration(data.code, true, async (err, result) => {
      if (result) {
        const res = await axios.put(
          `${config.api.invokeurl}/users/confirmed`,
          params
        );
        setmessage("user confirmed successfully");
        setMessageType("ok");
        setLoading(false);
        history.push("/login");
      } else if (err) {
        const msg = err.message || JSON.stringify(err);
        setmessage(msg);
        setMessageType("ko");
        setLoading(false);
      }
    });
  };

  return (
    <div className="forgotPassword-container">
      <div className="container-left">
        <img alt="loading" src="../img/login3.jpg" />
      </div>
      <div className="container-right">
        <div className="login">
          <Link to="/">
            <img alt="loading" src="../img/Group73.png"></img>
          </Link>
          <div className="login-title">Réinitialiser mot de passe</div>
          <form onSubmit={loginLogic}>
            <input
              type="email"
              placeholder="Votre adresse e-mail"
              name="email"
              required
            />
            <input type="code" placeholder="Code" name="code" required />
            {message && (
              <div className={"alert-message " + messageType}>{message}</div>
            )}
            <button type="submit" disabled={loading} className="btn btn-submit">
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmUser;
