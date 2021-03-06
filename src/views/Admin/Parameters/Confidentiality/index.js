import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import routes from "../../../../routes/restaurant";

import userPool from "../../../../components/UserPool";

import "./confidentiality.css";

const ConfidentialityPage = () => {
  const [societyName, setSocietyName] = useState("");
  const [email, setEmail] = useState("");
  const [imageURL, setImageURL] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const updatePasswordLogic = async (e) => {
    e.preventDefault();
    setLoading(true);

    const changePasswordForm = document.querySelector("form");
    const formData = new FormData(changePasswordForm);

    const tmp = [];
    for (var value of formData.values()) tmp.push(value);

    const data = {
      oldPassword: tmp.shift(),
      newPassword: tmp.shift(),
    };

    let cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      return;
    }

    cognitoUser.getSession(function (err, session) {
      if (err) {
        setMessageType("ko");
        setMessage(err.message || JSON.stringify(err));
        setLoading(false);

        return;
      }
      if (session) {
        cognitoUser.changePassword(
          data.oldPassword,
          data.newPassword,
          (err, result) => {
            if (err) {
              setMessageType("ko");
              setMessage(err.message || JSON.stringify(err));
              setLoading(false);
              return;
            } else if (result) {
              changePasswordForm.reset();
              setMessageType("ok");
              setMessage("password updated succsfully");
              setLoading(false);
            }
          }
        );
      }
    });
  };

  useEffect(() => {
    const { societyName, email, imageURL } = JSON.parse(
      localStorage.getItem("user")
    );
    setEmail(`${email}`);
    setSocietyName(societyName);
    setImageURL(`${imageURL}`);
  }, []);

  return (
    <>
      <div className="confidentiality-container">
        <div className="confidentiality-content">
          <Link className="btn-back" to={routes.adminHomePage}>
            <img alt="loading" src="../../img/btn-back.png" />
            <span>Retour</span>
          </Link>

          <div className="cl">
            <div className="container-left">
              <div className="vertical-menu">
                <div className="confidentiality-image">
                  <img
                    alt="loading"
                    // src={"/api/restaurant/serveimg/" + imageURL}
                  ></img>
                </div>
                <div className="confidentiality-name">
                  <span>{societyName}</span>
                </div>
                <div className="separation"></div>
                <div className="confidentiality-settings">
                  <Link to={routes.adminAccountPage}>
                    <span>Compte</span>
                  </Link>
                  <Link to={routes.adminLogoPage}>
                    <span>Logo</span>
                  </Link>
                  <Link className="active" to={routes.adminConfidentialityPage}>
                    <span>Confidentialit??</span>
                  </Link>
                  <Link to={routes.adminPaymentPage}>
                    <span>Modes de paiement</span>
                  </Link>
                  <Link to={routes.adminQRCode}>
                    <span>G??n??rer Qrcode</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="container-right">
              <div className="confidentiality">
                <form onSubmit={updatePasswordLogic}>
                  <label className="email confidentiality-title">E-mail</label>
                  <input
                    defaultValue={email}
                    placeholder="Nom et pr??nom du responsable"
                    disabled="disabled"
                  />
                  <label className="password confidentiality-title">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    placeholder="Saisir votre mot de passe actuel"
                    name="password-old"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Saisir votre nouveau mot de passe"
                    name="password-new"
                    required
                  />

                  {message && (
                    <div className={"alert-message " + messageType}>
                      {message}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-confidentiality-submit"
                  >
                    Enregistrer
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfidentialityPage;
