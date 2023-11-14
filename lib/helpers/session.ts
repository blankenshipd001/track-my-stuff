
import { User as FirebaseUser } from "firebase/auth";

/**
 * Handle storing/retrieving a user from sessionStorage
 * 
 * @param {FirebaseUser} user 
 */
export const startSession = (user: FirebaseUser) => {
    sessionStorage.setItem("email", user.email ?? '');
    sessionStorage.setItem("accessToken", user.getIdTokenResult());
  }
  
  export const getSession = () => {
    return {
      email: sessionStorage.getItem("email"),
      accessToken: sessionStorage.getItem("accessToken"),
    }
  }
  
  export const endSession = () => {
    sessionStorage.clear();
  }
  
  export const isLoggedIn = () => {
    return getSession().accessToken;
  }