import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import routes from "../../../../routes/restaurant";

import config from "../../../../config.json";

import "./account.css";

const AccountPage = () => {
  const [responsableFullName, setFullname] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [societyName, setSocietyName] = useState("");
  const [siretNumber, setSiretNumber] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [fieldOfActivity, setFieldOfActivity] = useState("");

  const [message, setmessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const updateAccountLogic = async (e) => {
    e.preventDefault();
    setLoading(true);
    setmessage("");

    const registerForm = document.querySelector("form");
    const formData = new FormData(registerForm);

    const tmp = [];
    for (var value of formData.values()) tmp.push(value);

    const data = {
      responsableFullName: tmp.shift(),
      societyName: tmp.shift(),
      siretNumber: tmp.shift(),
      address: tmp.shift(),
      phone: tmp.shift(),
      fieldOfActivity: tmp.shift(),
    };

    const { id } = JSON.parse(localStorage.getItem("user"));

    await axios.put(`${config.api.invokeurl}/users/update/${id}`, data);
  };

  useEffect(() => {
    const {
      responsableFullName,
      societyName,
      imageURL,
      siretNumber,
      address,
      phone,
      fieldOfActivity,
    } = JSON.parse(localStorage.getItem("user"));
    setImageURL(`${imageURL}`);
    setSocietyName(societyName);
    setFullname(responsableFullName);
    setSiretNumber(siretNumber);
    setAddress(address);
    setPhone(phone);
    setFieldOfActivity(fieldOfActivity);
  }, []);

  return (
    <>
      <div className="account-container">
        <div className="account-content">
          <Link className="btn-back" to={routes.adminHomePage}>
            <img alt="loading" src="../../img/btn-back.png"></img>
            <span>Retour</span>
          </Link>
          <div className="cl">
            <div className="container-left">
              <div className="vertical-menu">
                <div className="account-image">
                  <img
                    alt="loading"
                    // src={"/api/restaurant/serveimg/" + imageURL}
                  ></img>
                </div>
                <div className="account-name">
                  <span>{societyName}</span>
                </div>
                <div className="separation"></div>
                <div className="account-settings">
                  <Link className="active" to={routes.adminAccountPage}>
                    <span>Compte</span>
                  </Link>
                  <Link to={routes.adminLogoPage}>
                    <span>Logo</span>
                  </Link>
                  <Link to={routes.adminConfidentialityPage}>
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
              <div className="account">
                <div className="account-title">Information Professionnelle</div>
                <form onSubmit={updateAccountLogic}>
                  <input
                    defaultValue={responsableFullName}
                    placeholder="Nom et pr??nom du responsable"
                    name="responsableFullName"
                  ></input>
                  <input
                    defaultValue={societyName}
                    placeholder="Nom de la soci??t??"
                    name="societyName"
                  ></input>
                  <input
                    defaultValue={siretNumber}
                    placeholder="Num??ro de siret"
                    name="siretNumber"
                  ></input>
                  <input
                    defaultValue={address}
                    placeholder="Adresse du siege social"
                    name="address"
                  ></input>
                  <input
                    defaultValue={phone}
                    placeholder="Num??ro de t??l??phone"
                    name="phone"
                  ></input>
                  <select
                    name="fieldOfActivity"
                    defaultValue={fieldOfActivity}
                    onChange={() => {}}
                  >
                    <option value="Restaurant" title="Restaurant">
                      Restaurant
                    </option>
                    <option
                      value="Soci??t?? ?? responsabilit?? limit??e (SARL)"
                      title="Soci??t?? ?? responsabilit?? limit??e (SARL)"
                    >
                      Soci??t?? ?? responsabilit?? limit??e (SARL)
                    </option>
                    <option
                      value="Soci??t?? unipersonnelle ?? responsabilit?? limit??e (SUARL)"
                      title="Soci??t?? unipersonnelle ?? responsabilit?? limit??e (SUARL)"
                    >
                      Soci??t?? unipersonnelle ?? responsabilit?? limit??e (SUARL)
                    </option>
                    <option
                      value="Soci??t?? anonyme (SA)"
                      title="Soci??t?? anonyme (SA)"
                    >
                      Soci??t?? anonyme (SA)
                    </option>
                    <option
                      value="Soci??t?? en commandite par actions (SCA)"
                      title="Soci??t?? en commandite par actions (SCA)"
                    >
                      Soci??t?? en commandite par actions (SCA)
                    </option>
                  </select>
                  {message && (
                    <div className={"alert-message " + messageType}>
                      {message}
                    </div>
                  )}

                  <button type="submit" className="btn btn-account-submit">
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

export default AccountPage;
