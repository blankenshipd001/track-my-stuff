// import admin from '@/utils/admin';
// import { GetServerSideProps, NextPage } from 'next';
import {  NextPage } from 'next';

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const token = context.req.cookies.token;

//     if (token == null) {
//       return;
//     }

//     const decodedToken = await admin.auth().verifyIdToken(token);

//     return {
//       props: {
//         message: `Your email is ${decodedToken.email}`,
//       },
//     };
//   } catch (error) {
//     // Redirect to login if token is invalid
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }
// };

const ProtectedPage: NextPage<{ message: string }> = ({ message }) => {
  return <div>{message}</div>;
};

export default ProtectedPage;