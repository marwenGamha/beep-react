import { CognitoUserPool } from "amazon-cognito-identity-js";
import config from "../config.json";

const POOL_DATA = {
  UserPoolId: config.cognito.USER_POOL_ID,
  ClientId: config.cognito.APP_CLIENT_ID,
};
const userPool = new CognitoUserPool(POOL_DATA);

export default userPool;
