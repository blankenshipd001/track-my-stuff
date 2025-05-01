// import { cookies } from "next/headers";
// import { adminAuth } from "./admin";

// export const getUserFromCookies = async () => {

//   console.log("getUserFromCookies");

//   const cookieStore = cookies();
//   const token = cookieStore.get("__session")?.value;

//   if (!token) return null;

//   try {
//     const decodedToken = await adminAuth.verifyIdToken(token);
//     return decodedToken;
//   } catch (err) {
//     console.error("Invalid or expired token:", err);
//     return null;
//   }
// };