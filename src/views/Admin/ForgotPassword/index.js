import { useState } from "react";
import { Link } from "react-router-dom";
import userPool from "../../../components/UserPool";
import { CognitoUser } from "amazon-cognito-identity-js";

import { useHistory } from "react-router-dom";

import "./forgot-password.css";

const ForgotPassword = () => {
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
      password: tmp.shift(),
    };

    const userData = {
      Username: data.email,
      Pool: userPool,
    };
    const cognitUser = new CognitoUser(userData);

    cognitUser.forgotPassword({
      onSuccess: function (result) {
        resetPasswordForm.reset();
        setmessage(
          "Veuillez vérifier votre adresse e-mail,le code de réinitialisation a été envoyée "
        );
        setMessageType("ok");
        setLoading(false);
        history.push("/reset-password");
      },
      onFailure: function (err) {
        setmessage("Échec de la réinitialisation du mot de passe");
        setMessageType("ko");
        setLoading(false);
      },
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
            ></input>
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

export default ForgotPassword;
