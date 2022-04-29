import axios from "axios";
import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import routes from "../index";
import userPool from "../../components/UserPool";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(false);

  const homeRedirection = {
    admin: routes.adminHomePage,
    superAdmin: routes.superAdminHomePage,
  };

  const connect = async () => {
    let isAuth = false;
    // return await axios.get(`${config.api.invokeurl}/connect`);

    // var userPooll = new CognitoUserPool(userPool);
    let cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
        }
        isAuth = session.isValid();
      });
    }
    return isAuth;

    // return await axios({
    //   url: localStorage.getItem("admin-token")
    //     ? "/api/admin/connect"
    //     : "/api/restaurant/admin/connect",
    //   method: "GET",
    //   headers: {
    //     Authorization: `auth-token:${_token}`,
    //     "Content-Type": "application/json",
    //   },
    // });
  };

  useEffect(() => {
    // const email = localStorage.getItem("email");

    // const res = await axios
    //   .get(`${config.api.invokeurl}/users/isadmin/marouen.gamha@notitia-tn.com`)
    //   .then((r) => {
    //     console.log(r);

    //     if (r.data.message == false) {
    //       setRole("admin");
    //     } else if (r.data.message == true) {
    //       setRole("superAdmin");
    //     }
    //   })

    const _token_admin = localStorage.getItem("token");
    const _token_superAdmin = localStorage.getItem("admin-token");

    if (_token_admin) {
      setRole("admin");
    } else if (_token_superAdmin) {
      setRole("superAdmin");
    }

    const token = _token_admin || _token_superAdmin;
    //connect()
    if (token) {
      async function fetchData() {
        await connect()
          .then((res) => {
            if (res === false) {
              setIsAuthenticated(false);
              // localStorage.removeItem("token");
              // localStorage.removeItem("admin-token");
            } else {
              setIsAuthenticated(true);
            }
            setIsLoading(false);
          })
          .catch((e) => {});
      }
      fetchData();
    } else {
      setIsLoading(false);
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoading) return <></>;

        if (isAuthenticated) {
          if (rest.requiredRole === role) return <Component {...props} />;
          return (
            <Redirect
              to={{
                pathname: homeRedirection[role],
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
        return (
          <Redirect
            to={{
              pathname:
                rest.requiredRole === "admin"
                  ? routes.adminLoginPage
                  : routes.superAdminLoginPage,
              search:
                rest.path.toLowerCase() ===
                props.location.pathname.toLowerCase()
                  ? `?next=${rest.path}`
                  : false,
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
