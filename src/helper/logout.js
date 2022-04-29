import userPool from "../components/UserPool";

export default function logout(_callback) {
  getAuthenticatedUser().signOut();

  localStorage.removeItem("admin-token");
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  _callback();
}

const getAuthenticatedUser = () => {
  return userPool.getCurrentUser();
};
