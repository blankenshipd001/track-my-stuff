import { GetServerSidePropsContext } from "next";
import { verifyIdToken } from "@/utils/firebase/firebaseAdmin";

export const getUserFromCookie = async (ctx: GetServerSidePropsContext) => {
  const token = ctx.req.cookies.token;
  if (token === null || token === undefined || token === "") {
    return null;
  }
  
  const decodedToken = await verifyIdToken(token);
  if (!decodedToken) {
    return null;
  }

  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
    name: decodedToken.name,
    picture: decodedToken.picture,
  };
};