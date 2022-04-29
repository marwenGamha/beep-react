import { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import routes from "../../../routes/restaurant";

import userPool from "../../../components/UserPool";

import { CognitoUser } from "amazon-cognito-identity-js";

import "./reset-password.css";

const LoginPage = () => {
  const history = useHistory();

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [canUpdate, setCanUpdate] = useState(true);
  const params = useParams();

  const resetPasswordLogic = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const resetPasswordForm = document.querySelector("form");
    const formData = new FormData(resetPasswordForm);

    const tmp = [];
    for (var value of formData.values()) tmp.push(value);

    const data = {
      email: tmp.shift(),
      code: tmp.shift(),
      newPassword1: tmp.shift(),
    };

    const userData = {
      Username: data.email,
      Pool: userPool,
    };
    const cognitUser = new CognitoUser(userData);

    cognitUser.confirmPassword(data.code, data.newPassword1, {
      onSuccess() {
        resetPasswordForm.reset();
        setMessage("success");
        setMessageType("ok");
        setLoading(false);
        history.push("/login");

        // setCanUpdate(false);
      },
      onFailure(e) {
        const msg = e.message || JSON.stringify(e);
        setMessage(msg);
        setMessageType("ko");
        setLoading(false);
      },
    });
  };

  return (
    <>
      <div className="resetPassword-container">
        <div className="container-left">
          <img alt="loading" src="../img/login3.jpg" />
        </div>
        <div className="container-right">
          {loading ? (
            <div className="container-loader">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="login">
              <Link to="/">
                <img alt="loading" src="../img/Group73.png"></img>
              </Link>
              {canUpdate === true ? (
                <>
                  <div className="login-title">Modifier votre mot de passe</div>
                  <form onSubmit={resetPasswordLogic}>
                    <input
                      type="email"
                      placeholder="Adresse e-mail"
                      name="email"
                      required
                    />
                    <input
                      type="code"
                      placeholder="code"
                      name="code"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Nouveau mot de passe"
                      name="new-password1"
                      required
                    ></input>
                    {/* <input
                      type="password"
                      placeholder="Vérifier le nouveau mot de passe"
                      name="new-password2"
                      required
                    ></input> */}
                    {message && (
                      <div className={"alert-message " + messageType}>
                        {message}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-submit"
                    >
                      Modifier
                    </button>
                  </form>
                </>
              ) : (
                message && (
                  <>
                    <div className={"alert-message " + messageType}>
                      {message}
                    </div>
                    {messageType === "ko" ? (
                      <Link
                        className="login-link"
                        to={routes.adminForgotPassword}
                      >
                        Envoyer un autre Email ?
                      </Link>
                    ) : (
                      <Link className="login-link" to={routes.adminLoginPage}>
                        Page de connexion ?
                      </Link>
                    )}
                  </>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginPage;
